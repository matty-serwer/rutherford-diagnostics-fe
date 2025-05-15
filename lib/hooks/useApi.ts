'use client'

import { useApp } from '../context/AppContext'
import { API_BASE_URL, ApiResponse, Patient, Test } from '../types'

export function useApi() {
  const { dispatch } = useApp()

  const fetchPatients = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`${API_BASE_URL}/patients`)
      const data: ApiResponse<Patient[]> = await response.json()

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
      } else {
        dispatch({ type: 'SET_PATIENTS', payload: data })
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          status: 500,
          error: 'Internal Server Error',
          message: 'Failed to fetch patients',
          path: '/patients',
          timestamp: new Date().toISOString(),
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchTests = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`${API_BASE_URL}/tests`)
      const data: ApiResponse<Test[]> = await response.json()

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
      } else {
        dispatch({ type: 'SET_TESTS', payload: data })
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          status: 500,
          error: 'Internal Server Error',
          message: 'Failed to fetch tests',
          path: '/tests',
          timestamp: new Date().toISOString(),
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getPatient = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`${API_BASE_URL}/patients/${id}`)
      const data: ApiResponse<Patient> = await response.json()

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
        return null
      }
      return data
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          status: 500,
          error: 'Internal Server Error',
          message: `Failed to fetch patient ${id}`,
          path: `/patients/${id}`,
          timestamp: new Date().toISOString(),
        },
      })
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getTest = async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`${API_BASE_URL}/tests/${id}`)
      const data: ApiResponse<Test> = await response.json()

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
        return null
      }
      return data
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          status: 500,
          error: 'Internal Server Error',
          message: `Failed to fetch test ${id}`,
          path: `/tests/${id}`,
          timestamp: new Date().toISOString(),
        },
      })
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return {
    fetchPatients,
    fetchTests,
    getPatient,
    getTest,
  }
} 