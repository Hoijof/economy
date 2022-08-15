import { debug } from "./consts";

let dbs = null;

const cache = {};

export default function db(namespace) {
  if (!dbs) {
    dbs = JSON.parse(localStorage.getItem("customDBs")) || {};
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

  const res: Db = {
    /**
            `db.get('users')` => [{id:1, name},]`
            `db.get('users', 1);` `users.get(1);` // Get by id
            `db.get('users', 'name', 'pepito')`
        **/
    getForced: (collection, id: any, specific) => {
      sn.__totalReads++;

      const mode = getMode(collection, id, specific);

      if (!sn[collection]) {
        createCollection(sn, collection);
      }

      const c = sn[collection]; // Collection
      switch (mode) {
      case GetModes.DOCUMENT:
        return c.data;
      case GetModes.ID:
        return c.data.find((doc) => doc.id === id);
      case GetModes.SPECIFIC:
        return c.data.find((doc) => doc[id] === specific);
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

      saveDBs();

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

      saveDBs();

      return c.data[index];
    },

    remove: (collection, id) => {
      sn.__totalOperations++;
      sn.__totalWrites++;

      const c = sn[collection];
      const index = c.data.findIndex((doc) => doc.id === id);
      c.data.splice(index, 1);

      c.updatedAt = new Date();

      saveDBs();

      delete cache[generateCacheKey(collection, id)];
    },
    get: () => {},
  };

  res.get = (collection, id, specific) => {
    sn.__totalOperations++;

    const term = generateCacheKey(collection, id, specific);
    let result = cache[term];

    if (!result) {
      const document = res.getForced(collection, id, specific);

      if (document) {
        if (id) {
          cache[term] = document;
          debug && console.info("get", term, "set cache");
        } else {
          debug && console.info("get", term, "avoid caching");
        }
        
        result = document;
      }
    }

    debug && console.info("get", term, cache[term] && cache[term].__id);

    return result;
  };

  return res;
}

function getMode(collection, id, specific = ""): GetModes {
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

function generateCacheKey(collection, id, specific = "") {
  return `${collection}_${id}_${specific}`;
}

function saveDBs() {
  console.info("saving");

  localStorage.setItem("customDBs", JSON.stringify(dbs));
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
  get: (collection: string, id?: number, specific?: string) => any;
  add: (collection: string, doc: any) => void;
  update: (collection: string, id: number, doc: any) => any;
  remove: (collection: string, id: number) => void;
  getForced: (collection: string, id?: number, specific?: string) => any;
}
