import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, validateName } from '../services/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+tag@example.co.uk'
      ]

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBeNull()
      })
    })

    it('should reject emails that are too short', () => {
      expect(validateEmail('@b.c')).toBe('Email must be between 5-50 characters.')
    })

    it('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(40) + '@' + 'b'.repeat(10) + '.com'
      expect(validateEmail(longEmail)).toBe('Email must be between 5-50 characters.')
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notemail',
        'missing@domain',
        '@nodomain.com',
        'spaces in@email.com',
        'missing.dot@com'
      ]

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe('Must provide a valid email.')
      })
    })

    it('should trim whitespace before validation', () => {
      expect(validateEmail('  test@example.com  ')).toBeNull()
    })
  })

  describe('validatePassword', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'password123',
        'SecurePassword',
        '12345678',
        'a'.repeat(20)
      ]

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBeNull()
      })
    })

    it('should reject passwords that are too short', () => {
      expect(validatePassword('short')).toBe('Password must be between 8-20 characters.')
    })

    it('should reject passwords that are too long', () => {
      const longPassword = 'a'.repeat(21)
      expect(validatePassword(longPassword)).toBe('Password must be between 8-20 characters.')
    })

    it('should trim whitespace before validation', () => {
      expect(validatePassword('  password123  ')).toBeNull()
    })
  })

  describe('validateName', () => {
    it('should accept valid names', () => {
      const validNames = ['John', 'Mary', 'Robert']

      validNames.forEach(name => {
        expect(validateName(name, 'first name')).toBeNull()
        expect(validateName(name, 'last name')).toBeNull()
      })
    })

    it('should reject names that are too short', () => {
      expect(validateName('A', 'first name')).toBe('first name must be between 2-30 characters.')
    })

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(31)
      expect(validateName(longName, 'last name')).toBe('last name must be between 2-30 characters.')
    })

    it('should reject names with non-letter characters', () => {
      const invalidNames = ['John123', 'Mary!', 'Robert Jr.', 'Anna-Marie']

      invalidNames.forEach(name => {
        expect(validateName(name, 'first name')).toBe('first name must only contain letters.')
      })
    })

    it('should trim whitespace before validation', () => {
      expect(validateName('  John  ', 'first name')).toBeNull()
    })
  })
})
