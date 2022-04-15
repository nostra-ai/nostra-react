import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';

export var NostraInit = function NostraInit() {

    // Logic may need to be added on whether to add tracking script or not
    useEffect(function () {
        var cookies = new Cookies();
        var tStatus = cookies.get("nostra-data");
        var track = cookies.get("n-track");

        if (!document.getElementById("n-track") && tStatus !== undefined && track !== undefined) {
            var script = document.createElement("script");
            script.src = "https://nostra-tracking.s3.amazonaws.com/script-v1-3.js";
            script.id = "n-track";
            document.body.appendChild(script);
        }
    }, []);

    return React.createElement(React.Fragment, null);
};