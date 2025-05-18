import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import useUserStore from '@/lib/store';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try{
        setLoading(true);
        const response = await axios.post('http://localhost:3000/api/user/student-login', formData, {
            withCredentials: true,
        })
        setUser(response.data.user);
        localStorage.setItem('role',response.data.type)
        navigate('/');
    }catch (error) {
        console.error('Error during signup:', error);
        setError('An error occurred during signup. Please try again.');
    }finally{
        setLoading(false);
    }
    setError('');
  };

  return (
    <div className="flex min-h-[100vh] bg-white">
      <div className='w-full md:w-1/2 px-4 flex justify-center items-center max-w-[500px] mx-auto'>
      <Card className="w-full border-none shadow-none">
        <CardHeader className="space-y-">
            <h1 className='text-blue-600 text-3xl font-bold text-center'>Hostelio</h1>
          <CardDescription className="text-center">
            Log into your account to get started
          </CardDescription>
        </CardHeader>
        
        
        
        {error && (
          <Alert className="m-4 bg-red-50 text-red-700 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
                         
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 mt-7">
            <Button type="submit" className="w-full">
                {loading ? <Loader2 className='animate-spin' /> : 'Login'}
            </Button>
            <p className="text-sm text-center text-gray-500">
              Don't have an account? <NavLink to={'/signup'} className="text-primary font-medium hover:underline">Sign up</NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
      <div className='w-1/2 hidden md:block'>
        <img src="/2383990.jpg" alt="Signup" className="h-full" />
      </div>
      
    </div>
  );
};

export default LoginPage;