// 'use client'

// import { Header } from '@/components/Header'
// import { ParameterCard } from '@/components/charts/ParameterCard'
// import { useApp } from '@/lib/context/AppContext'
// import { useApi } from '@/lib/hooks/useApi'
// import { useEffect } from 'react'
// import { notFound } from 'next/navigation'
// import { useParams } from 'next/navigation'

// export function PatientContent() {
//   const { state, dispatch } = useApp()
//   const { fetchTests } = useApi()
//   const params = useParams<{ id: string }>()

//   useEffect(() => {
//     const fetchPatientData = async () => {
//       dispatch({ type: 'SET_LOADING', payload: true })
//       try {
//         // Fetch patient details
//         const patientResponse = await fetch(`/api/patients/${params.id}`)
//         console.log('patientResponse', patientResponse)
//         const patientData = await patientResponse.json()
//         console.log('patientData', patientData)
//         dispatch({ type: 'UPDATE_PATIENT', payload: patientData })

//         // Fetch patient tests
//         const testsResponse = await fetch(`/api/patients/${params.id}/tests`)
//         console.log('testsResponse', testsResponse)
//         const testsData = await testsResponse.json()
//         console.log('testsData', testsData)
//         dispatch({ type: 'SET_TESTS', payload: testsData })
//       } catch (error) {
//         console.error('Error fetching patient data:', error)
//       } finally {
//         dispatch({ type: 'SET_LOADING', payload: false })
//       }
//     }

//     if (params.id) {
//       fetchPatientData()
//     }
//   }, [params.id, dispatch])

//   if (!params.id) {
//     notFound()
//   }

//   const patient = state.patients.find(p => p.id === Number(params.id))
//   if (!patient) return null

//   // Find the blood test with hemoglobin parameter for this patient
//   const bloodTest = state.tests.find(
//     (test) => test.name === 'Blood Test'
//   )

//   const hemoglobinParameter = bloodTest?.parameters.find(
//     (param) => param.name === 'Hemoglobin'
//   )

//   return (
//     <>x
//       <Header />
//       <main className="container py-6">
//         <h1 className="text-3xl font-bold mb-6">Patient Details</h1>
//         <h2 className="text-2xl font-semibold mb-4">Name: {patient.name}</h2>
//         <h3>TEST</h3>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {hemoglobinParameter && (
//             <ParameterCard
//               parameter={hemoglobinParameter}
//               className="col-span-full md:col-span-2"
//             />
//           )}
//         </div>
//       </main>
//     </>
//   )
// } 