import { Route, Routes, useNavigate } from "react-router-dom"
import { Button } from "./components/ui/button"
import SignupPage from "./pages/Signup"

import LoginPage from "./pages/Login"
import Home from "./pages/Home"
import Logout from "./pages/Logout"
import Attendance from "./pages/Attendance"
import { useEffect, useState } from "react"
import useUserStore from "./lib/store"
import axios from "axios"
import { BACKEND_URL } from "./lib/config"
import { Loader2 } from "lucide-react"
import CareTakerLoginPage from "./pages/CaretakerLogin"
import Dashboard from "./pages/Dashboard"
import OutpassAttendance from "./pages/OutpassAttendance"

function App() {
  const [loading,setLoading] = useState(false)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()
  useEffect(() => {
    const getUser = async () =>{
      const role = localStorage.getItem('role')
      if(!role){
        navigate('/')
        return
      }
      try{
        setLoading(true)
      
        if(role == 'STUDENT'){
          const res = await axios.get(`${BACKEND_URL}/user`,{
            withCredentials:true
          })
          setUser(res?.data.user)
        }else{
          const res = await axios.get(`${BACKEND_URL}/user/caretaker`,{
            withCredentials:true
          })
          setUser(res?.data.user)

        }

        
      }catch(err){

      }finally{
        setLoading(false)
      }
    }
    getUser();
  },[])
  if(loading){
    return (
      <div className="h-[100vh] flex justify-center items-center flex-col gap-3">
        <Loader2 size={40} className="animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Fething your details...</p>
      </div>
    )
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/caretaker-login" element={<CareTakerLoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<Button variant="default">Forgot Password</Button>} />
        <Route path="/reset-password" element={<Button variant="default">Reset Password</Button>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/give-attendance" element={<Attendance />} />
        <Route path="/give-outpassattendance" element={<OutpassAttendance />} />
      </Routes>
    </>
  )
}

export default App
