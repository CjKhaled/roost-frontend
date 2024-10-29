import { type RouteObject } from 'react-router-dom'
import ManageListings from './pages/ManageListings'
import Settings from './pages/Settings'
import Messages from './pages/Messages'

export const profileRoutes: RouteObject[] = [
  {
    path: '/manage-listings',
    element: <ManageListings />
  },
  {
    path: '/settings',
    element: <Settings />
  },
  {
    path: '/messages',
    element: <Messages />
  }
]
