import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import CssBaseline from '@material-ui/core/CssBaseline'
import ApolloProvider from '../providers/ApolloProvider'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'

global.__DEV__ = process.env.NODE_ENV !== 'production'

global.LOG = (...args) => {
  console.log('/------------------------------\\')
  console.log(...args)
  console.log('\\------------------------------/')
  return args[args.length - 1]
}

function MyApp({Component, pageProps}) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <ApolloProvider>
        <Container maxWidth="xl">
          <Box pt={2} pb={4}>
            <NextLink href="/" passHref>
              <Link color="primary" variant="h6" underline="none">
                Overblik
              </Link>
            </NextLink>
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Box pb={6}>
            <Component {...pageProps} />
          </Box>
        </Container>
      </ApolloProvider>
    </>
  )
}

MyApp.getInitialProps = async (ctx) => {
  return {}
}

export default MyApp
