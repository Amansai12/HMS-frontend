import { useState, useEffect } from 'react';
import { Camera, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import useUserStore from '@/lib/store';
import { BACKEND_URL } from '@/lib/config';

interface Room {
    id: string;
    name: string;
    hostelId: string;
}
interface Hostel {
    id: string;
    name: string;
    rooms: Room[];
}

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    hostelId: '',
    roomId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const setUser = useUserStore((state) => state.setUser)
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/hostel`);
        console.log('Hostels:', response.data);
        setHostels(response.data.hostels);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  // Fetch rooms when hostel selection changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!formData.hostelId) {
        setRooms([]);
        return;
      }
      
      try {
        const response = await axios.get(`${BACKEND_URL}/hostels/${formData.hostelId}/rooms`);
        setHostels(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHostelSelectChange = (value : string) => {
    setFormData((prev) => ({
      ...prev,
      hostelId: value,
    }));
    
    setRooms(hostels.find(hostel => hostel.id === value)?.rooms || []);
    setFilteredRooms(hostels.find(hostel => hostel.id === value)?.rooms || []);
    
    setFormData((prev) => ({
        ...prev,
        roomId: '',
    }));
    
  };
  const handleRoomSelectChange = (value : string) => {
    setFormData((prev) => ({
      ...prev,
      roomId: value,
    }));
    
  };

  const handleImageChange = (e : any) => {
    const file = e.target.files?.[0];
    if (file) {
        setProfileImage(file);
    }
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!profileImage) {
      setError('Please upload a profile image');
      return;
    }

    if (!formData.hostelId) {
      setError('Please select a hostel');
      return;
    }

    if (!formData.roomId) {
      setError('Please select a room');
      return;
    }

    const formdata = new FormData();
    formdata.append('name', formData.name);
    formdata.append('email', formData.email);
    formdata.append('studentId', formData.studentId);
    formdata.append('phone', formData.phone);
    formdata.append('address', formData.address);
    formdata.append('password', formData.password);
    formdata.append('hostelId', formData.hostelId);
    formdata.append('roomId', formData.roomId);
    formdata.append('profileImage', profileImage);

    try{
        setLoading(true);
        const response = await axios.post(`${BACKEND_URL}/user/student-signup`, formdata, {
            withCredentials: true,
        })
        console.log('Signup successful:', response.data);
        setUser(response.data.user)
        localStorage.setItem('role','STUDENT')
        setError('');
    } catch (error) {
        console.error('Error during signup:', error);
        setError('An error occurred during signup. Please try again.');
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full md:w-1/2 px-4 flex justify-center items-center max-w-[600px] mx-auto">
      <Card className="w-full border-none shadow-none">
        <CardHeader className="space-y-">
            <h1 className="text-blue-600 text-3xl font-bold text-center">Hostelio</h1>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        
        {error && (
          <Alert className="m-4 bg-red-50 text-red-700 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {profileImage ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <img 
                      src={URL.createObjectURL(profileImage)} 
                      alt="Profile preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0">
                  <Label 
                    htmlFor="picture" 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <Input 
                      id="picture" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Your Email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input 
                  id="studentId" 
                  name="studentId" 
                  placeholder="S12345" 
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="1234567890" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                name="address" 
                placeholder="Enter your full address" 
                value={formData.address}
                onChange={handleInputChange}
                className="min-h-20"
                required
              />
            </div>

            {/* Hostel and Room Selection */}
            <div className="flex gap-3 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="hostel">Hostel</Label>
                <Select 
                  value={formData.hostelId} 
                  onValueChange={(value) => handleHostelSelectChange(value)}
                  required
                >
                  <SelectTrigger className='w-full cursor-pointer' id="hostel">
                    <SelectValue placeholder="Select a hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels?.map((hostel) => (
                      <SelectItem className='cursor-pointer' key={hostel.id} value={hostel.id}>
                        {hostel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 w-full">
                <Label htmlFor="room">Room</Label>
                <Select 
                  value={formData.roomId} 
                  onValueChange={(value) => handleRoomSelectChange(value)}
                  disabled={!formData.hostelId}
                  required
                >
                  <SelectTrigger className='w-full cursor-pointer' id="room">
                    <SelectValue placeholder={formData.hostelId ? "Select a room" : "Select a hostel first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search rooms..."
                        className="mb-2"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const filteredRooms = rooms.filter(room => 
                            room.name.toLowerCase().includes(searchTerm)
                          );
                          setFilteredRooms(filteredRooms);
                        }}
                      />
                    </div>
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map((room) => (
                        <SelectItem className='cursor-pointer' key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-center text-sm text-gray-500 pb-3">
                        No rooms found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 mt-7">
            <Button type="submit" className="w-full">
              {loading ? <Loader2 className='animate-spin' /> : "Create Account"}
            </Button>
            <p className="text-sm text-center text-gray-500">
              Already have an account? <NavLink to={'/login'} className="text-primary font-medium hover:underline">Sign in</NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
      <div className="w-1/2 hidden md:block">
        <img src="/2383990.jpg" alt="Signup" className="h-full" />
      </div>
    </div>
  );
};

export default SignupPage;