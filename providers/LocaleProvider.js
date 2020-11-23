import React from 'react'
import {IntlProvider} from 'react-intl'
import CurrentLocaleContext from 'contexts/CurrentLocaleContext'

const messages = {
  da: {
    '@t.portfolio@@': 'Portefølje',
    '@t.tenancies_page_title@@': 'Suitable - Lejemål',
    '@t.tenancies_header@@': 'Lejemål',
    '@t.add_tenancy_button@@': 'Tilføj lejemål',
    '@t.no_tenancies_found@@': 'Ingen lejemål',
    '@t.new_tenancy_page_title@@': 'Suitable - Tilføj lejemål',
    '@t.new_tenancy_header@@': 'Tilføj lejemål',
    '@t.new_tenancy_search_placeholder@@': 'Søg efter adresse',
    '@t.address@@': 'Adresse',
    '@t.address_entry@@': 'Adresse: {address}',
    '@t.city@@': 'By',
    '@t.save@@': 'Gem',
    '@t.delete@@': 'Slet',
    '@t.cancel@@': 'Annullér',
    '@t.tenancy_page_title@@': 'Suitable - Lejemål',
    '@t.tenancy_header@@': 'Lejemål',
    '@t.delete_tenancy_confirmation@@': 'Er du sikker på, at du vil slette lejemålet "{address}" fra din portefølje?',
  },
}

const LocaleProvider = (props) => {
  const [currentLocale, setCurrentLocale] = React.useState('da')

  return (
    <IntlProvider key={currentLocale} locale={currentLocale} messages={messages[currentLocale]}>
      <CurrentLocaleContext.Provider value={{currentLocale, setCurrentLocale}}>
        {props.children}
      </CurrentLocaleContext.Provider>
    </IntlProvider>
  )
}

export default LocaleProvider
