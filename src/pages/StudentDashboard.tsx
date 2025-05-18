import React, { useState, type ReactElement, type JSX } from 'react';
import { 
  User, 
  Bell, 
  Users,
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import StudentDashboard1 from '@/components/StudentDashboard1';
import StudentProfile from '@/components/StudentProfile';
import StudentNotification from '@/components/StudentNotification';
import { NavLink, useNavigate } from 'react-router-dom';
import OutPassPage from '@/components/RequestOutpass';
import useUserStore from '@/lib/store';

type MenuItemType = 'home' | 'dashboard' | 'attendance' | 'outpass' | 'schedule' | 'profile' | 'notifications' | 'caretaker';

interface SidebarItemProps {
  icon: ReactElement;
  label: string;
  id: string;
  active?: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

interface NavbarProps {
  toggleMobileSidebar: () => void;
}
type User = {
  id: string,
  name: string,
  email: string,
  image: string,
  collegeId: string,
  address: string,
  room: {
    name: string,
    hostel: {
      name: string,
      id: string
    }
  }
}
// Dashboard component
export default function StudentDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<MenuItemType>('dashboard');
  const navigate = useNavigate();
  
  const toggleSidebar = (): void => {
    setCollapsed(!collapsed);
  };
  const toggleMobileSidebar = (): void => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleMenuItemClick = (item: MenuItemType): void => {
    setActiveItem(item);
    // Close mobile sidebar when an item is clicked
    setShowMobileSidebar(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-base">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className={`bg-gray-800 text-white transition-all duration-300 ease-in-out fixed md:relative z-20 h-full
        ${collapsed ? 'w-14 md:w-20' : 'w-64'} 
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && <h1 className="text-xl font-bold text-white">Hostelio</h1>}
          <div className="flex items-center">
            {/* Close button only on mobile */}
            <button 
              onClick={toggleMobileSidebar} 
              className="p-2 rounded-md hover:bg-teal-700 md:hidden"
            >
              <X size={20} className="text-white" />
            </button>
            
            {/* Toggle collapse button - only on desktop */}
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md  hover:text-black hidden md:block"
            >
              <Menu size={collapsed ? 15 : 20} className="text-white cursor-pointer" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            <SidebarItem 
              icon={<Home size={collapsed ? 15 : 20} />} 
              label="Home" 
              id="home"
              active={activeItem === 'home'} 
              collapsed={collapsed}
              onClick={() => {
                handleMenuItemClick('home');
                navigate('/');
              }}
            />
            {/* <SidebarItem 
              icon={<LayoutDashboard size={collapsed ? 15 : 20} />} 
              label="Dashboard" 
              id="dashboard"
              active={activeItem === 'dashboard'} 
              collapsed={collapsed}
              onClick={() => handleMenuItemClick('dashboard')}
            /> */}
            <SidebarItem 
              icon={<Users size={collapsed ? 15 : 20} />} 
              label="Outpass" 
              id="outpass"
              active={activeItem === 'outpass'} 
              collapsed={collapsed}
              onClick={() => handleMenuItemClick('outpass')}
            />
            <SidebarItem 
              icon={<User size={collapsed ? 15 : 20} />} 
              label="Profile" 
              id="profile"
              active={activeItem === 'profile'} 
              collapsed={collapsed}
              onClick={() => handleMenuItemClick('profile')}
            />
            <SidebarItem 
              icon={<Bell size={collapsed ? 15 : 20} />} 
              label="Notifications" 
              id="notifications"
              active={activeItem === 'notifications'} 
              collapsed={collapsed}
              onClick={() => handleMenuItemClick('notifications')}
            />
          </ul>
        </nav>
        
        <div className="p-4 border-t bg-gray-800">
          <button 
            className="flex items-center w-full py-2 px-3 rounded-md transition-colors duration-200 text-white hover:bg-black-700"
          > 
            <NavLink to={'/logout'} className="flex gap-1">
              <LogOut size={20} className="text-white" />
              {!collapsed && <span className="ml-3 font-medium text-sm">Logout</span>}
            </NavLink>
          </button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full">
            {activeItem === 'dashboard' && <StudentDashboard1 />}
            {activeItem === 'profile' && <StudentProfile />}
            {activeItem === 'notifications' && <StudentNotification />}
            {activeItem === 'outpass' && <OutPassPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, collapsed = false, onClick}: SidebarItemProps): JSX.Element {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`flex cursor-pointer items-center w-full py-3 px-3 rounded-md transition-colors duration-200 ${
          active 
            ? 'bg-gray-700 text-white' 
            : 'text-gray-100 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <div className="flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { 
            //@ts-ignore
            className: active ? 'text-white' : 'text-teal-100' 
          })}
        </div>
        {!collapsed && <span className="ml-3 font-medium text-sm">{label}</span>}
      </button>
    </li>
  );
}


function Navbar({ toggleMobileSidebar }: NavbarProps): JSX.Element {
  const user = useUserStore((state) => state.user) as User | null
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {/* Mobile menu toggle button */}
          <button 
            onClick={toggleMobileSidebar}
            className={`mr-3 p-2 rounded-md text-black md:hidden`}
          >
            <Menu size={20} />
          </button>
          <div>
          <h2 className="text-lg md:text-lg font-semibold text-gray-600">{user?.name}</h2>
          <p className='text-[12px] text-gray-500'>{user?.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs overflow-hidden">
                      {user?.image ? (
                        <img src={user?.image} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        "U"
                      )}
                    </div>
          </div>
        </div>
      </div>
    </header>
  );
}