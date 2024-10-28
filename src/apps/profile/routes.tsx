import { type RouteObject } from 'react-router-dom'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/profile/edit',
    element: <EditProfile />
  }
]
