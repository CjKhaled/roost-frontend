import { type RouteObject } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
]
