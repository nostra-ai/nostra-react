import React, { useState, useEffect } from 'react';

export const NostraInit = () => {

    // Logic may need to be added on whether to add tracking script or not
    var script = document.createElement("script");
    script.src = "https://nostra-tracking.s3.amazonaws.com/script-v1-3.js";
    document.body.appendChild(script);
    return (
        <React.Fragment>
        </React.Fragment>
    )

}