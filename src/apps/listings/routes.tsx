import { type RouteObject } from 'react-router-dom'
import Listings from './pages/Listings'
import ListingDetails from './pages/ListingDetails'

export const listingsRoutes: RouteObject[] = [
  {
    path: '/listings',
    element: <Listings />
  },
  {
    path: '/listings/:id',
    element: <ListingDetails />
  }
]
