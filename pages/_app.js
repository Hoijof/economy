import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
// @ts-ignore
import Link from 'next/link';
// @ts-ignore
import HomeIcon from '@mui/icons-material/Home';
// @ts-ignore
import AddIcon from '@mui/icons-material/Add';

import {
  Typography,
  Grid,
  // @ts-ignore
} from '@mui/material';

import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import { PopupProvider } from '../components/Popup/PopupProvider';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{Component.name}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <PopupProvider>
          <CssBaseline />
          <main
            style={{
              padding: '1rem',
            }}
          >
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid container item sx={{ alignItems: 'center' }}>
                <Grid item xs={2}>
                  <Link href="/">
                    <HomeIcon sx={{ fontSize: 35, cursor: 'pointer' }} />
                  </Link>
                </Grid>
                <Grid item xs sx={{ alignItems: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    {Component.name}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Link href="/expenses">
                    <AddIcon sx={{ fontSize: 35, cursor: 'pointer' }} />
                  </Link>
                </Grid>
              </Grid>
              <Component {...pageProps} />
            </Grid>
          </main>
        </PopupProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
