import React from 'react';

import {
  Typography,
  Grid,
  IconButton,
  // @ts-ignore
} from '@mui/material';

// @ts-ignore
import CloseIcon from '@mui/icons-material/Close';

export function PopupHeader({ title = 'test', onClose }) {
  return (
    <>
      <Grid container>
        <Grid item xs={10}>
          <Typography variant="body1">{title}</Typography>
        </Grid>
        <Grid item xs={2}>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}
