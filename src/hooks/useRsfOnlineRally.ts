'use client'

import { RsfOnlineRally } from '@/types/supabase'
import { useState, useCallback } from 'react'

interface UseRsfOnlineRallyOptions {
  limit?: number
  orderBy?: {
    column: string
    ascending: boolean
  }
}

export function useRsfOnlineRally() {
  const [rallies, setRallies] = useState<RsfOnlineRally[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchRallies = useCallback(async (options?: UseRsfOnlineRallyOptions) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (options?.limit) {
        queryParams.append('limit', options.limit.toString())
      }
      if (options?.orderBy) {
        queryParams.append('orderBy', JSON.stringify(options.orderBy))
      }
      const response = await fetch(`/api/rallies?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch rallies')
      }
      const data = await response.json()
      setRallies(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, []);

  return { rallies, loading, error, fetchRallies }
}