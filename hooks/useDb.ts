import React, { useEffect, useMemo, useState } from "react";

import createDb from "../utils/db";

export default function useDb(namespace) {
  const [db, setDb] = useState(null);

  useEffect(() => {
    if (!db) {
      setDb(createDb(namespace));

      return;
    }
  }, [db, namespace]);

  return db;
}
