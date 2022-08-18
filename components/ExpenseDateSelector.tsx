import React from 'react';

import {
  Typography,
  Grid,
  TextField,
  // @ts-ignore
} from '@mui/material'; // @ts-ignore

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// @ts-ignore
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// @ts-ignore
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import useTranslation from '../hooks/useTranslation';

export function ExpenseDateSelector({ value, onChange }) {
  const [t] = useTranslation();

  return (
    <>
      <Grid item container>
        <Grid item xs={10}>
          <Typography variant="body1">{t['addExpenseDate']}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Date mobile"
            inputFormat={t['dateFormat']}
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
    </>
  );
}
