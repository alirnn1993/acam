import React, {useEffect, useRef} from "react";
import configs from "../../utils/config.json";
import {UserApi} from "../../utils/UserApi";


const AuthenticatedImg = ({url, style, onClick}) => {
    const ref = useRef();
    useEffect(() => {
        if (ref.current)
            fetch(url,
                {headers: UserApi.getAuthorizedHeader()})
                .then(r => {
                    return r.blob();
                })
                .then(d => {
                    if (ref.current)
                        ref.current.src = window.URL.createObjectURL(d);

                })
    }, [url]);

    return <img src={''}
                ref={ref}
                alt={""}
                style={style}
                onClick={(event) => {
                    onClick(event.target.src);
                }}/>
}

export default AuthenticatedImg;