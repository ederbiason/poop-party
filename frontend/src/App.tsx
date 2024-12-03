import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { Home } from '@/components/Home'
import { Authentication } from '@/components/Authentication'
import { Toaster } from '@/components/ui/toaster'
import { MainLayout } from './components/MainLayout'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authentication" element={<Authentication />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  )
}
