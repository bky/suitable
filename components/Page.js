import React from 'react'
import Head from 'next/head'
import * as hooks from 'hooks'
import * as utils from 'utils'
import Typography from '@material-ui/core/Typography'
import {FormattedMessage} from 'react-intl'
import Box from '@material-ui/core/Box'

const Page = (props) => {
  const intl = hooks.useIntl()

  return (
    <>
      <Head>
        <title>{intl.formatMessage(props.title)}</title>
      </Head>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h3">
          <FormattedMessage {...props.headerText} />
        </Typography>
        {props.headerRight}
      </Box>

      {props.children}
    </>
  )
}

export default Page
