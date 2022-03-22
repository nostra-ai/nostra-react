import Async, {useAsync} from 'react-async';
import Dexie from 'dexie';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

const getData = async (uri) => {
    console.log(uri);
    const res = await fetch('https://prod-api.nostra.ai/content/?site=https://ec2.nostraprod.com&content=content&page=/&referrer=default', {
        headers: { 'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj' }
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

const getProfile = async () => {
    const res = await fetch('https://prod-api.nostra.ai/internal/?site=https://ec2.nostraprod.com&setting=config&page=/', {
        headers: { 'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj' }
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
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
        if (i == 0) {
            layout.push(arm[i])
            sum += variations[i]
        } else {
            layout.push(Math.abs(sum - arm[i]));
            sum += variations[i]
        }
    }
    return layout
}

const determineLayout = () => {
    // Need to take in as input
    var nostra_layout = undefined; // or an actual layout ('0, 1, 0')
    var nostra_context = "google1"; // determined on cookie, query string, or organic
    var uri = "/"; // current URI
    var contentShowDefault = true; // determined in content call
    var change_layout = false; // determined by cookies
    var variations = [[2, 3, 3]]; // Nostra.ai // Determined in content call
    var machine_learning_info = { // Determined in content call
        "showRandom" : true,
        "probabilityDefault" : 1
    };
    var awsPersonalize = { // Determined in AWS Personalize call
        "status" : 200,
        "data" : {}
    };

    var randNum = Math.floor(Math.random() * 100) + 1;
    console.log("Input: " + machine_learning_info["probabilityDefault"] + " Rand: " + randNum);

    if (contentShowDefault || (randNum <= machine_learning_info["probabilityDefault"]) || awsPersonalize["status"] != 200) { // TODO: NEED TO BE ABLE TO TELL THAT THIS IS DEFAULT DATA (DO NOT TRAIN ON)
        console.log("DEFAULT LAYOUT");
        nostra_layout = new Array(variations.flat().length).fill(0);
        console.log(nostra_layout)
        console.log({ "context": nostra_context, "page": uri, "arm": "baseline", "ctr": 0, "reward": 0 })
        // updated_cookies["nostra-bandit"] = createCookie("nostra-bandit", JSON.stringify({ "context": nostra_context, "page": uri, "arm": "baseline", "ctr": 0, "reward": 0 }), 'SET-COOKie');
        // updated_cookies["nostra-layout-" + uri] = createCookie("nostra-layout-" + uri, nostra_layout, 'sEt-CoOkiE');
    } else if (nostra_layout == undefined || change_layout) {
        var bandit;

        if(machine_learning_info["showRandom"]){
            if("random-arms" in machine_learning_info){
                console.log("> 2000 layout possibilities");
                // if they have more than 2000 variations, we need to pick one from a given list
                var rand_arms_db = machine_learning_info["random-arms"];
                var pos = Math.floor(Math.random() * rand_arms_db.length);

                var temp_arm = JSON.parse(rand_arms_db[pos]);
                nostra_layout = armToLayout(variations, temp_arm);
                bandit = { "context": nostra_context, "page": uri, "arm": temp_arm, "ctr": 0, "reward": 0 };
            }else{
                console.log("< 2000 layout possibilities");
                // Random layout if company has less than 2000 layouts for a given page
                var randLayout = generateLayout(variations, nostra_context, uri);
                nostra_layout = randLayout[1];
                bandit = randLayout[0];
            }
        }else if (awsPersonalize["status"] == 200) {
            console.log("AWS PERSONALIZE");
            var temp_arm = JSON.parse(awsPersonalize["data"][0]["itemId"]);
            nostra_layout = armToLayout(variations, temp_arm);
            bandit = { "context": nostra_context, "page": uri, "arm": temp_arm, "ctr": 0, "reward": 0 };
        } else {
            console.log("RANDOM LAYOUT");
            var randLayout = generateLayout(variations, nostra_context, uri);
            nostra_layout = randLayout[1];
            bandit = randLayout[0];
        }

        // updated_cookies["nostra-bandit"] = createCookie("nostra-bandit", JSON.stringify(bandit), 'SET-COOKie');
        // updated_cookies["nostra-layout-" + uri] = createCookie("nostra-layout-" + uri, nostra_layout, 'sEt-CoOkiE');
        console.log(nostra_layout)
        console.log(bandit)
    } else {
        nostra_layout = JSON.parse("[" + nostra_layout + "]");
    }
}


export const NostraInit = () => {
    // TODO: Remember to uncomment
    // window.indexedDB.deleteDatabase("nostra");
    determineLayout()
    const cookies = new Cookies();
    cookies.set('nostra-uuid', uuidv4(), { path: '/' });
    cookies.set('nostra-uri', location.pathname.substring(1), { path: '/' });

    return <>
        <Async promiseFn={getProfile}>
            {({ data, error, isPending }) => {
                if (isPending) {
                    return null
                }
                if (error) {
                    return null
                }
                if (data) {
                    var db = new Dexie("nostra");
                    db.version(1).stores({
                        localData: "id,data"
                    });

                    db.localData.add({ id: "profile", data: JSON.stringify(data) });

                    // var trackedUris = data['tracked-uris'];

                    // for(var k in trackedUris) {
                    //     <Async promiseFn={getData}>
                    //         {({ data, error, isPending }) => {
                    //             if (isPending) {
                    //                 return null
                    //             }
                    //             if (error) {
                    //                 return null
                    //             }
                    //             if (data) {
                    //                 var db = new Dexie("nostra");
                    //                 db.version(1).stores({
                    //                     localData: "id,data"
                    //                 });

                    //                 db.localData.add({ id: "content" + trackedUris[k], data: JSON.stringify(data) });
                    //             }
                    //             return null
                    //         }}
                    //     </Async>
                    // }

                }
                return null
            }}
        </Async>
        <Async promiseFn={getData}>
                {({ data, error, isPending }) => {
                if (isPending) {
                    return null
                }
                if (error) {
                    return null
                }
                if (data) {
                    var db = new Dexie("nostra");
                    db.version(1).stores({
                        localData: "id,data"
                    });

                    db.localData.add({ id: "content", data: JSON.stringify(data) });
                }
                return null
            }}
        </Async>
    </>

}