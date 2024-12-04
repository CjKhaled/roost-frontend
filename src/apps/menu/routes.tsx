import { Outlet, type RouteObject } from 'react-router-dom'
import ManageListings from './pages/ManageListings'
import Settings from './pages/Settings'
import Messages from './pages/Messages'
import SidebarNav from './components/SidebarNav'
import Favorites from './pages/Favorites'

const DashboardLayoutWrapper = () => {
  return (
    <SidebarNav>
      <Outlet />
    </SidebarNav>
  )
}

export const menuRoutes: RouteObject[] = [
  {
    element: <DashboardLayoutWrapper />,
    children: [
      {
        path: '/manage-listings',
        element: <ManageListings />
      },
      {
        path: '/favorites',
        element: <Favorites />
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
  }
]
