import React from 'react'
import CurrentLocaleContext from 'contexts/CurrentLocaleContext'

const LocaleProvider = (props) => {
  const [currentLocale, setCurrentLocale] = React.useState('da')
  return (
    <CurrentLocaleContext.Provider value={{currentLocale, setCurrentLocale}}>
      {props.children}
    </CurrentLocaleContext.Provider>
  )
}

export default LocaleProvider
