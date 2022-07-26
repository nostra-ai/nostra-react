import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';

export const NostraInit = () => {

    // Logic may need to be added on whether to add tracking script or not
    useEffect(() => {
        const cookies = new Cookies();
        var tStatus = cookies.get("nostra-data");
        var track = cookies.get("n-track");

        if (!document.getElementById("n-track") && tStatus !== undefined && track !== undefined) {
            var script = document.createElement("script");
            script.src = "https://nostra-tracking.s3.amazonaws.com/react-script.js";
            script.id = "n-track"
            document.body.appendChild(script);
        }
    }, [])

    return (
        <React.Fragment>
        </React.Fragment>
    )
}