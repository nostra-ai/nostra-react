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



export const NostraInit = () => {
    // TODO: Remember to uncomment
    // window.indexedDB.deleteDatabase("nostra");
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