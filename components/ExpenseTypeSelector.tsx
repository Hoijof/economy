import React, { useState, useCallback, useContext } from "react";

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
import { PopupAdd } from "./Popup/PopupAdd";
import { ProviderContext } from "./Popup/PopupProvider";

export function ExpenseTypeSelector({ type, onChange, options, reloadTypes }) {
  const [t] = useTranslation();
  const { open, close } = useContext(ProviderContext);

  const handleClickType = useCallback(() => {
    open(<PopupAdd collectionName="expenseTypes" title={t["addExpenseTypesNew"]} buttonText={t["WordAdd"]} documentField="name" onClose={() => {close(); reloadTypes();}}/>);
  }, [close, open, reloadTypes, t]);

  const handleChangeType = useCallback(
    (event) => {
      onChange(event.target.value as number);
    },
    [onChange]
  );

  return (
    <>
      <Grid item container>
        <Grid container item xs={10} sx={{
          alignItems: "center"
        }}>
          <Typography variant="body1">
            {t["addExpenseType"]}
          </Typography>
        </Grid>
        <Grid item xs={2} sx={{display: 'flex', justifyContent: 'end'}}>
          <IconButton aria-label="add" onClick={handleClickType}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item>
        <FormControl fullWidth>
          <InputLabel id="add-expense-label">
            {t["addExpenseType"]}
          </InputLabel>
          <Select
            labelId="add-expense-label"
            id="add-expense"
            value={type}
            label={t["addExpenseType"]}
            onChange={handleChangeType}
          >
            {options.map(({id, name, translation}) => (
              <MenuItem key={id} value={id}>
                {translation ? t[translation] : name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
}
