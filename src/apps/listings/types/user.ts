export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdListings: Array<{ id: string }>
  favorites: Array<{ id: string }>
}
