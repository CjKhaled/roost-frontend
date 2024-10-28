export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData extends LoginFormData {
  firstName: string
  lastName: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

export interface AuthError {
  message: string
  field?: keyof LoginFormData | keyof SignupFormData
}
