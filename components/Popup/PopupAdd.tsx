import React, { useCallback, useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  // @ts-ignore
} from "@mui/material";


import useTranslation from "../../hooks/useTranslation";
import { PopupHeader } from './PopupHeader';
import useDb from "../../hooks/useDb";


export function PopupAdd({onClose, collectionName, title, buttonText, documentField}) {
  const [t] = useTranslation();
  const db = useDb("economy");
  const [tagName, setTagName] = useState("");

  const addTag = useCallback(() => {
    if (!db) {
      return;
    }

    const tag = db.get(collectionName, documentField, tagName);
    
    if (!tag) {
      db.add(collectionName, {name: tagName});
    }

    onClose();
  }, [collectionName, db, documentField, onClose, tagName]);

  return (
    <>
      <PopupHeader title={title} onClose={onClose} />
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="body1">
            <input type="text" value={tagName} onChange={(e) => {
              setTagName(e.target.value);
            }} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" onClick={addTag}>
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
