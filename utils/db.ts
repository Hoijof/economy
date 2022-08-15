import { debug } from './consts';

let dbs = null;

const cache = {};

export default function db(namespace) {
    if (!dbs) {
        dbs = JSON.parse(localStorage.getItem('customDBs')) || {};
    }

    if (!dbs[namespace]) {
        dbs[namespace] = {
            __lastId: 0,
            __totalReads: 0,
            __totalWrites: 0,
            __totalOperations: 0,
        };

        saveDBs();
    }

    const sn = dbs[namespace]; // Selected namespace

    const res:Db = {
        /**
            `db.get('users')` => [{id:1, name},]`
            `db.get('users', 1);` `users.get(1);` // Get by id
            `db.get('users', 'name', 'pepito')`
        **/
        get: (collection, id: any, specific) => {
            sn.__totalReads++;

            const mode = getMode(collection, id, specific);

            if (!sn[collection]) {
                sn[collection] = [];
                sn[collection].__lastId = 0;
            }
            
            switch(mode) {
                case GetModes.DOCUMENT:
                    return sn[collection];
                case GetModes.ID:
                    return sn[collection].find(doc => doc.id === id);
                case GetModes.SPECIFIC:
                    return sn[collection].find(doc => doc[id] === specific);
            }
        },
        add: (collection, doc) => {
            sn.__totalOperations++;
            sn.__totalWrites++;

            if (!sn[collection]) {
                sn[collection] = [];
                sn[collection].__lastId = 0;
            }

            doc.__id = ++sn.__lastId;
            doc.id = ++sn[collection].__lastId;
            doc.createdAt = new Date();
            doc.updatedAt = doc.createdAt;

            sn[collection].push(doc);

            debug && console.info(`Added ${collection} ${doc.id}, __id: ${doc.__id}`);

            saveDBs();

            return doc;
        },
        update: (collection, id: any, doc) => {
            sn.__totalOperations++;
            sn.__totalWrites++;

            const index = sn[collection].findIndex(doc => doc.id === id);
            
            sn[collection][index] = {
                ...sn[collection][index],
                ...doc,
                updatedAt: new Date(),
            };

            cache[generateCacheKey(collection, id)] = sn[collection][index];

            saveDBs();

            return sn[collection][index];
        },

        remove: (collection, id) => {
            sn.__totalOperations++;
            sn.__totalWrites++;

            const index = sn[collection].findIndex(doc => doc.id === id);
            sn[collection].splice(index, 1);
            
            saveDBs();
            
            delete cache[generateCacheKey(collection, id)];
        },
        getC: () => {},
    };

    res.getC = (collection, id, specific) => {
        sn.__totalOperations++;

        const term = generateCacheKey(collection, id, specific);

        if (!cache[term]) {
            const document = res.get(collection, id, specific);

            if (document) {
                debug && console.info('getC', term, 'set');

                cache[term] = document;
            }
        }
        
        debug && console.info('getC', term, cache[term] && cache[term].__id);

        return cache[term];

    };

    return res;
}


function getMode(collection, id, specific=''): GetModes {
    if (specific) {
        return GetModes.SPECIFIC;
    }

    if (id) {
        return GetModes.ID;
    }

    return GetModes.DOCUMENT;
}

enum GetModes {
    DOCUMENT,
    ID,
    SPECIFIC
};

function generateCacheKey(collection, id, specific='') {
    return `${collection}_${id}_${specific}`;
}

function saveDBs() {
    console.log('saving');

    localStorage.setItem('customDBs', JSON.stringify(dbs));
}

export interface Db {
    get: (collection:string, id?:number, specific?:string) => any;
    add: (collection:string, doc:any) => void;
    update: (collection:string, id:number, doc:any) => any;
    remove: (collection:string, id:number) => void;
    getC: (collection:string, id?:number, specific?:string) => any;
};