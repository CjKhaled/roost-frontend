import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { type SignupFormData, type AuthError } from '../types/auth'
import { authService } from '../services/auth'
import { useAuth } from '../../../context/AuthContext'
import { validateEmail, validateName, validatePassword } from '../services/validation'

const SignupPage: React.FC = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [fieldErrors, setFieldErrors] = useState<Record<keyof SignupFormData, string | null>>({
    email: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setFieldErrors(prev => ({
      ...prev,
      [name]: null
    }))
  }

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    const firstNameError = validateName(formData.firstName, 'first name')
    const lastNameError = validateName(formData.lastName, 'last name')
    let confirmPasswordError: string | null = null

    if (formData.password !== formData.confirmPassword) {
      confirmPasswordError = 'Passwords do not match'
    }

    const newFieldErrors = {
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      firstName: firstNameError,
      lastName: lastNameError
    }

    setFieldErrors(newFieldErrors)
    return !Object.values(newFieldErrors).some(error => error !== null)
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    const submitForm = async (): Promise<void> => {
      try {
        const response = await authService.signup(formData)
        const user = response.user
        setUser(user)
        navigate('/listings')
      } catch (err) {
        setError(err as AuthError)
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setIsLoading(false)
      }
    }

    void submitForm()
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1'>
          <div className='flex items-center justify-center gap-2'>
            <Leaf className='h-6 w-6 text-amber-600' />
            <CardTitle className='text-2xl'>Roost</CardTitle>
          </div>
          <p className='text-center text-sm text-amber-700'>
            Join the Roost community
          </p>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='text-red-500 text-sm text-center'>
                {error.message}
              </div>
            )}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <Input
                  name='firstName'
                  placeholder='First Name'
                  onChange={handleChange}
                  className={`roost-input ${fieldErrors.firstName ? 'border-red-500' : ''}`}

                />
                {fieldErrors.firstName && (
                  <p className='text-red-500 text-sm'>{fieldErrors.firstName}</p>
                )}
              </div>
              <div className='space-y-1'>
                <Input
                  name='lastName'
                  placeholder='Last Name'
                  onChange={handleChange}
                  className={`roost-input ${fieldErrors.lastName ? 'border-red-500' : ''}`}

                />
                {fieldErrors.lastName && (
                  <p className='text-red-500 text-sm'>{fieldErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <Input
                type='text'
                name='email'
                placeholder='Email'
                onChange={handleChange}
                className={`roost-input ${fieldErrors.email ? 'border-red-500' : ''}`}
              />
              {fieldErrors.email && (
                <p className='text-red-500 text-sm'>{fieldErrors.email}</p>
              )}
            </div>
            <div className='space-y-1'>
              <Input
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleChange}
                className={`roost-input ${fieldErrors.password ? 'border-red-500' : ''}`}
              />
              {fieldErrors.password && (
                <p className='text-red-500 text-sm'>{fieldErrors.password}</p>
              )}
            </div>
            <div className='space-y-1'>
              <Input
                type='password'
                name='confirmPassword'
                placeholder='Confirm Password'
                onChange={handleChange}
                className={`roost-input ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {fieldErrors.confirmPassword && (
                <p className='text-red-500 text-sm'>{fieldErrors.confirmPassword}</p>
              )}
            </div>
            <Button
              type='submit'
              className='w-full roost-button'
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <div className='mt-4 text-center'>
            <Link to='/login' className='roost-link'>
              Already have an account? Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage
