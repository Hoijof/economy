import { debug } from './consts';

let dbsCache = null;

const cache = {};

export default function db(namespace) {
  if (!dbsCache) {
    // dbsCache = JSON.parse(localStorage.getItem('customDBs')) || {};
    dbsCache = {};
  }

  if (!dbsCache[namespace]) {
    dbsCache[namespace] = JSON.parse(localStorage.getItem(namespace)) || null;

    if (!dbsCache[namespace]) {
      dbsCache[namespace] = {
        __lastId: 0,
        __totalReads: 0,
        __totalWrites: 0,
        __totalOperations: 0,
      };

      saveDb(namespace);
    }
  }

  const sn = dbsCache[namespace]; // Selected namespace

  const res: Db = {
    /**
            `db.get('users')` => [{id:1, name},]`
            `db.get('users', 1);` `users.get(1);` // Get by id
            `db.get('users', 'name', 'pepito')`
        **/
    getForced: (collection: string, id: number | string, specific: string) => {
      sn.__totalReads++;

      const mode = getMode(collection, id, specific);

      if (!sn[collection]) {
        createCollection(sn, collection);
      }

      const c = sn[collection]; // Collection
      switch (mode) {
        case GetModes.DOCUMENT: {
          return c.data;
        }
        case GetModes.ID: {
          return c.data.find((doc) => doc.id === id);
        }
        case GetModes.SPECIFIC: {
          return c.data.find((doc) => doc[id] === specific);
        }
      }
    },
    add: (collection, doc) => {
      sn.__totalOperations++;
      sn.__totalWrites++;

      if (!sn[collection]) {
        createCollection(sn, collection);
      }
      const c = sn[collection]; // Collection

      doc.__id = ++sn.__lastId;
      doc.id = ++c.__lastId;
      doc.createdAt = new Date();
      doc.updatedAt = doc.createdAt;

      c.data.push(doc);

      debug && console.info(`Added ${collection} ${doc.id}, __id: ${doc.__id}`);

      saveDb(namespace);

      return doc;
    },
    update: (collection, id: any, doc) => {
      sn.__totalOperations++;
      sn.__totalWrites++;

      const c = sn[collection];
      const index = c.data.findIndex((doc) => doc.id === id);

      c.data[index] = {
        ...c.data[index],
        ...doc,
        updatedAt: new Date(),
      };

      c.updatedAt = new Date();

      cache[generateCacheKey(collection, id)] = c.data[index];

      saveDb(namespace);

      return c.data[index];
    },

    delete: (collection, id) => {
      sn.__totalOperations++;
      sn.__totalWrites++;

      const c = sn[collection];
      const index = c.data.findIndex((doc) => doc.id === id);
      c.data.splice(index, 1);

      c.updatedAt = new Date();

      saveDb(namespace);

      delete cache[generateCacheKey(collection, id)];
    },
    get: () => {},
  };

  res.get = (collection: string, id: number | string, specific: any) => {
    sn.__totalOperations++;

    const term = generateCacheKey(collection, id, specific);
    let result = cache[term];

    if (!result) {
      const document = res.getForced(collection, id, specific);

      if (document) {
        if (id) {
          cache[term] = document;
          debug && console.info('get', term, 'set cache');
        } else {
          debug && console.info('get', term, 'avoid caching');
        }

        result = document;
      }
    }

    debug && console.info('get', term, cache[term] && cache[term].__id);

    return result;
  };

  return res;
}

function getMode(collection, id, specific = ''): GetModes {
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
  SPECIFIC,
}

function generateCacheKey(collection, id, specific = '') {
  return `${collection}_${id}_${specific}`;
}

function saveDb(namespace) {
  console.info('savingDb', namespace);

  localStorage.setItem(namespace, JSON.stringify(dbsCache[namespace]));
}

function createCollection(sn, collection) {
  const c = {
    __lastId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: [],
  };

  sn[collection] = c;
}

export interface Db {
  get: (collection: string, id?: number | string, specific?: string) => any;
  add: (collection: string, doc: any) => void;
  update: (collection: string, id: number, doc: any) => any;
  delete: (collection: string, id: number) => void;
  getForced: (
    collection: string,
    id?: number | string,
    specific?: string,
  ) => any;
}
