// import Async, { useAsync } from 'react-async';
// import Dexie from 'dexie';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

var headers = {
    'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj'
};

const cookies = new Cookies();

const getData = async (uri) => {
    console.log(uri);
    const res = await fetch('https://prod-api.nostra.ai/content/?site=https://ec2.nostraprod.com&content=content&page=/&referrer=default', {
        headers: headers
    });
    return res;
}

const getProfile = async () => {
    const res = await fetch('https://prod-api.nostra.ai/internal/?site=https://ec2.nostraprod.com&setting=config&page=/', {
        headers: headers
    });
    return res;
}

function generateLayout(variations, context, page) {
    var layout = []
    var arm = []
    variations = variations.flat()

    for (var i = 0, sum = 0; i < variations.length; i++) {
        var selectedVariation = Math.floor(Math.random() * variations[i]);
        layout.push(selectedVariation);
        arm.push(sum + selectedVariation);
        sum += variations[i];
    }

    return [{ "context": context, "page": page, "arm": arm, "reward": 0, "ctr": 0 }, layout];
}

function armToLayout(variations, arm) {
    variations = variations.flat()
    var layout = []
    for (var i = 0, sum = 0; i < variations.length; i++) {
        if (i === 0) {
            layout.push(arm[i])
            sum += variations[i]
        } else {
            layout.push(Math.abs(sum - arm[i]));
            sum += variations[i]
        }
    }
    return layout
}

function createCookie(name, value, expire = false) {
    // const result = { 'key': cookieKey };
    if (name === "nostra-ref") {
        // result["value"] = name + "=" + value + "; Path=/; Expires=Thu, 04 Jan 2035 00:00:01 GMT; SameSite=Lax; Secure";
        cookies.set(name, value, { path: '/', expires: new Date(2051481601000), sameSite: "lax", secure : true});
    } else {
        if (!expire) {
            // result["value"] = name + "=" + value + "; Path=/; SameSite=Lax; Secure";
            cookies.set(name, value, { path: '/', sameSite: "lax", secure : true });
        } else {
            // result["value"] = name + "=" + value + "; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure";
            cookies.remove(name, value, { path: '/', expires: new Date(0), sameSite: "lax", secure : true});
        }
    }
    
}

const determineLayout = (nostra_layout, nostra_context, uri, contentShowDefault, change_layout, variations, machine_learning_info, awsPersonalize) => {
    // Need to take in as input
    // var nostra_layout = undefined; // or an actual layout ('0, 1, 0')
    // var nostra_context = "google1"; // determined on cookie, query string, or organic
    // var uri = "/"; // current URI
    // var contentShowDefault = true; // determined in content call
    // var change_layout = false; // determined by cookies
    // var variations = [[2, 3, 3]]; // Nostra.ai // Determined in content call
    // var machine_learning_info = {
    //     "arn": "...",
    //     "showRandom": true,
    //     "probabilityDefault": 20,
    //     "EventTrackingID": "..."
    // };
    // var awsPersonalize = { // Determined in AWS Personalize call
    //     "status": 200,
    //     "data": {}
    // };
    var temp_arm;
    var randLayout;

    var randNum = Math.floor(Math.random() * 100) + 1;
    console.log("Input: " + machine_learning_info["probabilityDefault"] + " Rand: " + randNum);
    cookies.set('nostra-random-number', { "rand": randNum, "machine_learning_prob": machine_learning_info["probabilityDefault"]}, { path: '/' });

    if (contentShowDefault || (randNum >= machine_learning_info["probabilityDefault"]) || awsPersonalize["status"] !== 200) { // TODO: NEED TO BE ABLE TO TELL THAT THIS IS DEFAULT DATA (DO NOT TRAIN ON)
        console.log("DEFAULT LAYOUT");
        nostra_layout = new Array(variations.flat().length).fill(0);
        console.log(nostra_layout)
        console.log({ "context": nostra_context, "page": uri, "arm": "baseline", "ctr": 0, "reward": 0 })
        cookies.set('nostra-bandit', JSON.stringify({ "context": nostra_context, "page": uri, "arm": "baseline", "ctr": 0, "reward": 0 }), { path: '/' });
        cookies.set("nostra-layout-" + uri, nostra_layout, { path: '/' });
    } else if (nostra_layout === undefined || change_layout) {
        var bandit;

        if (machine_learning_info["showRandom"]) {
            if ("random-arms" in machine_learning_info) {
                console.log("> 2000 layout possibilities");
                // if they have more than 2000 variations, we need to pick one from a given list
                var rand_arms_db = machine_learning_info["random-arms"];
                var pos = Math.floor(Math.random() * rand_arms_db.length);

                temp_arm = JSON.parse(rand_arms_db[pos]);
                nostra_layout = armToLayout(variations, temp_arm);
                bandit = { "context": nostra_context, "page": uri, "arm": temp_arm, "ctr": 0, "reward": 0 };
            } else {
                console.log("< 2000 layout possibilities");
                // Random layout if company has less than 2000 layouts for a given page
                randLayout = generateLayout(variations, nostra_context, uri);
                nostra_layout = randLayout[1];
                bandit = randLayout[0];
            }
        } else if (awsPersonalize["status"] === 200) {
            console.log("AWS PERSONALIZE");
            temp_arm = JSON.parse(awsPersonalize["data"][0]["itemId"]);
            nostra_layout = armToLayout(variations, temp_arm);
            bandit = { "context": nostra_context, "page": uri, "arm": temp_arm, "ctr": 0, "reward": 0 };
        } else {
            console.log("RANDOM LAYOUT");
            randLayout = generateLayout(variations, nostra_context, uri);
            nostra_layout = randLayout[1];
            bandit = randLayout[0];
        }

        localStorage.setItem(uri, JSON.stringify(nostra_layout))
        cookies.set('nostra-bandit', bandit, { path: '/' });
        cookies.set("nostra-layout-" + uri, nostra_layout, { path: '/' });
    } else {
        nostra_layout = JSON.parse("[" + nostra_layout + "]");
    }
}

const determineCookies = (nostra_cookie_uuid, nostra_cookie_context, nostra_cookie_pages, tracked_uris, nostra_qs) => {
    var nostra_uid = nostra_cookie_uuid;
    var nostra_context = nostra_cookie_context;
    var change_layout = false;
    var tracked_uris_array = Object.keys(tracked_uris)

    if (nostra_cookie_pages !== 0 && nostra_cookie_context !== undefined) {

        if (nostra_cookie_context === undefined || (nostra_qs !== nostra_cookie_context && nostra_qs !== undefined)) {
            change_layout = true
            nostra_context = nostra_qs !== undefined ? nostra_qs : "organic"
           createCookie("nostra-context", nostra_context)
            for (let pos = 0; pos < tracked_uris_array.length; pos++) {
                createCookie('nostra-layout-' + tracked_uris_array[pos], "expired", true)
            }
        }

        if (nostra_cookie_uuid === undefined) {
            change_layout = true
            nostra_uid = uuidv4();
            createCookie("nostra-uuid", nostra_uid)
            for (let pos = 0; pos < tracked_uris_array.length; pos++) {
                createCookie('nostra-layout-' + tracked_uris_array[pos], "expired", true)
            }
        }

    } else if (nostra_cookie_pages === 0 && nostra_cookie_context !== undefined) {
        change_layout = true
        nostra_uid = uuidv4();
        createCookie("nostra-uuid", nostra_uid)
        
        for (let pos = 0; pos < tracked_uris_array.length; pos++) {
            createCookie('nostra-layout-' + tracked_uris_array[pos], "expired", true)
        }

        if (nostra_cookie_context === undefined || (nostra_qs !== nostra_cookie_context && nostra_qs !== undefined)) {
            nostra_context = nostra_qs !== undefined ? nostra_qs : "organic"
            createCookie("nostra-context", nostra_context)
        }

    } else {
        change_layout = true
        nostra_uid = uuidv4();
        createCookie("nostra-uuid", nostra_uid)
        for (let pos = 0; pos < tracked_uris_array.length; pos++) {
            createCookie('nostra-layout-' + tracked_uris_array[pos], "expired", true)
        }

        nostra_context = nostra_qs !== undefined ? nostra_qs : "organic"
        createCookie("nostra-context", nostra_context)
    }
    
    return [nostra_uid, nostra_context, change_layout]
}

function sendToHistory(uid, site, history) {
    var urlToSend = 'https://prod-api.nostra.ai/history/';

    const formBody = new URLSearchParams({
        'uid': uid,
        'history': history,
        'site': site
    })

    // window.localStorage.setItem("lastSentTime", parseInt(Date.now() / 1000).toString());

    // return fetch(urlToSend, {
    //     method: 'PUT',
    //     body: formBody,
    //     headers: headers
    // });
}


export const NostraInit = () => {
    // TODO: Remember to uncomment
    // window.indexedDB.deleteDatabase("nostra");

    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // PUT request using fetch with async/await
        // async function updatePost() {
        //     var urlToSend = 'https://prod-api.nostra.ai/history/';

        //     const formBody = new URLSearchParams({
        //         'uid': cookies.get('nostra-uuid'),
        //         'history': history,
        //         'site': window.location.href
        //     })
        //     window.localStorage.setItem("lastSentTime", parseInt(Date.now() / 1000).toString());

        //     fetch(urlToSend, {
        //         method: 'PUT',
        //         body: formBody,
        //         headers: headers
        //     });
        // }

        // updatePost();
        
        const profile = getProfile();

        profile.then(response => {
            if(response.ok){                
                return response.json();
            }
            throw response;
        }).then(incData => {
            const uri = window.location.pathname.replace(".", "-");
            if(incData["tracked-uris"][uri] !== undefined){
                const data = getData(uri);

                console.log("Nostra tracks this URI");
                console.log("Beging cookie logic");
                
                var nostra_cookie_uuid = cookies.get("nostra-context");
                var nostra_cookie_context = cookies.get("nostra-uuid");
                var nostra_layout = cookies.get("nostra-layout-" + uri);
                var nostra_cookie_pages = cookies.get("nostra-pages");
                nostra_cookie_pages = nostra_cookie_pages !== undefined ? parseInt(nostra_cookie_pages) : nostra_cookie_pages;
                var tracked_uris = incData["tracked-uris"];

                const queryParams = new URLSearchParams(window.location.search)
                var nostra_qs = undefined;
                var nostra_inc_qs = queryParams.get('nostra');
                var utm_source = queryParams.get('utm_source');
                var utm_campaign = queryParams.get('utm_campaign');

                if(utm_source || utm_campaign){
                    var utm_medium = queryParams.get('utm_medium');
                    var utm_term = queryParams.get('utm_term');
                    var utm_content = queryParams.get('utm_content');

                    createCookie('nostra-utm', JSON.stringify({
                        "utm_source": utm_source,
                        "utm_campaign": utm_campaign,
                        "utm_medium": utm_medium,
                        "utm_term" : utm_term,
                        "utm_content": utm_content,
                    }));
    
                    var modifyString = (s) => {
                        var result = (s ? s : "null");
                        if(result !== "null"){
                            result = result.split(".").join("~");
                            result = result.split("}").join("");
                            result = result.split("{").join("");
                            result = result.split(":").join(";");
                        }
    
                        return result;
                    }
    
                    nostra_qs = modifyString(utm_source) + "-" + modifyString(utm_campaign) + "-" + modifyString(utm_medium)
    
                }else if(nostra_inc_qs){
                    if (typeof nostra_inc_qs !== 'string' && nostra_inc_qs !== undefined) {
                        nostra_qs = nostra_inc_qs[0];
                    }else{
                        nostra_qs = nostra_inc_qs;
                    }
    
                    if (nostra_qs === "page") {
                        throw new Error("nostra=page -> show original content");
                    }
                }

                const [nostra_uid, nostra_context, change_layout] = determineCookies(nostra_cookie_uuid, nostra_cookie_context, nostra_cookie_pages, tracked_uris, nostra_qs);

                data.then(dataResponse => {
                    if(dataResponse.ok){                
                        return dataResponse.json();
                    }
                    throw dataResponse;
                }).then(dataIncResponse => {

                    console.log("Cookie logic has completed, values: ");
                    console.log("uid", nostra_uid);
                    console.log("context", nostra_context);
                    console.log("layout: ", nostra_layout);
                    console.log("change layout?", change_layout);
    
                    // determineLayout();
        
                    setData(dataIncResponse);
                }).catch(error => {
                    console.error("Error fetching data: ", error);
                    setError(error);
                }).finally(() => {
                    setLoading(false);
                });
            }else{
                throw new Error("not tracked -> show original content")
            }
            
        }).catch(error => {
            console.error("Error fetching data: ", error);
            setError(error);
        });
    }, []);


    if(!isLoading){
        console.log("Done loading!");
        console.log(data)
    }else if(error){
        console.log("we need to just show original content");
    }

    
    // var db = new Dexie("nostra");
    // var db_version = db.version(1);

    return (
        <React.Fragment>

        </React.Fragment>
    )

}