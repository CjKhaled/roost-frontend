import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { type SignupFormData, type AuthError } from '../types/auth'
// import { authService } from '../services/auth';

const SignupPage: React.FC = () => {
  // const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // add more validations later
  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError({ message: 'Passwords do not match' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      // const response = await authService.signup(formData);
      // localStorage.setItem('token', response.token);
      // router.push('/dashboard');

      console.log(formData)
    } catch (err) {
      setError(err as AuthError)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-6 w-6 text-amber-600" />
            <CardTitle className="text-2xl">Roost</CardTitle>
          </div>
          <p className="text-center text-sm text-amber-700">
            Join the Roost community
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error.message}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                className="roost-input"
                required
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                className="roost-input"
                required
              />
            </div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="roost-input"
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="roost-input"
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="roost-input"
              required
            />
            <Button
              type="submit"
              className="w-full roost-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="roost-link">
              Already have an account? Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage
