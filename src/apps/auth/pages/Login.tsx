import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { type LoginFormData, type AuthError } from '../types/auth'
import { authService } from '../services/auth'
import { useAuth } from '../../../context/AuthContext'

const LoginPage: React.FC = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const submitForm = async (): Promise<void> => {
      try {
        const response = await authService.login(formData)
        const user = response.user
        setUser(user)
        // if they were on a page, navigate them back to it. Otherwise, navigate to listings
        const from = (location.state as { from?: Location })?.from?.pathname ?? '/listings'
        navigate(from)
      } catch (err) {
        setError(err as AuthError)
      } finally {
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
            Welcome back to Roost
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {(error != null) && (
              <div className='text-red-500 text-sm text-center'>
                {error.message}
              </div>
            )}
            <Input
              type='email'
              name='email'
              placeholder='Email'
              onChange={handleChange}
              className='roost-input'
              required
            />
            <Input
              type='password'
              name='password'
              placeholder='Password'
              onChange={handleChange}
              className='roost-input'
              required
            />
            <Button
              type='submit'
              className='w-full roost-button'
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className='mt-4 text-center'>
            <Link to='/signup' className='roost-link'>
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
