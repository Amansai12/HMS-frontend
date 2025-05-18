import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Check,
  Home,
  Bed,
  Building,
  Users,
  Info,
  Loader2,
} from "lucide-react";
import { BACKEND_URL } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

interface Student {
  name: string;
  email: string;
}

interface Room {
  id: string;
  name: string;
  hostelId: string;
  students: Student[];
}

interface Hostel {
  id: string;
  name: string;
  rooms: Room[];
}

export default function HostelRoomManagement() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [hostelName, setHostelName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [hostelSuccess, setHostelSuccess] = useState(false);
  const [roomSuccess, setRoomSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentHostel, setCurrentHostel] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [validationErrors, _] = useState<{
    hostelName?: string;
    latitude?: string;
    longitude?: string;
  }>({});
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [roomLoading,setRoomLoading] = useState(false)
  const [hostelLoading,setHostelLoading] = useState(false)

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/hostel`);
        setHostels(res.data.hostels);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching hostels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    if (roomSearch) {
      const rooms = hostels.filter((hostel) => hostel.id === currentHostel)[0]
        .rooms.filter((room) =>
          room.name.toLowerCase().includes(roomSearch.toLowerCase())
        );
      setFilteredRooms(rooms);
    } 
  }, [roomSearch]);

  const handleAddHostel = async () => {
    if (hostelName.trim()) {
      try {
        setHostelLoading(true)
        await axios.post(`${BACKEND_URL}/hostel`,{
            name : hostelName,
            latitude,
            longitude
        },{
            withCredentials : true
        })
        const newHostel = {
          id: (hostels.length + 1).toString(),
          name: hostelName,
          rooms: [],
        };
        setHostels([...hostels, newHostel]);
        setHostelName("");
        setHostelSuccess(true);
        setTimeout(() => setHostelSuccess(false), 3000);
      } catch (err) {
        console.error("Error adding hostel:", err);
      }finally{
        setHostelLoading(false)
      }
    }
  };

  const handleAddRoom = async () => {
    if (roomName.trim() && selectedHostel && capacity) {
      try {
        setRoomLoading(true)
        await axios.post(`${BACKEND_URL}/hostel/room`,{
            name : roomName,
            hostelId : selectedHostel,
            capacity
        },{
            withCredentials : true
        })
        const updatedHostels = hostels.map((hostel) => {
          if (hostel.id === selectedHostel) {
            const newRoomId =
              hostel.rooms.length > 0
                ? (
                    parseInt(hostel.rooms[hostel.rooms.length - 1].id) + 1
                  ).toString()
                : (parseInt(hostel.id) * 100 + 1).toString();

            return {
              ...hostel,
              rooms: [
                ...hostel.rooms,
                {
                  id: newRoomId,
                  name: roomName,
                  hostelId: hostel.id,
                  students: [], 
                },
              ],
            };
          }
          return hostel;
        });

        setHostels(updatedHostels);
        setRoomName("");
        setCapacity("2");
        setSelectedHostel("");
        setRoomSuccess(true);
        setTimeout(() => setRoomSuccess(false), 3000);
      } catch (err) {
        console.error("Error adding room:", err);
      }finally{
        setRoomLoading(false)
      }
    }
  };

  const toggleHostel = (hostelId: string) => {
    setCurrentHostel(hostelId)
    const rooms = hostels.filter((hostel) => hostel.id === hostelId)[0].rooms.slice(0,3);
    setFilteredRooms(rooms);
  };


  const getTotalStudents = () => {
    return hostels.reduce((total, hostel) => {
      return (
        total +
        hostel.rooms.reduce((roomTotal, room) => {
          return roomTotal + (room.students ? room.students.length : 0);
        }, 0)
      );
    }, 0);
  };

  return (
    <div className="max-w-5xl w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Hostel Management System
      </h1>

      {/* Statistics Dashboard */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Hostels
                  </p>
                  <p className="text-2xl font-bold">{hostels.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Rooms
                  </p>
                  <p className="text-2xl font-bold">
                    {hostels.reduce(
                      (total, hostel) => total + hostel.rooms.length,
                      0
                    )}
                  </p>
                </div>
                <Bed className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Avg. Rooms/Hostel
                  </p>
                  <p className="text-2xl font-bold">
                    {hostels.length > 0
                      ? (
                          hostels.reduce(
                            (total, hostel) => total + hostel.rooms.length,
                            0
                          ) / hostels.length
                        ).toFixed(1)
                      : "0"}
                  </p>
                </div>
                <Home className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">{getTotalStudents()}</p>
                </div>
                <Users className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hostel Overview</CardTitle>
            <CardDescription>
              Click on a hostel to view its rooms, and on a room to view student
              details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading hostels data...</div>
              ) : hostels.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hostels added yet
                </div>
              ) : (
                hostels.map((hostel) => (
                  <>
                    <div key={hostel.id} className="border rounded-lg p-4">
                      {/* Hostel Header - Clickable */}

                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleHostel(hostel.id)}
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{hostel.name}</h3>
                        </div>
                        
                       <div className="flex items-center gap-2">
                       <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {hostel.rooms.length} Rooms
                        </span>
                        <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-black text-white hover:bg-gray-800 hover:text-white cursor-pointer">View</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{hostel.name}</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="">
                          <Input
                            id="roomName"
                            placeholder="Enter room name or number"
                            value={roomSearch}
                            onChange={(e) => setRoomSearch(e.target.value)}
                          />
                          <div className="mt-4 flex flex-col gap-4 overflow-y-auto">
                            {filteredRooms.length > 0 ? 
                            filteredRooms.map((room) => (
                                <div className="border rounded-md shadow-sm overflow-hidden bg-white text-xs">
      {/* Header */}
      <div className="bg-gray-600 text-white p-1 flex justify-between items-center">
        <h2 className="text-sm font-medium">{room.name}</h2>
        <span className="text-xs text-gray-300">Count: {room.students.length}</span>
      </div>
      
      {/* Content */}
      <div className="p-2">
        {room.students.length > 0 ? (
          <div className="space-y-1">
            {room.students.map((student) => (
              <div key={student.email} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded hover:bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                    {student.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-800 text-xs">{student.name}</span>
                </div>
                <span className="text-xs text-gray-500">{student.email}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2 bg-gray-50 rounded text-gray-500 text-center text-xs">
            No students present
          </div>
        )}
      </div>
    </div>
                            ))
                            : "No rooms found"}
                          </div>
                        </div>
                        
                      </DialogContent>
                    </Dialog>
                       </div>
                        
                      </div>
                    </div>
                    
                  </>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hostel Form */}
        <div>
        <Card className="h-full border-t-4 border-t-indigo-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-indigo-600" />
                    Add New Hostel
                  </CardTitle>
                  <CardDescription>
                    Create a new hostel in the system with location data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hostelName" className="flex items-center gap-1">
                        Hostel Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="hostelName"
                        placeholder="Enter hostel name"
                        value={hostelName}
                        onChange={(e) => setHostelName(e.target.value)}
                        className={validationErrors.hostelName ? "border-red-300" : ""}
                      />
                      {validationErrors.hostelName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.hostelName}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude" className="flex items-center gap-1">
                          Latitude
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Valid range: -90 to 90</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="latitude"
                          placeholder="e.g. 37.7749"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          className={validationErrors.latitude ? "border-red-300" : ""}
                        />
                        {validationErrors.latitude && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors.latitude}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="longitude" className="flex items-center gap-1">
                          Longitude
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Valid range: -180 to 180</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="longitude"
                          placeholder="e.g. -122.4194"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          className={validationErrors.longitude ? "border-red-300" : ""}
                        />
                        {validationErrors.longitude && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors.longitude}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleAddHostel} className="w-full bg-indigo-600 hover:bg-indigo-700">
                    {hostelLoading ? <Loader2 className="animate-spin" /> : "Add Hostel"}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  {hostelSuccess && (
                    <Alert className="w-full bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Hostel added successfully!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </Card>
        </div>

        {/* Room Form */}
        <div>
        <Card className="h-full border-t-4 border-t-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-green-600" />
                    Add New Room
                  </CardTitle>
                  <CardDescription>
                    Add a room to an existing hostel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomName" className="flex items-center gap-1">
                        Room Name/Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="roomName"
                        placeholder="Enter room name or number"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="flex items-center gap-1">
                        Number of Students <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        placeholder="Enter room capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hostelSelect" className="flex items-center gap-1">
                        Select Hostel <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedHostel}
                        onValueChange={setSelectedHostel}
                      >
                        <SelectTrigger id="hostelSelect">
                          <SelectValue placeholder="Select a hostel" />
                        </SelectTrigger>
                        <SelectContent>
                          {hostels.length === 0 ? (
                            <SelectItem value="none" disabled>No hostels available</SelectItem>
                          ) : (
                            hostels.map((hostel) => (
                              <SelectItem key={hostel.id} value={hostel.id}>
                                {hostel.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={handleAddRoom} className="w-full bg-green-600 hover:bg-green-700" disabled={hostels.length === 0}>
                      {roomLoading ? <Loader2 className="animate-spin" /> : "Add Room"}
                    </Button>
                    {hostels.length === 0 && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center">
                        <Info className="h-3 w-3 mr-1" /> Add a hostel first before creating rooms
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {roomSuccess && (
                    <Alert className="w-full bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Room added successfully!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </Card>
        </div>
      </div>
    </div>
  );
}
