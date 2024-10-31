import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom'
import { authRoutes } from './apps/auth/routes'
import { listingsRoutes } from './apps/listings/routes'
import { menuRoutes } from './apps/menu/routes'
import { ProtectedRoute } from './components/ProtectedRoute'
import App from './App'

const protectedListingsRoutes = listingsRoutes.map(route => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>
}))

const protectedMenuRoutes = menuRoutes.map(route => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>
}))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to='/login' /> }, // Redirect root path to login
      ...authRoutes,
      ...protectedListingsRoutes,
      ...protectedMenuRoutes
    ]
  }
]

const router = createBrowserRouter(routes)

export default router
