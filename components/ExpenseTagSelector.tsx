import React, { useState, useCallback } from "react";

import {
  Typography,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // @ts-ignore
} from "@mui/material"; // @ts-ignore

// @ts-ignore
import AddIcon from "@mui/icons-material/Add";

import useTranslation from "../hooks/useTranslation";

export function ExpenseTagSelector({ tags, onChange, options }) {
  const [t] = useTranslation();

  const handleClickType = useCallback(() => {
    console.warn("handleClickTags not yet implemented");
  }, []);

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
        <Grid item xs={10}>
          <Typography variant="body1">
            {t["addExpenseTags"]}
          </Typography>
        </Grid>
        <Grid item xs={2}>
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
