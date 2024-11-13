export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim()
  if (trimmed.length < 5 || trimmed.length > 50) {
    return 'Email must be between 5-50 characters.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return 'Must provide a valid email.'
  }
  return null
}

export const validatePassword = (password: string): string | null => {
  const trimmed = password.trim()
  if (trimmed.length < 8 || trimmed.length > 20) {
    return 'Password must be between 8-20 characters.'
  }
  return null
}

export const validateName = (name: string, fieldName: 'first name' | 'last name'): string | null => {
  const trimmed = name.trim()
  if (trimmed.length < 2 || trimmed.length > 30) {
    return `${fieldName} must be between 2-30 characters.`
  }
  if (!/^[a-zA-Z]+$/.test(trimmed)) {
    return `${fieldName} must only contain letters.`
  }
  return null
}
