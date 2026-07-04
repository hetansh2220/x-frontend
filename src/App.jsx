import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import LandingPage from './pages/landing-page'
import { Routes, Route } from 'react-router-dom'
import AuthInitializer from '@/components/AuthInitializer'
import ProtectedRoutes from './components/ProtectedRoutes'



function App() {

  return (
    <div>
      <AuthInitializer>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/home' element={<Home />} />
          </Route>
        </Routes>
      </AuthInitializer>
    </div>
  )
}

export default App
