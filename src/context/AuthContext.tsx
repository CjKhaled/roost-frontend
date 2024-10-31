import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  //   const API_URL: string = `${import.meta.env.VITE_API_URL}/listings`

  const checkAuth = async (): Promise<void> => {
    try {
      // We can use any protected endpoint to check auth status
      const response = await fetch('http://localhost:3000/api/listings', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          const user: User = data.user
          setUser(user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
        if (response.status === 403) {
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      setUser(null)
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void checkAuth()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
