import {
  User,
  MessageSquare,
  Settings,
  House
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu'
import { Link } from 'react-router-dom'

const ProfileMenu = (): JSX.Element => {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant='outline'
        className='roost-button flex items-center gap-2 hover:bg-amber-50'
      >
        <User className='h-4 w-4' />
        Profile
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align='end'
      className='w-48 bg-white border border-amber-100'
    >
      <Link to='/manage-listings'>
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer'>
          <House className='h-4 w-4' />
          <span>Manage Listings</span>
        </DropdownMenuItem>
      </Link>
      <Link to='/messages'>
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer'>
          <MessageSquare className='h-4 w-4' />
          <span>Messages</span>
        </DropdownMenuItem>
      </Link>
      <Link to='/settings'>
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer'>
          <Settings className='h-4 w-4' />
          <span>Settings</span>
        </DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default ProfileMenu
