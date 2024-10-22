import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Authentication from '@/components/Authentication.tsx'

const router = createBrowserRouter([
  {
    path: '/authentication',
    element: <Authentication /> 
  },
  {
    path: '/',
    element: (
      <App /> 
    )
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)