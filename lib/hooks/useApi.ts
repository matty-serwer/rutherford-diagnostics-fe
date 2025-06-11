'use client'

import { useApp } from '../context/AppContext'
import { API_BASE_URL, Patient, Test, ApiError } from '../types'
import { useCallback } from 'react'

export function useApi() {
  const { dispatch } = useApp()

  const fetchPatients = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        const error = await response.json() as ApiError
        dispatch({ type: 'SET_ERROR', payload: error })
        return
      }

      const data = await response.json()
      dispatch({ type: 'SET_PATIENTS', payload: data })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          status: 500,
          error: 'Internal Server Error: ' + error,
          message: 'Failed to fetch patients',
          path: '/patients',
          timestamp: new Date().toISOString(),
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch])

  const fetchTests = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      const response = await fetch(`${API_BASE_URL}/tests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        const error = await response.json() as ApiError
        dispatch({ type: 'SET_ERROR', payload: error })
        return
      }

      const data = await response.json()
      dispatch({ type: 'SET_TESTS', payload: data })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          status: 500,
          error: 'Internal Server Error: ' + error,
          message: 'Failed to fetch tests',
          path: '/tests',
          timestamp: new Date().toISOString(),
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch])

  const getPatient = useCallback(async (id: string): Promise<Patient | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        const error = await response.json() as ApiError
        throw new Error(error.message || 'Failed to fetch patient data')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to load patient:', error)
      throw error
    }
  }, [])

  const getTest = useCallback(async (id: number): Promise<Test | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        const error = await response.json() as ApiError
        throw new Error(error.message || 'Failed to fetch test data')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to load test:', error)
      throw error
    }
  }, [])

  return {
    fetchPatients,
    fetchTests,
    getPatient,
    getTest,
  }
}