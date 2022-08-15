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
    console.warn("handleClickTags not yet impelemented");
  }, []);

  const handleChangeTag = useCallback(
    (event) => {
      const value = event.target.innerText as string;

      if (tags.includes(value)) {
        onChange(tags.filter((tag) => tag !== value));

        return;
      }

      onChange([...tags, value]);
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
      <Grid item>
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={tags.includes(option)}
            onClick={handleChangeTag}
          >
            {option}
          </MenuItem>
        ))}
      </Grid>
    </>
  );
}
