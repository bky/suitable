import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import ApolloProvider from 'providers/ApolloProvider'
import LocaleProvider from 'providers/LocaleProvider'
import ThemeProvider from 'providers/ThemeProvider'

global.__DEV__ = process.env.NODE_ENV !== 'production'

global.LOG = (...args) => {
  console.log('/------------------------------\\')
  console.log(...args)
  console.log('\\------------------------------/')
  return args[args.length - 1]
}

function MyApp({Component, pageProps}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider>
        <LocaleProvider>
          <ApolloProvider>
            <Container maxWidth="xl">
              <Box pt={2} pb={4}>
                <NextLink href="/" passHref>
                  <Link color="primary" variant="h6" underline="none">
                    Portefølje
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
        </LocaleProvider>
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = async (ctx) => {
  return {}
}

export default MyApp
