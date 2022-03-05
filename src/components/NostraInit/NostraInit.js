import Async from 'react-async';
import db from '../db';

const getData = async () => {
    const res = await fetch('https://prod-api.nostra.ai/content/?site=https://ec2.nostraprod.com&content=content&page=/&referrer=default', {
        headers: {'x-api-key': '8OIjtrzO4o6rr4vglTZAx1hAbOJGzzQX5OMuwtMj'}
    });
    if(!res.ok) throw new Error(res.statusText);
    return res.json();
}

export const NostraInit = () => {
    return <Async promiseFn={getData}>
        {({ data, error, isPending }) => {
        if (isPending) return null
        if (error) return null
        if (data)
            console.log(data)
            return null
        }}
    </Async>

}