import { useEffect, useState } from 'react'
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [role,setRole] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
        const r = localStorage.getItem('role') || ""
        if(!r) navigate('/')
        setRole(r);
    },[])

    if(role == 'STUDENT') return <StudentDashboard />

  return (
    <AdminDashboard />
  )
}

export default Dashboard