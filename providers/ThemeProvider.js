import React from 'react'
import {createMuiTheme, ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#53BF7D',
      main: '#46A86C',
      main: '#429863',
      main: '#388657',
      main: '#222222',
      // main: '#2D523B',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
})

const ThemeProvider = (props) => {
  const [currentLocale, setCurrentLocale] = React.useState('da')

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
