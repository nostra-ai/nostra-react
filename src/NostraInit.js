import React, { useEffect } from 'react';

export const NostraInit = () => {

    // Logic may need to be added on whether to add tracking script or not
    useEffect(() => {
        if(!document.getElementById("n-track")){
            var script = document.createElement("script");
            script.src = "https://nostra-tracking.s3.amazonaws.com/script-v1-3.js";
            script.id = "n-track"
            document.body.appendChild(script); 
        }   
    })

    return (
        <React.Fragment>
        </React.Fragment>
    )
}