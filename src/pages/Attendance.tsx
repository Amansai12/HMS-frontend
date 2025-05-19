import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/config';
import axios from 'axios';
import { CheckCircle2, Loader2, LucideMessageSquareWarning } from 'lucide-react';
import { useEffect, useState } from 'react';

function Attendance() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error' | 'denied' | 'unsupported'>('checking');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [latitude,setLatitude] = useState(0)
  const [longitude,setLongitude] = useState(0)
  const [retry,setRetry] = useState(false)

  useEffect(() => {
    const getLocationAndGiveAttendance = () => {
      if (!navigator.geolocation) {
        setStatus('unsupported');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setStatus('success')
          setLatitude(latitude)
          setLongitude(longitude)
          //console.log(latitude)
        },
        (error) => {
          console.error(error);
          setStatus('denied');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 0,
        }
      );
    };

    getLocationAndGiveAttendance();
  }, [retry]);

  useEffect(() => {
    const giveAttendance = async () => {
      try {
        const res = await axios.post(
          `${BACKEND_URL}/attendance`,
          { latitude, longitude },
          { withCredentials: true }
        );
        console.log(res.data)
        //alert("Your coords are : " + res.data.data.latitude)
        setStatus('success');
      } catch (err) {
        console.error('Attendance Error:', err);
        //@ts-ignore
        setErrorMsg(err.response?.data?.message || 'Something went wrong');
        setStatus('error');
      } finally {
        setLoading(false);
        alert(latitude)
      }
    }
    if(status == 'success'){
      giveAttendance()
    }
  },[status])

  return (
    <div className="p-4 min-h-[100vh] flex flex-col justify-center items-center gap-3">
      {loading && (
        <>
          <Loader2 size={40} className="animate-spin" />
          <p className="font-bold text-lg text-center">Getting location and submitting attendance...</p>
        </>
      )}

      {!loading && status === 'success' && (
        <>
          <CheckCircle2 size={80} className="text-green-500" />
          <p className="font-bold text-lg text-center">Attendance has been given successfully</p>
        </>
      )}

      {!loading && status === 'error' && (
        <>
          <LucideMessageSquareWarning size={80} className="text-red-500" />
          <p className="font-bold text-lg text-center">{errorMsg}</p>
        </>
      )}

      {!loading && status === 'denied' && (
        <div className="text-red-600 font-semibold text-center flex flex-col justify-center items-center gap-3">
          Location permission denied. Please enable location to mark attendance.
          <Button onClick={() => setRetry((prev) => !prev)}>
            Retry
          </Button>

        </div>
      )}

      {!loading && status === 'unsupported' && (
        <div className="text-yellow-600 text-center">
          Your browser does not support geolocation.
        </div>
      )}
    </div>
  );
}

export default Attendance;