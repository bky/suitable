import React from 'react'
import {IntlProvider} from 'react-intl'
import * as hooks from 'hooks'

const messages = {
  da: {
    '@t.portfolio@@': 'Portefølje',
    '@t.tenancies_page_title@@': 'Suitable - Lejemål',
    '@t.tenancies_header@@': 'Lejemål',
    '@t.add_tenancy_button@@': 'Tilføj lejemål',
    '@t.no_tenancies_found@@': 'Ingen lejemål',
    '@t.filter_addresses@@': 'Søg adresser',
    '@t.new_tenancy_page_title@@': 'Suitable - Tilføj lejemål',
    '@t.new_tenancy_header@@': 'Tilføj lejemål',
    '@t.new_tenancy_search_placeholder@@': 'Søg adresser',
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
  en: {
    '@t.portfolio@@': 'Portfolio',
    '@t.tenancies_page_title@@': 'Suitable - Tenancy',
    '@t.tenancies_header@@': 'Tenancy',
    '@t.add_tenancy_button@@': 'Add tenancy',
    '@t.no_tenancies_found@@': 'No tenancies',
    '@t.filter_addresses@@': 'Search addresses',
    '@t.new_tenancy_page_title@@': 'Suitable - Add tenancy',
    '@t.new_tenancy_header@@': 'Add tenancy',
    '@t.new_tenancy_search_placeholder@@': 'Search addresses',
    '@t.address@@': 'Address',
    '@t.address_entry@@': 'Address: {address}',
    '@t.city@@': 'City',
    '@t.save@@': 'Save',
    '@t.delete@@': 'Delete',
    '@t.cancel@@': 'Cancel',
    '@t.tenancy_page_title@@': 'Suitable - Tenancy',
    '@t.tenancy_header@@': 'Tenancy',
    '@t.delete_tenancy_confirmation@@': 'Are you sure you want to delete the tenancy "{address}" from your portfolio?',
  },
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
