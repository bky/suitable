import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import ApolloProvider from 'providers/ApolloProvider'
import LocaleProvider from 'providers/LocaleProvider'
import ThemeProvider from 'providers/ThemeProvider'
import {FormattedMessage} from 'react-intl'
import * as hooks from 'hooks'

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
              <Box display="flex" justifyContent="space-between" pt={2} pb={4}>
                <NextLink href="/" passHref>
                  <Link color="primary" variant="h6" underline="none">
                    <FormattedMessage id="@t.portfolio@@" />
                  </Link>
                </NextLink>
                <Locales />
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

const Locales = (props) => {
  const router = hooks.useRouter()

  return (
    <Box display="flex">
      <NextLink href="/" passHref locale="da">
        <Link
          color="primary"
          variant="button"
          underline="none"
          style={router.locale === 'da' ? {fontWeight: 700} : null}
        >
          da
        </Link>
      </NextLink>
      <Box mx={1}>
        <Typography>|</Typography>
      </Box>
      <Box>
        <NextLink href="/" passHref locale="en">
          <Link
            color="primary"
            variant="button"
            underline="none"
            style={router.locale === 'en' ? {fontWeight: 700} : null}
          >
            en
          </Link>
        </NextLink>
      </Box>
    </Box>
  )
}

MyApp.getInitialProps = async (ctx) => {
  return {}
}

export default MyApp
