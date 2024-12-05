import { Card } from '../../../components/ui/card'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import {
  User,
  Shield
} from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

const SettingsSection = ({
  title,
  description,
  icon,
  children
}: {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) => (
  <Card className="p-6 bg-white/50 backdrop-blur-sm">
    <div className="flex items-start gap-4 mb-6">
      <div className="p-2 rounded-lg bg-amber-100">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-amber-900 mb-1">{title}</h2>
        <p className="text-sm text-amber-700">{description}</p>
      </div>
    </div>
    {children}
  </Card>
)

const Settings = () => {
  const { user } = useAuth()
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile Settings"
          description="Manage your personal information"
          icon={<User className="w-5 h-5 text-amber-600" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={user?.firstName}
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={user?.lastName}
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email}
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Update Information
            </Button>
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection
          title="Security"
          description="Manage your account security and authentication settings"
          icon={<Shield className="w-5 h-5 text-amber-600" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Update Password
            </Button>
          </div>
        </SettingsSection>

        {/* Save Changes */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Settings
