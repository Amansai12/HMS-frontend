import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Building ,Home} from 'lucide-react';
import useUserStore from '@/lib/store';

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

export default function ProfessionalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  
  const user = useUserStore((state) => state.user) as User | null;
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event : any) {
        //@ts-ignore
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);

  // User avatar initials
  const getUserInitials = (name : string) => {
    return name ? name.split(' ').map(n => n[0]).join('') : '';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg border-b border-gray-200 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex items-center justify-center sm:justify-start">
              <NavLink to="/" className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Hostelio</span>
              </NavLink>
            </div>

            {/* Desktop menu items */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {!user ? (
                <>
                  <NavLink 
                    to="/login"
                    className={({ isActive }) => 
                      `px-3 py-2 text-sm rounded-md ${isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/70'}`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/caretaker-login"
                    className={({ isActive }) => 
                      `px-3 py-2 text-sm rounded-md ${isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/70'}`
                    }
                  >
                    Caretaker Login
                  </NavLink>
                  <NavLink 
                    to="/signup"
                    className={() => 
                      `px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors`
                    }
                  >
                    Signup
                  </NavLink>
                </>
              ) : (
                <div className='flex items-center space-x-6'>
                  <div className="hidden md:flex space-x-4">
                    <NavLink to="/" className={({ isActive }) => 
                      `px-3 py-2 rounded-md ${isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/70'}`
                    }>
                      Home
                    </NavLink>
                    <NavLink to="/dashboard" className={({ isActive }) => 
                      `px-3 py-2 rounded-md ${isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/70'}`
                    }>
                      Dashboard
                    </NavLink>
                    
                  </div>
                  
                  {/* Profile dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button 
                      onClick={toggleProfile}
                      className="flex items-center space-x-2 p-1 rounded-full border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          getUserInitials(user.name)
                        )}
                      </div>
                    </button>
                    
                    {/* Profile dropdown menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg overflow-hidden border border-gray-200 z-10">
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm overflow-hidden">
                              {user.image ? (
                                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                              ) : (
                                getUserInitials(user.name)
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <NavLink to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                            <User className="mr-3 h-4 w-4 text-gray-500" />
                            Profile
                          </NavLink>
                          <NavLink to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                            <Settings className="mr-3 h-4 w-4 text-gray-500" />
                            Settings
                          </NavLink>
                          <div className="border-t border-gray-100 my-1"></div>
                          <NavLink to="/logout" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                          </NavLink>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile right side - only show if not logged in */}
            <div className="flex items-center space-x-2 sm:hidden">
              {!user ? (
                <NavLink 
                  to="/login"
                  className="py-1 px-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Login
                </NavLink>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 p-1 rounded-full border border-gray-200 hover:border-blue-300"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        getUserInitials(user.name)
                      )}
                    </div>
                  </button>
                  
                  {/* Mobile profile dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <NavLink to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                          <User className="mr-3 h-4 w-4 text-gray-500" />
                          Profile
                        </NavLink>
                        <NavLink to="/logout" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[70%] bg-white z-50 sm:hidden transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <NavLink to="/" className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Hostelio</span>
          </NavLink>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user && (
          <div className="flex items-center space-x-3 p-4 bg-gray-50 border-b border-gray-200">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                getUserInitials(user.name)
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="px-2 py-4">
          {user ? (
            <>
              <div className="space-y-1">
                <NavLink to="/" className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-2 text-sm rounded-md ${isActive 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                }>
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => 
                  `flex items-center space-x-3 px-4 py-2 text-sm rounded-md ${isActive 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                }>
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </NavLink>
                
                
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <NavLink to="/logout" className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </NavLink>
              </div>
            </>
          ) : (
            <div className="space-y-2 p-2">
              <NavLink to="/login" className="block w-full px-4 py-2 text-center text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                Login
              </NavLink>
              <NavLink to="/caretaker-login" className="block w-full px-4 py-2 text-center text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                CareTaker Login
              </NavLink>
              <NavLink to="/signup" className="block w-full px-4 py-2 text-center text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                Sign Up
              </NavLink>
            </div>
          )}
        </nav>
      </div>
      
      {/* Add a spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}