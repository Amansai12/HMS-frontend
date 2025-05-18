import { useEffect, useState } from "react";
import { Camera, Upload } from "lucide-react";

// Import shadcn/ui components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
interface Hostel {
    id: string;
    name: string;
}
export default function CaretakerRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hostelId: "",
    password: "",
    role: "",
  });
  
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading,setLoading] = useState(false)
  const [hostels, setHostels] = useState<Hostel[]>([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/hostel');
        console.log('Hostels:', response.data);
        setHostels(response.data.hostels);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

//   // Sample hostel data (would come from API in real application)
//   const hostels = [
//     { id: "1", name: "Maple Residence" },
//     { id: "2", name: "Pine Hall" },
//     { id: "3", name: "Oak Suites" },
//     { id: "4", name: "Cedar Lodge" },
//   ];

  const handleInputChange = (e : any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHostelChange = (value : string) => {
    setFormData(prev => ({ ...prev, hostelId: value }));
  };
  
  const handleRoleChange = (value : string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleImageChange = (e : any) => {
    const file = e.target.files[0];
    if (file) {
        setImagePreview(file)
    }
  };

  const handleSubmit = async (e:any) => {
    if (e) e.preventDefault();
   

    const formdata = new FormData();
    formdata.append('name', formData.name);
    formdata.append('email', formData.email);
    formdata.append('phone', formData.phone);
    formdata.append('password', formData.password);
    formdata.append('hostelId', formData.hostelId);
    if (imagePreview) {
      formdata.append('profileImage', imagePreview);
    }
    formdata.append('role',formData.role)

    try{
        setLoading(true)
        await axios.post(`${BACKEND_URL}/user/caretaker-signup`,formdata,{
            withCredentials : true
        })
        setSuccess(true)
    }catch(err){

    }finally{
        setLoading(false)
    }
    
    
    
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Add New Staff</CardTitle>
          <CardDescription className="text-center">
            Enter details to register a new staff member
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Staff member has been added successfully.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                {imagePreview ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200">
                    <img 
                      src={URL.createObjectURL(imagePreview)} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                
                <label 
                  htmlFor="profile-image" 
                  className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <Label htmlFor="profile-image" className="text-sm text-slate-500">
                Upload Profile Image
              </Label>
            </div>
            
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="focus-visible:ring-primary"
              />
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="focus-visible:ring-primary"
              />
            </div>
            
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="focus-visible:ring-primary"
              />
            </div>
            
            {/* Hostel Select */}
            <div className="space-y-2">
              <Label htmlFor="hostel">Assigned Hostel</Label>
              <Select 
                onValueChange={handleHostelChange}
                value={formData.hostelId}
              >
                <SelectTrigger id="hostel" className="focus:ring-primary">
                  <SelectValue placeholder="Select a hostel" />
                </SelectTrigger>
                <SelectContent>
                  {hostels.map(hostel => (
                    <SelectItem key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Role Select */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                onValueChange={handleRoleChange}
                value={formData.role}
              >
                <SelectTrigger id="role" className="focus:ring-primary">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="CARETAKER">CARETAKER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="focus-visible:ring-primary"
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Staff Member"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}