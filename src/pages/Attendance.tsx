import { BACKEND_URL } from '@/lib/config';
import axios from 'axios';
import { CheckCircle2, Loader2, LucideMessageSquareWarning } from 'lucide-react';
import { useState, useEffect } from 'react'

function Attendance() {
    const [permissionStatus, setPermissionStatus] = useState('checking');
    const [latitude,setLatitude] = useState(0)
    const [longitude,setLongitude] = useState(0)
    const [loading,setLoading] = useState(false)
    const [isError,setError] = useState(false)
    const [errorMsg,setErrorMsg] = useState("")
    const [called,setCalled] = useState(false)
    useEffect(() => {
        if ('permissions' in navigator) {
          navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            const getLocationAndGiveAttendance = () => {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  //giveAttendance(position.coords.latitude, position.coords.longitude);
                  setLatitude(position.coords.latitude);
                  setLongitude(position.coords.longitude);
                  setPermissionStatus('granted');
                },
                (error) => {
                  console.error(error);
                  setPermissionStatus('denied');
                }
              );
            };
      
            if (result.state === 'granted' || result.state === 'prompt') {
              getLocationAndGiveAttendance();
            } else {
              setPermissionStatus('denied');
            }
          });
        } else {
          setPermissionStatus('unsupported');
        }
      }, []);

    useEffect(() => {
        const giveAttendance = async (latitude: any, longitude: any) => {
            if (called) return;
            setCalled(true)
            console.log(called)
        
            try {
              setLoading(true);
              const res = await axios.post(`${BACKEND_URL}/attendance`, { latitude, longitude }, {
                withCredentials: true,
              });
              console.log(res.data);
            } catch (err) {
              console.error('Error during attendance:', err);
              setError(true);
              //@ts-ignore
              setErrorMsg(err.response?.data?.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          };
        if(permissionStatus == 'granted'){
            giveAttendance(latitude,longitude)
        }
    },[permissionStatus])

    
      
  return (
    <>
    <div className="p-4">
      {permissionStatus === 'checking' && (
        <div>Checking location permission...</div>
      )}
      
      
      
      {permissionStatus === 'denied' && (
        <div className="text-red-600 font-semibold">
          Attendance failed! Location permission is required.
          <p className="mt-2 text-sm">Please enable location services to mark your attendance.</p>
        </div>
      )}
      
      {permissionStatus === 'unsupported' && (
        <div className="text-yellow-600">
          Your browser doesn't support geolocation features.
        </div>
      )}
    </div>
    {permissionStatus === 'granted' && 
    <div className='flex justify-items-center min-h-[100vh] w-full'>
        {loading ? <div className='flex flex-col justify-center items-center gap-3 w-full'>
            <Loader2 size={40} className='animate-spin' />
            <p className='font-bold text-lg w-[60%] text-center'>submitting attendance...</p>
        </div> : 
        isError ? <div className='flex flex-col justify-center items-center gap-3 w-full'>
        <LucideMessageSquareWarning size={80} className='text-red-500' />
        <p className='font-bold text-lg w-[60%] text-center'>{errorMsg}</p>
    </div> : <div className='flex flex-col justify-center items-center gap-3 w-full'>
        <CheckCircle2 size={80} className='text-green-500' />
        <p className='font-bold text-lg w-[60%] text-center'>Attendance has been given successfully</p>
    </div>}
    </div>}
    </>
  )
}

export default Attendance