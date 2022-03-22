import Async from 'react-async';
import Dexie from 'dexie';

const getData = async () => {
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

export const NostraInit = () => {
    return <>    
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
                }
                return null
            }}
        </Async>
    </>

}