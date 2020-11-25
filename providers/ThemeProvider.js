import React from 'react'
import {createMuiTheme, ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#222222',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
})

const ThemeProvider = (props) => {
  // https://itnext.io/next-js-with-material-ui-7a7f6485f671
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </>
  )
}

export default ThemeProvider
