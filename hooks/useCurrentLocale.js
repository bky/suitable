import React from 'react'
import useRouter from 'hooks/useRouter'

export default function useCurrentLocale() {
  const router = useRouter()
  return router.locale
}
