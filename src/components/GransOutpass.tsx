import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, Download, Check, X } from "lucide-react";
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface Outpass {
    id: string;
    student: Student;
    from: string;
    to: string;
    status: string;
    letter: string; // Added letter attribute
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

const types = ['PENDING', 'APPROVED', 'REJECTED'];

export default function GrantOutpass() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState(types[0]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [outpasses, setOutpasses] = useState<Outpass[]>([]);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [total, setTotal] = useState(0);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        
        // Build URL with parameters
        let url = `${BACKEND_URL}/user/grant-outpass?page=${page}&search=${searchQuery}&type=${typeFilter}`;
        
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
        
        setOutpasses(res.data.outpasses);
        setHasNextPage(res.data.pagination.nextPage ? true : false);
        setHasPreviousPage(res.data.pagination.prevPage ? true : false);
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total);
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
  };

  const handleApproveReject = async (outpassId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setProcessingIds(prev => new Set(prev).add(outpassId));
      
      await axios.post(`${BACKEND_URL}/user/grant-outpass`, {
        decision : status,
        outpassId
      }, {
        withCredentials: true
      });
      
      
      setOutpasses(prevOutpasses => 
        prevOutpasses.map(outpass => 
          outpass.id === outpassId ? { ...outpass, status } : outpass
        )
      );
    } catch (error) {
      console.error("Failed to update outpass status:", error);
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(outpassId);
        return updated;
      });
    }
  };

  const downloadLetter = (letter: string, studentName: string) => {
    if (!letter) {
    //   toast({
    //     title: "Download Failed",
    //     description: "No letter available for this outpass",
    //     variant: "destructive",
    //   });
      return;
    }
    
    const link = document.createElement('a');
    link.href = letter;
    link.download = `outpass_letter_${studentName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full rounded-sm border bg-white dark:bg-gray-950 p-2 px-0 md:p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Outpasses</CardTitle>
        <CardDescription>
          Manage and search for student outpass information
        </CardDescription>

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
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* From Date Selector - Improved alignment */}
            <div className="w-full sm:w-1/4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  From date:
                </label>
                <Input 
                  type="datetime-local" 
                  onChange={(e) => setFromDate(new Date(e.target.value))} 
                  className="w-full"
                />
              </div>
            </div>
            
            {/* To Date Selector - Improved alignment */}
            <div className="w-full sm:w-1/4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  To date:
                </label>
                <Input 
                  type="datetime-local" 
                  onChange={(e) => setToDate(new Date(e.target.value))} 
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Reset Filters Button */}
            <div className="w-full sm:w-1/4 flex items-end">
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
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Letter</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outpasses.length > 0 ? (
                    outpasses.map((outpass) => (
                      <TableRow key={outpass.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={outpass.student.image} alt={outpass.student.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs">
                              {outpass.student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          {outpass.student.collegeId}
                        </TableCell>
                        <TableCell>{outpass.student.name}</TableCell>
                        <TableCell>{outpass.student.email}</TableCell>
                        <TableCell>{outpass.student.room.name}</TableCell>
                        <TableCell>{formatDateTime(outpass.from)}</TableCell>
                        <TableCell>
                          {outpass.to ? (
                            formatDateTime(outpass.to)
                          ) : (
                            <span className="font-bold text-amber-600 dark:text-amber-500">
                              Not checked In
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            outpass.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : outpass.status === 'PENDING' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          }`}>
                            {outpass.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => downloadLetter(outpass.letter, outpass.student.name)}
                                  disabled={!outpass.letter}
                                >
                                  <Download className={`h-5 w-5 ${!outpass.letter ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{outpass.letter ? 'Download letter' : 'No letter available'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {outpass.status == 'PENDING' && <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40"
                                    onClick={() => handleApproveReject(outpass.id, 'APPROVED')}
                                    disabled={outpass.status !== 'PENDING' || processingIds.has(outpass.id)}
                                  >
                                    {processingIds.has(outpass.id) ? 
                                      <Loader2 className="h-4 w-4 animate-spin text-green-600 dark:text-green-400" /> : 
                                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    }
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Approve outpass</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                                    onClick={() => handleApproveReject(outpass.id, 'REJECTED')}
                                    disabled={outpass.status !== 'PENDING' || processingIds.has(outpass.id)}
                                  >
                                    {processingIds.has(outpass.id) ? 
                                      <Loader2 className="h-4 w-4 animate-spin text-red-600 dark:text-red-400" /> : 
                                      <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    }
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Reject outpass</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        No outpass records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between w-full px-4 py-4 border-t">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {outpasses.length} of {total} entries
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