import Dexie from 'dexie';

export const db = new Dexie('nostra');

db.version(1).stores({
    testData: 'datakey'
}); https://d1fx6rwuay50ej.cloudfront.net