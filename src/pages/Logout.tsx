
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';

function Logout() {
    const [loading, setLoading] = React.useState(false);
    useEffect(() => {
        const logout = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/user/logout', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    localStorage.removeItem('role')
                    window.location.href = '/';
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }finally {
                setLoading(false);
            }
        };

        logout();
    }
    , []);
  return (
    <>
    <div className='flex min-h-[100vh] bg-white items-center justify-center'>
        {loading ? (
            <div className="flex justify-center items-center min-h-screen flex-col">
                <Loader2 className='animate-spin' />
                <p className="text-2xl">Logging out...</p>
            </div>
        ) : (
            <div className="flex justify-center items-center min-h-screen flex-col">
                <p className="text-2xl">You have been logged out.</p>
                <NavLink to="/" className="text-md mt-4 bg-black text-white px-4 py-2 rounded-md">
                    Home
                </NavLink>
            </div>
        )}
    </div>
    </>
  )
}

export default Logout