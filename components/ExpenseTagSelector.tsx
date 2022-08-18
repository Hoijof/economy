import React, { useCallback, useContext } from "react";

import {
  Typography,
  Grid,
  IconButton,
  MenuItem,
  // @ts-ignore
} from "@mui/material"; // @ts-ignore

// @ts-ignore
import AddIcon from "@mui/icons-material/Add";

import useTranslation from "../hooks/useTranslation";
import { ProviderContext } from "./Popup/PopupProvider";
import { PopupAdd } from "./Popup/PopupAdd";

export function ExpenseTagSelector({ tags, onChange, options, reloadTags }) {
  const [t] = useTranslation();
  const { open, close } = useContext(ProviderContext);

  const handleClickType = useCallback(() => {
    open(<PopupAdd collectionName="expenseTags" title={t["addExpenseTagsNew"]} buttonText={t["WordAdd"]} documentField="name" onClose={() => {close(); reloadTags();}}/>);
  }, [close, open, reloadTags, t]);

  const handleChangeTag = useCallback(
    (event) => {
      const id = event.target.value as number;

      if (tags.includes(id)) {
        onChange(tags.filter((tag) => tag !== id));

        return;
      }

      onChange([...tags, id]);
    },
    [onChange, tags]
  );

  return (
    <>
      <Grid item container>
        <Grid item xs={10} sx={{
          display: 'flex', alignItems: 'center'
        }}>
          <Typography variant="body1">
            {t["addExpenseTags"]}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'end'}}>
          <IconButton aria-label="add" onClick={handleClickType}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        {options.map(({id, name, translation}) => (
          <Grid item xs={6} key={id}>
            <MenuItem
              value={id}
              selected={tags.includes(id)}
              onClick={handleChangeTag}
            >
              {translation ? t[translation] : name}
            </MenuItem>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
