import {useQuery} from '@apollo/client'
import * as utils from 'utils'

export default function _useQuery(query, options) {
  return useQuery(query, {partialRefetch: true, onError: utils.handleError, ...options})
}
