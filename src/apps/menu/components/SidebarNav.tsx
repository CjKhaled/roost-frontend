import { cn } from '../../../lib/utils'
import { Leaf, Home, Building, MessageSquare, Settings, Heart } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const SidebarNav = ({ children }: DashboardLayoutProps) => {
  const location = useLocation()

  const sidebarNavItems = [
    {
      title: 'Home',
      href: '/listings',
      icon: <Home className="h-5 w-5" />,
      isActive: location.pathname === '/listings'
    },
    {
      title: 'Manage Listings',
      href: '/manage-listings',
      icon: <Building className="h-5 w-5" />,
      isActive: location.pathname === '/manage-listings'
    },
    {
      title: 'Favorited Listings',
      href: '/favorites',
      icon: <Heart className='h-5 w-5' />,
      isActive: location.pathname === '/favorites'
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: <MessageSquare className="h-5 w-5" />,
      isActive: location.pathname === '/messages'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      isActive: location.pathname === '/settings'
    }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-50">
        <div className="flex">
            {/* Wider sidebar */}
            <aside className="fixed left-0 top-0 z-30 h-screen w-72 border-r border-amber-200 bg-white/50 backdrop-blur-sm">
            <div className="flex h-full flex-col gap-4">
                {/* Larger logo area */}
                <div className="flex h-20 items-center border-b border-amber-200 px-6 gap-3">
                <Leaf className="h-8 w-8 text-amber-600" />
                <span className="text-4xl font-bold text-amber-900">Roost</span>
                </div>
                <div className="flex-1 px-4">
                    <nav className={cn('flex flex-col gap-2')}>
                        {sidebarNavItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                              item.isActive
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-amber-800 hover:bg-amber-100 hover:text-amber-900'
                            )}
                        >
                            {item.icon}
                            {item.title}
                        </a>
                        ))}
                    </nav>
                </div>
            </div>
            </aside>
            <main className="flex-1 pl-72">
            {children}
            </main>
        </div>
    </div>

  )
}

export default SidebarNav
