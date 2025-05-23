'use client'

import { useApp } from '../context/AppContext'
import { API_BASE_URL, ApiResponse, Patient, Test } from '../types'
import { getMockPatients, getMockTests, getMockPatient, getMockTest } from '../mockData'

const USE_MOCK_DATA = process.env.NODE_ENV === 'development'

export function useApi() {
  const { dispatch } = useApp()

  const fetchPatients = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      let data: ApiResponse<Patient[]>
      if (USE_MOCK_DATA) {
        data = await getMockPatients()
      } else {
        const response = await fetch(`${API_BASE_URL}/patients`)
        data = await response.json()
      }

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
      } else {
        dispatch({ type: 'SET_PATIENTS', payload: data })
      }
    } catch {
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

      let data: ApiResponse<Test[]>
      if (USE_MOCK_DATA) {
        data = await getMockTests()
      } else {
        const response = await fetch(`${API_BASE_URL}/tests`)
        data = await response.json()
      }

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
      } else {
        dispatch({ type: 'SET_TESTS', payload: data })
      }
    } catch {
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

      let data: ApiResponse<Patient>
      if (USE_MOCK_DATA) {
        data = await getMockPatient(id)
      } else {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`)
        data = await response.json()
      }

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
        return null
      }
      return data
    } catch {
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

      let data: ApiResponse<Test>
      if (USE_MOCK_DATA) {
        data = await getMockTest(id)
      } else {
        const response = await fetch(`${API_BASE_URL}/tests/${id}`)
        data = await response.json()
      }

      if ('error' in data) {
        dispatch({ type: 'SET_ERROR', payload: data })
        return null
      }
      return data
    } catch {
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