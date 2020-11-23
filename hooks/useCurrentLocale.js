import React from 'react'
import CurrentLocaleContext from 'contexts/CurrentLocaleContext'

export default function useCurrentLocale() {
  const context = React.useContext(CurrentLocaleContext)
  return [context.currentLocale, context.setCurrentLocale]
}
