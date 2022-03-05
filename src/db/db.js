import Dexie from 'dexie';

export const db = new Dexie('nostra');

db.version(1).stores({
    testData: 'datakey'
});