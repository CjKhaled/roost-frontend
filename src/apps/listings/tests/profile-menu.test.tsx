import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProfileMenu from '../components/ProfileMenu'
import { authService } from '../../auth/services/auth'
import userEvent from '@testing-library/user-event'

// Mock the auth service
vi.mock('../../auth/services/auth')

// Mock React Router's useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock auth context
const mockSetUser = vi.fn()
const mockAuthContext = {
  user: {
    id: 'test-user',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  },
  setUser: mockSetUser,
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn()
}

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('Profile Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render profile menu', async () => {
    const user = userEvent.setup()
    render(
        <BrowserRouter>
          <ProfileMenu />
        </BrowserRouter>
    )

    // Check if Profile button exists
    const profileButton = screen.getByRole('button', { name: /profile/i })
    expect(profileButton).toBeInTheDocument()

    // Open the menu
    await user.click(profileButton)

    // Check if all menu items are present
    expect(screen.getByText('Manage Listings')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Log Out')).toBeInTheDocument()
  })

  it('Manage Listings button should navigate to manage-listings page', async () => {
    const user = userEvent.setup()
    render(
        <BrowserRouter>
          <ProfileMenu />
        </BrowserRouter>
    )

    // Open the menu
    await user.click(screen.getByRole('button', { name: /profile/i }))

    // Click Manage Listings
    const manageListingsLink = screen.getByText('Manage Listings')
    await user.click(manageListingsLink)

    // Check if the navigation occurred
    expect(window.location.pathname).toBe('/manage-listings')
  })

  it('Messages button should navigate to messages page', async () => {
    const user = userEvent.setup()
    render(
        <BrowserRouter>
          <ProfileMenu />
        </BrowserRouter>
    )

    // Open the menu
    await user.click(screen.getByRole('button', { name: /profile/i }))

    // Click Messages
    const messagesLink = screen.getByText('Messages')
    await user.click(messagesLink)

    // Check if the navigation occurred
    expect(window.location.pathname).toBe('/messages')
  })

  it('Settings button should navigate to settings page', async () => {
    const user = userEvent.setup()
    render(
        <BrowserRouter>
          <ProfileMenu />
        </BrowserRouter>
    )

    // Open the menu
    await user.click(screen.getByRole('button', { name: /profile/i }))

    // Click Settings
    const settingsLink = screen.getByText('Settings')
    await user.click(settingsLink)

    // Check if the navigation occurred
    expect(window.location.pathname).toBe('/settings')
  })

  it('Log Out button should logout the user', async () => {
    const user = userEvent.setup()
    render(
        <BrowserRouter>
          <ProfileMenu />
        </BrowserRouter>
    )

    // Mock successful logout
    vi.mocked(authService.logout).mockResolvedValueOnce(undefined)

    // Open the menu
    await user.click(screen.getByRole('button', { name: /profile/i }))

    // Click Log Out
    const logoutButton = screen.getByText('Log Out')
    await user.click(logoutButton)

    // Verify logout was called
    expect(authService.logout).toHaveBeenCalled()

    // Verify user was cleared
    expect(mockSetUser).toHaveBeenCalledWith(null)

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should handle logout failure', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
        <BrowserRouter>
          <ProfileMenu />
        </BrowserRouter>
    )

    // Mock failed logout
    vi.mocked(authService.logout).mockRejectedValueOnce(new Error('Logout failed'))

    // Open the menu
    await user.click(screen.getByRole('button', { name: /profile/i }))

    // Click Log Out
    const logoutButton = screen.getByText('Log Out')
    await user.click(logoutButton)

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error))

    // Clean up
    consoleSpy.mockRestore()
  })
})
