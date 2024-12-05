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
      const response = await fetch('http://localhost:3000/api/users', {
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
      }
    } catch (error) {
      setUser(null)
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
