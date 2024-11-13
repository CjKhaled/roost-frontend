import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '../services/auth'

describe('AuthService', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    vi.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await authService.login(loginData)
      expect(response).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(loginData)
        })
      )
    })

    it('should handle login failure with error message', async () => {
      const errorMessage = 'Invalid credentials'
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      })

      await expect(authService.login(loginData)).rejects.toThrow(errorMessage)
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      await expect(authService.login(loginData)).rejects.toThrow('Network error')
    })
  })

  describe('signup', () => {
    const signupData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }

    it('should successfully signup with valid data', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const response = await authService.signup(signupData)
      expect(response).toEqual(mockResponse)

      const { confirmPassword, ...expectedData } = signupData
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/signup'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(expectedData)
        })
      )
    })

    it('should handle signup failure with error message', async () => {
      const errorMessage = 'Email already exists'
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      })

      await expect(authService.signup(signupData)).rejects.toThrow(errorMessage)
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      })

      await expect(authService.logout()).resolves.not.toThrow()
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/logout'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include'
        })
      )
    })

    it('should handle logout failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      await expect(authService.logout()).rejects.toThrow('Logout failed')
    })
  })
})
