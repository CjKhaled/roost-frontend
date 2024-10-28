import { type LoginFormData, type SignupFormData, type AuthResponse } from '../types/auth'

// Define the shape of API error responses
interface ApiError {
  message: string
  statusCode?: number
}

class AuthService {
  private readonly API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

  async login (data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json() as ApiError
        throw new Error(errorData.message ?? 'Login failed')
      }

      return await response.json() as AuthResponse
    } catch (error) {
      if (error instanceof Error) {
        const authError = new Error(error.message) as Error & { isAuthError: true }
        authError.isAuthError = true
        throw authError
      }
      throw new Error('Login failed')
    }
  }

  async signup (data: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json() as ApiError
        throw new Error(errorData.message ?? 'Signup failed')
      }

      return await response.json() as AuthResponse
    } catch (error) {
      if (error instanceof Error) {
        const authError = new Error(error.message) as Error & { isAuthError: true }
        authError.isAuthError = true
        throw authError
      }
      throw new Error('Signup failed')
    }
  }
}

export const authService = new AuthService()
