import React from 'react'
import _ from 'lodash'
import useStringCompare from './useStringCompare'

export default function useOrderByString() {
  const stringCompare = useStringCompare()
  return (collection, iteratee) => {
    return [...collection].sort((elementA, elementB) => {
      let valueA, valueB
      if (iteratee === undefined) {
        valueA = elementA
        valueB = elementB
      } else if (typeof iteratee === 'function') {
        valueA = iteratee(elementA)
        valueB = iteratee(elementB)
      } else {
        valueA = elementA[iteratee]
        valueB = elementB[iteratee]
      }
      if ((valueA === undefined || valueA === null) && (valueB === undefined || valueB === null)) {
        return 0
      } else if (valueA === undefined || valueA === null) {
        return -1
      } else if (valueB === undefined || valueB === null) {
        return 1
      } else {
        return stringCompare(valueA, valueB)
      }
    })
  }
}
