import { type LoginFormData, type SignupFormData, type AuthResponse } from '../types/auth'

interface ApiError {
  message: string
  statusCode?: number
}

class AuthService {
  private readonly API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

  async login (data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
    // Remove confirmPassword as it's not needed in the API
    const { confirmPassword, ...apiData } = data

    try {
      const response = await fetch(`${this.API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(apiData)
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

  async logout (): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/logout`, {
        method: 'GET',
        credentials: 'include' // Important for cookies
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }
    } catch (error) {
      throw new Error('Logout failed')
    }
  }
}

export const authService = new AuthService()
