import { createBrowserRouter, type RouteObject, Navigate } from 'react-router-dom'
import { authRoutes } from './apps/auth/routes'
import { listingsRoutes } from './apps/listings/routes'
import { profileRoutes } from './apps/profile/routes'
import App from './App'

// Combine all routes into a single array of RouteObjects
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/login" /> }, // Redirect root path to login
      ...authRoutes,
      ...listingsRoutes,
      ...profileRoutes
    ]
  }
]

const router = createBrowserRouter(routes)

export default router
