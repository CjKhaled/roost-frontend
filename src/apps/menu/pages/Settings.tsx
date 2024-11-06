import { Card } from '../../../components/ui/card'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Switch } from '../../../components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select'
import {
  Bell,
  User,
  Shield,
  Globe
} from 'lucide-react'

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
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Settings */}
        <SettingsSection
          title="Profile Settings"
          description="Manage your personal information and contact details"
          icon={<User className="w-5 h-5 text-amber-600" />}
        >
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notification Preferences */}
        <SettingsSection
          title="Notification Preferences"
          description="Control how and when you receive notifications"
          icon={<Bell className="w-5 h-5 text-amber-600" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-amber-700">Receive updates via email</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-amber-700">Receive push notifications</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Communications</Label>
                <p className="text-sm text-amber-700">Receive marketing updates</p>
              </div>
              <Switch />
            </div>
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

        {/* Language and Region */}
        <SettingsSection
          title="Language and Region"
          description="Set your preferred language and regional settings"
          icon={<Globe className="w-5 h-5 text-amber-600" />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select>
                <SelectTrigger className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select>
                <SelectTrigger className="bg-transparent border-amber-200 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsSection>

        {/* Save Changes */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
            Cancel
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Settings
