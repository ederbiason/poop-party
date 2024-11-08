import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { Home } from '@/components/Home'
import Authentication from '@/components/Authentication'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authentication" element={<Authentication />} />
        
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}
