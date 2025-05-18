import React, { useState, type ReactElement, type JSX } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Bell, 
  Calendar,
  CheckSquare,
  Users,
  Home,
  LogOut,
  Menu,
  Ticket,
} from 'lucide-react';

import StudentProfile from '@/components/StudentProfile';
import StudentNotification from '@/components/StudentNotification';
import { useNavigate } from 'react-router-dom';
import StudentManagement from '@/components/Students';
import HostelRoomManagement from '@/components/AddHostel';
import CaretakerRegistrationForm from '@/components/AddCareTaker';
import GetAttendance from '@/components/GetAttendance';
import Visualization from './Visualization';
import GrantOutpass from '@/components/GransOutpass';
import useUserStore from '@/lib/store';

type MenuItemType = 'home' | 'dashboard' | 'attendance' | 'students' | 'schedule' | 'profile' | 'notifications' | 'caretaker' | 'outpass';

interface SidebarItemProps {
  icon: ReactElement;
  label: string;
  id: string;
  active?: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

interface NavbarProps {}

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
export default function AdminDashboard(): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<MenuItemType>('dashboard');
  const navigate = useNavigate();
  const role = localStorage.getItem('role')
  const toggleSidebar = (): void => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-base">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-14 md:w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between p-4 border-b border-teal-700">
          {!collapsed && <h1 className="text-xl font-bold text-white">Hostelio</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-teal-700">
            <Menu size={collapsed ? 15 : 20} className="text-white" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            <SidebarItem 
              icon={<Home size={collapsed ? 15 : 20} />} 
              label="Home" 
              id="home"
              active={activeItem === 'home'} 
              collapsed={collapsed}
              onClick={() => navigate('/')}
            />
            <SidebarItem 
              icon={<LayoutDashboard size={collapsed ? 15 : 20} />} 
              label="Dashboard" 
              id="dashboard"
              active={activeItem === 'dashboard'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('dashboard')}
            />
            <SidebarItem 
              icon={<CheckSquare size={collapsed ? 15 : 20} />} 
              label="Attendance" 
              id="attendance"
              active={activeItem === 'attendance'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('attendance')}
            />
            <SidebarItem 
              icon={<Users size={collapsed ? 15 : 20} />} 
              label="Students" 
              id="students"
              active={activeItem === 'students'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('students')}
            />
            <SidebarItem 
              icon={<Calendar size={collapsed ? 15 : 20} />} 
              label="Hostel & Rooms" 
              id="schedule"
              active={activeItem === 'schedule'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('schedule')}
            />
            {role && role == 'ADMIN' && <SidebarItem 
              icon={<User size={collapsed ? 15 : 20} />} 
              label="CareTakers" 
              id="caretakers"
              active={activeItem === 'caretaker'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('caretaker')}
            />}
            <SidebarItem 
              icon={<Ticket size={collapsed ? 15 : 20} />} 
              label="Outpass" 
              id="outpass"
              active={activeItem === 'outpass'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('outpass')}
            />
            {/* <SidebarItem 
              icon={<User size={collapsed ? 15 : 20} />} 
              label="Profile" 
              id="profile"
              active={activeItem === 'profile'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('profile')}
            /> */}
            <SidebarItem 
              icon={<Bell size={collapsed ? 15 : 20} />} 
              label="Notifications" 
              id="notifications"
              active={activeItem === 'notifications'} 
              collapsed={collapsed}
              onClick={() => setActiveItem('notifications')}
            />
          </ul>
        </nav>
        
        <div className="p-4 border-t border-teal-700">
          <button 
            onClick={() => navigate('/logout')}
            className="flex items-center w-full py-2 px-3 rounded-md transition-colors duration-200 text-white hover:bg-teal-700"
          >
            <LogOut size={20} className="text-white" />
            {!collapsed && <span className="ml-3 font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-full">
            {activeItem === 'dashboard' && <Visualization />}
            {activeItem === 'profile' && <StudentProfile />}
            {activeItem === 'caretaker' && <CaretakerRegistrationForm />}
            {activeItem === 'notifications' && <StudentNotification />}
            {activeItem === 'attendance' && <GetAttendance />}
            {activeItem === 'outpass' && <GrantOutpass />}
            {activeItem === 'students' && <StudentManagement />}
            {activeItem === 'schedule' && <HostelRoomManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, collapsed = false, onClick }: SidebarItemProps): JSX.Element {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`flex cursor-pointer items-center w-full py-3 px-3 rounded-md transition-colors duration-200 ${
          active 
            ? 'bg-teal-700 text-white' 
            : 'text-teal-100 hover:bg-teal-700 hover:text-white'
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

// Navbar component
function Navbar({}: NavbarProps): JSX.Element {
  const user = useUserStore((state) => state.user) as User | null
  return (
    <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              
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



