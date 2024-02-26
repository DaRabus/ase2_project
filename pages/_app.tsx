import { Container, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../styles/globals.css'
import { theme } from '../theme/theme'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl">
      <Component {...pageProps} />
      </Container>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default MyApp
