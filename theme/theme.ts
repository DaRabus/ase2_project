import { createTheme } from '@mui/material/styles'

// THIS OBJECT SHOULD BE SIMILAR TO ../tailwind.config.js
const themeConstants = {
  paper: '#F9F9F9',
  primary: {
    main: '#000000',
    dark: '#312626',
  },
  secondary: {
    main: '#212121',
    dark: '#3A3A3A',
  },
  error: {
    main: '#b22222',
    dark: '#8b0000',
  },
  fg: { main: '#000000', dark: 'rgba(55, 65, 81, 1)' },
  breakpoints: {
    xs: 0,
    mb: 350,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
}

// Check here for more configurations https://material-ui.com/customization/default-theme/
const theme = createTheme({
  palette: {
    primary: themeConstants.primary,
    secondary: themeConstants.secondary,
    background: { paper: themeConstants.paper },
    text: {
      primary: themeConstants.fg.main,
      secondary: themeConstants.fg.dark,
    },
    error: themeConstants.error,
  },
  breakpoints: {
    values: themeConstants.breakpoints,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 700,
      textTransform: 'none',
    },

  }
})

export { theme }
