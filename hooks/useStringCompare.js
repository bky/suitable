import React from 'react'
import useCurrentLocale from './useCurrentLocale'

export default function useStringCompare() {
  const [currentLocale, setCurrentLocale] = useCurrentLocale()

  const comparer = React.useMemo(() => {
    if (typeof Intl === 'object' && typeof Intl.Collator === 'function') {
      return new Intl.Collator(currentLocale, {sensitivity: 'accent'}).compare
    } else {
      return (a, b) => a.toUpperCase().localeCompare(b.toUpperCase(), currentLocale, {sensitivity: 'accent'})
    }
  }, [currentLocale])

  return comparer
}
