import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { formatDateTime } from "@/lib/utils";
import { format } from "date-fns";
import StudentExport from "./StudentExport";

interface Attendance {
    id: string;
    student: Student;
    checkInAt: string;
    checkOutAt: string;
    type: string;
}

interface Student {
  id: string;
  collegeId: string;
  name: string;
  email: string;
  address: string;
  image: string;
  room: {
    name: string;
    hostel: Hostel;
  };
}

interface Hostel {
  name: string;
  id: string;
}

const types = ['INCAMPUS', 'LEAVE', 'OUTING'];

export default function GetAttendance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState(types[0]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [total,setTotal] = useState(0)

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        
        // Build URL with parameters
        let url = `${BACKEND_URL}/attendance?page=${page}&search=${searchQuery}&type=${typeFilter}`;
        
        // Add date filters if they exist
        if (fromDate) {
          url += `&fromDate=${format(fromDate, 'yyyy-MM-dd')}`;
        }
        
        if (toDate) {
          url += `&toDate=${format(toDate, 'yyyy-MM-dd')}`;
        }
        
        const res = await axios.get(url, {
          withCredentials: true,
        });
        
        setAttendances(res.data.attendances);
        setHasNextPage(res.data.pagination.nextPage ? true : false);
        setHasPreviousPage(res.data.pagination.prevPage ? true : false);
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total)
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendances();
  }, [searchQuery, page, typeFilter, fromDate, toDate]);

  const goToNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const resetFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setTypeFilter(types[0]);
    setSearchQuery("");
    setPage(1);
  }

  return (
    <Card className="w-full rounded-sm border bg-white dark:bg-gray-950 p-2 px-0 md:p-4">
      <CardHeader>
       <div className="flex-col md:flex-row flex w-full justify-between">
       <div>
        <CardTitle className="text-2xl font-bold text-center md:text-left">Attendance History</CardTitle>
        <CardDescription className="text-center md:text-left">
          Manage and search for student attendance information
        </CardDescription>
        </div>
        <StudentExport />
       </div>

        <div className="space-y-4 mt-4">
          {/* General search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, ID or email..."
              className="pl-8 bg-white dark:bg-gray-950"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Advanced filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/4">
              <Select 
                value={typeFilter} 
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Attendance Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* From Date Selector */}
            <div className="w-full sm:w-1/4">
            <label htmlFor="">From date : </label>
            <input type="datetime-local" onChange={(e) => setFromDate(new Date(e.target.value))} />
            </div>
            
            {/* To Date Selector */}
            <div className="w-full sm:w-1/4">
            <label htmlFor="">To date : </label>
            <input type="datetime-local" onChange={(e) => setToDate(new Date(e.target.value))} />
            </div>
            
            {/* Reset Filters Button */}
            <div className="w-full sm:w-1/4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="border rounded-md flex flex-col justify-center items-center overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">Image</TableHead>
                    <TableHead className="font-semibold">Student ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Room No</TableHead>
                    <TableHead className="font-semibold">Checkout</TableHead>
                    <TableHead className="font-semibold">CheckIn</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.length > 0 ? (
                    attendances.map((att) => (
                      <TableRow key={att.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={att.student.image} alt={att.student.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs">
                              {att.student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {att.student.collegeId}
                        </TableCell>
                        <TableCell>{att.student.name}</TableCell>
                        <TableCell>{att.student.email}</TableCell>
                        <TableCell>{att.student.room.name}</TableCell>
                        <TableCell>{formatDateTime(att.checkOutAt)}</TableCell>
                        <TableCell>
                          {att.checkInAt ? (
                            formatDateTime(att.checkInAt)
                          ) : (
                            <span className="font-bold text-amber-600 dark:text-amber-500">
                              Not checked In
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            att.type === 'INCAMPUS' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : att.type === 'LEAVE' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          }`}>
                            {att.type}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between w-full px-4 py-4 border-t">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {attendances.length} of {total} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={!hasPreviousPage}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  
                </Button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={!hasNextPage}
                  className="cursor-pointer"
                >
                  
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}