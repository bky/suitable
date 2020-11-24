import React from 'react'

const useDebounced = (func, delay = 300, dependencies = []) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      func()
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, dependencies)
}

export default useDebounced
