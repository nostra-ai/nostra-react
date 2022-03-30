var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import Async, { useAsync } from 'react-async';
import Dexie from 'dexie';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

var getData = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(uri) {
        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log(uri);
                        _context.next = 3;
                        return fetch('https://prod-api.nostra.ai/content/?site=https://ec2.nostraprod.com&content=content&page=/&referrer=default', {
                            headers: { 'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj' }
                        });

                    case 3:
                        res = _context.sent;

                        if (res.ok) {
                            _context.next = 6;
                            break;
                        }

                        throw new Error(res.statusText);

                    case 6:
                        return _context.abrupt('return', res.json());

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    }));

    return function getData(_x) {
        return _ref.apply(this, arguments);
    };
}();

var getProfile = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return fetch('https://prod-api.nostra.ai/internal/?site=https://ec2.nostraprod.com&setting=config&page=/', {
                            headers: { 'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj' }
                        });

                    case 2:
                        res = _context2.sent;

                        if (res.ok) {
                            _context2.next = 5;
                            break;
                        }

                        throw new Error(res.statusText);

                    case 5:
                        return _context2.abrupt('return', res.json());

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    }));

    return function getProfile() {
        return _ref2.apply(this, arguments);
    };
}();

function generateLayout(variations, context, page) {
    var layout = [];
    var arm = [];
    variations = variations.flat();

    for (var i = 0, sum = 0; i < variations.length; i++) {
        var selectedVariation = Math.floor(Math.random() * variations[i]);
        layout.push(selectedVariation);
        arm.push(sum + selectedVariation);
        sum += variations[i];
    }

    return [{ "context": context, "page": page, "arm": arm, "reward": 0, "ctr": 0 }, layout];
}

function armToLayout(variations, arm) {
    variations = variations.flat();
    var layout = [];
    for (var i = 0, sum = 0; i < variations.length; i++) {
        if (i == 0) {
            layout.push(arm[i]);
            sum += variations[i];
        } else {
            layout.push(Math.abs(sum - arm[i]));
            sum += variations[i];
        }
    }
    return layout;
}

var determineLayout = function determineLayout() {
    // Need to take in as input
    var nostra_layout = undefined; // or an actual layout ('0, 1, 0')
    var nostra_context = "google1"; // determined on cookie, query string, or organic
    var uri = "/"; // current URI
    var contentShowDefault = true; // determined in content call
    var change_layout = false; // determined by cookies
    var variations = [[2, 3, 3]]; // Nostra.ai // Determined in content call
    var machine_learning_info = {
        "arn": "...",
        "showRandom": true,
        "probabilityDefault": 20,
        "EventTrackingID": "..."
    };
    var awsPersonalize = { // Determined in AWS Personalize call
        "status": 200,
        "data": {}
    };

    var cookies = new Cookies();

    var randNum = Math.floor(Math.random() * 100) + 1;
    console.log("Input: " + machine_learning_info["probabilityDefault"] + " Rand: " + randNum);
    cookies.set('nostra-random-number', { "rand": randNum, "machine_learning_prob": machine_learning_info["probabilityDefault"] }, { path: '/' });

    if (contentShowDefault || randNum <= machine_learning_info["probabilityDefault"] || awsPersonalize["status"] != 200) {
        // TODO: NEED TO BE ABLE TO TELL THAT THIS IS DEFAULT DATA (DO NOT TRAIN ON)
        console.log("DEFAULT LAYOUT");
        nostra_layout = new Array(variations.flat().length).fill(0);
        console.log(nostra_layout);
        console.log({ "context": nostra_context, "page": uri, "arm": "baseline", "ctr": 0, "reward": 0 });
        cookies.set('nostra-bandit', JSON.stringify({ "context": nostra_context, "page": uri, "arm": "baseline", "ctr": 0, "reward": 0 }), { path: '/' });
        cookies.set("nostra-layout-" + uri, nostra_layout, { path: '/' });
    } else if (nostra_layout == undefined || change_layout) {
        var bandit;

        if (machine_learning_info["showRandom"]) {
            if ("random-arms" in machine_learning_info) {
                console.log("> 2000 layout possibilities");
                // if they have more than 2000 variations, we need to pick one from a given list
                var rand_arms_db = machine_learning_info["random-arms"];
                var pos = Math.floor(Math.random() * rand_arms_db.length);

                var temp_arm = JSON.parse(rand_arms_db[pos]);
                nostra_layout = armToLayout(variations, temp_arm);
                bandit = { "context": nostra_context, "page": uri, "arm": temp_arm, "ctr": 0, "reward": 0 };
            } else {
                console.log("< 2000 layout possibilities");
                // Random layout if company has less than 2000 layouts for a given page
                var randLayout = generateLayout(variations, nostra_context, uri);
                nostra_layout = randLayout[1];
                bandit = randLayout[0];
            }
        } else if (awsPersonalize["status"] == 200) {
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

        localStorage.setItem(uri, JSON.stringify(nostra_layout));
        cookies.set('nostra-bandit', bandit, { path: '/' });
        cookies.set("nostra-layout-" + uri, nostra_layout, { path: '/' });
    } else {
        nostra_layout = JSON.parse("[" + nostra_layout + "]");
    }
};

function sendToHistory(uid, site, history) {
    var urlToSend = 'https://prod-api.nostra.ai/history/';

    headers = {
        'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj'
    };

    var formBody = new URLSearchParams({
        'uid': uid,
        'history': history,
        'site': site
    });

    // window.localStorage.setItem("lastSentTime", parseInt(Date.now() / 1000).toString());

    return fetch(urlToSend, {
        method: 'PUT',
        body: formBody,
        headers: headers
    });
}

export var NostraInit = function NostraInit() {
    // TODO: Remember to uncomment
    // window.indexedDB.deleteDatabase("nostra");
    determineLayout();
    var cookies = new Cookies();
    cookies.set('nostra-uuid', uuidv4(), { path: '/' });
    cookies.set('nostra-uri', location.pathname, { path: '/' });

    useEffect(function () {
        // PUT request using fetch with async/await
        var updatePost = function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var urlToSend, headers, formBody;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                urlToSend = 'https://prod-api.nostra.ai/history/';
                                headers = {
                                    'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj'
                                };
                                formBody = new URLSearchParams({
                                    'uid': cookies.get('nostra-uuid'),
                                    'history': history,
                                    'site': window.location.href
                                });

                                // window.localStorage.setItem("lastSentTime", parseInt(Date.now() / 1000).toString());

                                fetch(urlToSend, {
                                    method: 'PUT',
                                    body: formBody,
                                    headers: headers
                                });

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            return function updatePost() {
                return _ref3.apply(this, arguments);
            };
        }();

        updatePost();
    }, []);

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            Async,
            { promiseFn: getProfile },
            function (_ref4) {
                var data = _ref4.data,
                    error = _ref4.error,
                    isPending = _ref4.isPending;

                if (isPending) {
                    return null;
                }
                if (error) {
                    return null;
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
                return null;
            }
        ),
        React.createElement(
            Async,
            { promiseFn: getData },
            function (_ref5) {
                var data = _ref5.data,
                    error = _ref5.error,
                    isPending = _ref5.isPending;

                if (isPending) {
                    return null;
                }
                if (error) {
                    return null;
                }
                if (data) {
                    var db = new Dexie("nostra");
                    db.version(1).stores({
                        localData: "id,data"
                    });

                    db.localData.add({ id: "content", data: JSON.stringify(data) });
                }
                return null;
            }
        )
    );
};