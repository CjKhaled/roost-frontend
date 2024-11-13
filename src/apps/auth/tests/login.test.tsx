/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../../context/AuthContext'
import LoginPage from '../pages/Login'
import { authService } from '../services/auth'

vi.mock('../services/auth', () => ({
  authService: {
    login: vi.fn()
  }
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderLoginPage = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  it('should render the login form', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty form submission', async () => {
    renderLoginPage()

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email must be between 5-50 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be between 8-20 characters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for empty email submission', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/email must be between 5-50 characters/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for empty password submission', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/password must be between 8-20 characters/i)).toBeInTheDocument()
    })
  })

  it('should show validate email error', async () => {
    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' }
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(/must provide a valid email/i)).toBeInTheDocument()
    })
  })

  it('should not let user press submit while loading', async () => {
    vi.mocked(authService.login).mockImplementationOnce(async () =>
      await new Promise(resolve => setTimeout(resolve, 100))
    )

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })

    const submitButton = screen.getByRole('button', { name: /log in/i })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/logging in/i)).toBeInTheDocument()
  })

  it('Don\'t have an account? Sign up should direct user to signup page', async () => {
    renderLoginPage()

    const signupLink = screen.getByText(/don't have an account\? sign up/i)
    expect(signupLink).toBeInTheDocument()
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup')
  })

  it('should handle successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }

    vi.mocked(authService.login).mockResolvedValueOnce({ user: mockUser })

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials'
    vi.mocked(authService.login).mockRejectedValueOnce(new Error(errorMessage))

    renderLoginPage()

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
})
