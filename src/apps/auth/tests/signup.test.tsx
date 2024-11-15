/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../../context/AuthContext'
import SignupPage from '../pages/Signup'
import { authService } from '../services/auth'

vi.mock('../services/auth', () => ({
  authService: {
    signup: vi.fn()
  }
}))

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderSignupPage = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <SignupPage />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  const fillForm = (overrides = {}) => {
    const defaultValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      ...overrides
    }

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { name: 'firstName', value: defaultValues.firstName }
    })
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { name: 'lastName', value: defaultValues.lastName }
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: defaultValues.email }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: defaultValues.password }
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { name: 'confirmPassword', value: defaultValues.confirmPassword }
    })

    return defaultValues
  }

  it('should render the signup form', () => {
    renderSignupPage()

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument()
  })

  describe('Form Validation', () => {
    it('should show validation errors for empty form submission', async () => {
      renderSignupPage()

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/first name must be between 2-30 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/last name must be between 2-30 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/email must be between 5-50 characters/i)).toBeInTheDocument()
        expect(screen.getByText(/password must be between 8-20 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for empty first name submission', async () => {
      renderSignupPage()

      fillForm({ firstName: '' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/first name must be between 2-30 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for empty last name submission', async () => {
      renderSignupPage()

      fillForm({ lastName: '' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/last name must be between 2-30 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for empty email submission', async () => {
      renderSignupPage()

      fillForm({ email: '' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/email must be between 5-50 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validation error for empty password submission', async () => {
      renderSignupPage()

      fillForm({ password: '', confirmPassword: '' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/password must be between 8-20 characters/i)).toBeInTheDocument()
      })
    })

    it('should show validate first name error (only letters)', async () => {
      renderSignupPage()

      fillForm({ firstName: 'John123' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/first name must only contain letters/i)).toBeInTheDocument()
      })
    })

    it('should show validate last name error (only letters)', async () => {
      renderSignupPage()

      fillForm({ lastName: 'Doe!' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/last name must only contain letters/i)).toBeInTheDocument()
      })
    })

    it('should show validate email error', async () => {
      renderSignupPage()

      fillForm({ email: 'invalid-email' })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/must provide a valid email/i)).toBeInTheDocument()
      })
    })

    it('should not let user press submit while loading', async () => {
      vi.mocked(authService.signup).mockImplementationOnce(async () =>
        await new Promise(resolve => setTimeout(resolve, 100))
      )

      renderSignupPage()
      fillForm()

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      fireEvent.click(submitButton)

      expect(submitButton).toBeDisabled()
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })

    it('Already have an account? Log in should direct user to login page', async () => {
      renderSignupPage()

      const loginLink = screen.getByText(/already have an account\? log in/i)
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
      expect(loginLink.closest('a')).toHaveClass('roost-link')
    })

    it('should validate password confirmation match', async () => {
      renderSignupPage()

      fillForm({
        password: 'password123',
        confirmPassword: 'differentpassword'
      })

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should handle successful signup', async () => {
      const mockUser = {
        id: '1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }

      vi.mocked(authService.signup).mockResolvedValueOnce({ user: mockUser })

      renderSignupPage()
      const formData = fillForm()

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(authService.signup).toHaveBeenCalledWith(formData)
      })
    })

    it('should handle signup failure', async () => {
      const errorMessage = 'Email already exists'
      vi.mocked(authService.signup).mockRejectedValueOnce(new Error(errorMessage))

      renderSignupPage()
      fillForm()

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })
  })
})
