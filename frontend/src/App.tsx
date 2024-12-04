import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { Home } from '@/components/Home'
import { Authentication } from '@/components/Authentication'
import { Toaster } from '@/components/ui/toaster'
import { MainLayout } from './components/MainLayout'
import { PartyDetails } from './components/PartyDetails'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authentication" element={<Authentication />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/party/:id" element={<PartyDetails />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  )
}
