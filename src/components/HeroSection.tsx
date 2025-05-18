
import { Button } from "@/components/ui/button";
import { Building2, Compass, Users, Star } from "lucide-react";
import useUserStore from "@/lib/store";
import { NavLink } from "react-router-dom";
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
export default function HeroSection() {
    const user = useUserStore((state) => state.user) as User | null
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden min-h-[95vh] flex">
      {/* Overlay Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:flex lg:items-center lg:gap-12">
        <div className="text-center lg:text-left lg:w-1/2">
          {user ? <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome <span className="text-indigo-200">{user.name}</span>
          </h1> : <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Manage Your Hostel <span className="text-indigo-200">Effortlessly</span>
          </h1>}
          
          <p className="mt-6 text-lg leading-8 text-indigo-100 max-w-2xl mx-auto lg:mx-0">
            Streamline operations, enhance guest experience, and boost occupancy with our all-in-one hostel management system built for modern hospitality businesses.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
            {user ? <NavLink to={'/dashboard'}>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium text-lg cursor-pointer">
              Dashboard
            </Button>
            </NavLink> : <NavLink to={'/login'}>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium text-lg cursor-pointer">
              Get Started Now
            </Button>
            </NavLink>}
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 text-indigo-100">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-center rounded-md bg-indigo-500/20 p-2 mb-3">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium">Attendance</p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-center rounded-md bg-indigo-500/20 p-2 mb-3">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium">Automated</p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-center rounded-md bg-indigo-500/20 p-2 mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium text-sm">students</p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-center rounded-md bg-indigo-500/20 p-2 mb-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium">Visualization</p>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block lg:w-1/2 mt-16 lg:mt-0">
          <div className="relative mx-auto w-full max-w-lg">
            {/* Decorative blob shapes */}
            <div className="absolute -top-12 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-24 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
            
            {/* Dashboard preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-2 border border-gray-200">
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="h-8 bg-gray-100 flex items-center gap-1 px-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="bg-white p-4">
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-1/3 h-6 bg-gray-200 rounded-md" />
                      <div className="flex gap-2">
                        <div className="w-24 h-8 bg-indigo-100 rounded-md" />
                        <div className="w-24 h-8 bg-indigo-500 rounded-md" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-24 bg-blue-50 rounded-lg p-4">
                        <div className="w-8 h-8 mb-2 rounded-full bg-blue-100" />
                        <div className="w-16 h-3 bg-gray-200 rounded mb-2" />
                        <div className="w-12 h-6 bg-blue-200 rounded" />
                      </div>
                      <div className="h-24 bg-green-50 rounded-lg p-4">
                        <div className="w-8 h-8 mb-2 rounded-full bg-green-100" />
                        <div className="w-16 h-3 bg-gray-200 rounded mb-2" />
                        <div className="w-12 h-6 bg-green-200 rounded" />
                      </div>
                      <div className="h-24 bg-purple-50 rounded-lg p-4">
                        <div className="w-8 h-8 mb-2 rounded-full bg-purple-100" />
                        <div className="w-16 h-3 bg-gray-200 rounded mb-2" />
                        <div className="w-12 h-6 bg-purple-200 rounded" />
                      </div>
                    </div>
                    <div className="h-32 bg-gray-50 rounded-lg mb-4" />
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-12 bg-gray-100 rounded" />
                      <div className="h-12 bg-gray-100 rounded" />
                      <div className="h-12 bg-gray-100 rounded" />
                      <div className="h-12 bg-indigo-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}