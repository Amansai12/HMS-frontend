import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Loader2, Info, Mail, Home, School, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { BACKEND_URL } from "@/lib/config"

interface Student {
  id: string
  collegeId: string
  name: string
  email: string 
  address: string
  image: string
  room: {
    name: string
    hostel: Hostel
  }
}

interface Hostel {
  name: string,
  id: string
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${BACKEND_URL}/user/student?page=${page}&search=${searchQuery}`);
        setStudents(res.data.students)
        setHasNextPage(res.data.pagination.nextPage ? true : false)
        setHasPreviousPage(res.data.pagination.prevPage ? true : false)
        setTotalPages(res.data.pagination.totalPages)
      } catch (err) {
        console.error("Failed to fetch students:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStudents()
  }, [searchQuery, page])
  
  const goToNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1)
    }
  }
  
  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setPage(page - 1)
    }
  }

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student)
    setDialogOpen(true)
  }

  return (
    <Card className="w-full rounded-md border shadow-sm bg-white dark:bg-gray-950">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <School className="h-6 w-6 text-blue-600 dark:text-blue-400" /> 
          Student Directory
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Manage student records and hostel assignments
        </CardDescription>
        
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, ID or email..."
              className="pl-8 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1) 
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="border rounded-md flex flex-col">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900">
                    <TableHead className="font-semibold">Profile</TableHead>
                    <TableHead className="font-semibold">Student ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Room</TableHead>
                    <TableHead className="font-semibold">Hostel</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <TableRow 
                        key={student.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <TableCell>
                          <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                            <AvatarImage src={student.image} alt={student.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium border-blue-200 dark:border-blue-800">
                            {student.collegeId}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{student.email}</TableCell>
                        <TableCell>{student.room.name}</TableCell>
                        <TableCell>{student.room.hostel.name}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewStudentDetails(student)}
                            className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300 cursor-pointer"
                          >
                            <Info className="h-4 w-4 mr-1" /> Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        No students found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 dark:bg-gray-900 rounded-b-md">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing page {page} of {totalPages || 1}
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPreviousPage} 
                  disabled={!hasPreviousPage}
                  className="cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {page}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextPage} 
                  disabled={!hasNextPage}
                  className="cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Student Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Student Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected student
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-4 pb-5 border-b">
                <Avatar className="h-24 w-24 border-2 border-blue-200 dark:border-blue-800">
                  <AvatarImage src={selectedStudent.image} alt={selectedStudent.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-lg">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    ID: {selectedStudent.collegeId}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="text-gray-900 dark:text-gray-100">{selectedStudent.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hostel Information</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedStudent.room.hostel.name}, Room {selectedStudent.room.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Permanent Address</p>
                    <p className="text-gray-900 dark:text-gray-100">{selectedStudent.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-end">
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}