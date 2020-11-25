import React from 'react'
import {IntlProvider} from 'react-intl'
import * as hooks from 'hooks'

const messages = {
  da: require('locales/da.json'),
  en: require('locales/en.json'),
}

const LocaleProvider = (props) => {
  const router = hooks.useRouter()

  return (
    <IntlProvider key={router.locale} locale={router.locale} messages={messages[router.locale]}>
      {props.children}
    </IntlProvider>
  )
}

export default LocaleProvider
