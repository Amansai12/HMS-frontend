import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, Upload, User, Printer, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";


interface OutPass {
  id: string;
  studentId: string;
  student : {
    name :string
    email : string
    collegeId : string
  }
  from: string;
  to: string;
  createdAt: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  letterUrl?: string;
  purpose?: string;
  caretaker: {
    name: string;
  };
}


// Format date time for display
const formatDateTime = (dateString : string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};


const OutPassTicket = ({ outpass }:{outpass : OutPass}) => {
  if (!outpass) return null;

  return (
    <div className="w-full max-w-md p-4 mx-auto bg-white border-0">
      <div className="border-4 border-dashed border-gray-300 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">OutPass Ticket</h2>
          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
            outpass.status === "APPROVED" ? "bg-green-500" : 
            outpass.status === "PENDING" ? "bg-yellow-500" : "bg-red-500"
          }`}>
            {outpass.status}
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">STUDENT ID</p>
            <p className="font-semibold">{outpass.student.collegeId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">OUTPASS ID</p>
            <p className="font-semibold">{outpass.id.substring(0, 8)}</p>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">FROM</p>
            <p className="font-semibold">{new Date(outpass.from).toLocaleDateString()}</p>
            <p className="text-sm">{new Date(outpass.from).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">TO</p>
            <p className="font-semibold">{new Date(outpass.to).toLocaleDateString()}</p>
            <p className="text-sm">{new Date(outpass.to).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">PURPOSE</p>
          <p className="font-semibold">{outpass.purpose}</p>
        </div>

        {outpass.caretaker && outpass.caretaker.name && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">CARETAKER</p>
            <p className="font-semibold">{outpass.caretaker.name}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-gray-600">DURATION</p>
          <p className="font-semibold">
            {Math.round(((new Date(outpass.to)).getTime() - (new Date(outpass.from)).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
          </p>
        </div>

        <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">ISSUED ON</p>
              <p className="font-semibold">{new Date(outpass.createdAt).toLocaleDateString()}</p>
            </div>
            {outpass.status === "APPROVED" && (
              <div className="text-green-500 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-1" />
                <span className="font-bold">APPROVED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OutPassPage() {
  const [studentId, setStudentId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [letter, setLetter] = useState<File | null>(null);
  const [reason, setReason] = useState("");
  const [outpasses, setOutpasses] = useState<OutPass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOutpass, setSelectedOutpass] = useState<OutPass | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [outpassType, setOutpassType] = useState("OUTING");
  
  // Function to handle file input change
  const handleFileChange = (e:any) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setLetter(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchOutpasses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/outpass`, {
          withCredentials: true
        });
        setOutpasses(res.data.outpasses);
      } catch (err) {
        console.error("Error fetching outpasses:", err);
      }
    };
    fetchOutpasses();
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!studentId || !fromDate || !toDate || !reason) {
      alert("Please fill all required fields");
      return;
    }
    
    if (fromDate > toDate) {
      alert("From date cannot be after To date");
      return;
    }

    setIsLoading(true);

    const formdata = new FormData();
    formdata.append("studentId", studentId);
    formdata.append("fromDate", fromDate);
    formdata.append("toDate", toDate);
    formdata.append("purpose", reason);
    formdata.append('type',outpassType)
    if (letter) {
      formdata.append("letter", letter);
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/user/outpass`, formdata, {
        withCredentials: true
      });
      
      // Add the new outpass to the top of the list
      setOutpasses([res.data.outpass, ...outpasses]);
      
      // Reset form
      setFromDate("");
      setToDate("");
      setLetter(null);
      setReason("");
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error submitting outpass:", err);
      alert("Failed to submit outpass request");
    } finally {
      setIsLoading(false);
    }
  };

  
  const showTicket = (outpass:OutPass) => {
    setSelectedOutpass(outpass);
    setTicketDialogOpen(true);
  };


  const handlePrint = () => {
    window.print();
  };

 

  
  const getStatusBadge = (status : string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" /> Approved</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Student OutPass Management</h1>
          <p className="text-gray-600">Request and view outpass applications</p>
        </div>
        
        {showSuccessMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <p className="font-medium text-green-700">OutPass request submitted successfully!</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - OutPass Request Form */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center text-blue-700">
                <FileText className="mr-2 h-6 w-6 text-blue-600" />
                OutPass Request Form
              </CardTitle>
              <CardDescription>Submit a new outpass request</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-gray-700">Student ID</Label>
                  <Input 
                    id="studentId" 
                    placeholder="Enter your student ID" 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate" className="text-gray-700">From Date & Time</Label>
                    <Input
                      id="fromDate"
                      type="datetime-local"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="toDate" className="text-gray-700">To Date & Time</Label>
                    <Input
                      id="toDate"
                      type="datetime-local"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-gray-700">Purpose of OutPass</Label>
                  <Input 
                    id="reason" 
                    placeholder="e.g., Family function, Medical appointment, etc." 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outpassType" className="text-gray-700">OutPass Type</Label>
                  <select 
                    id="outpassType" 
                    value={outpassType}
                    onChange={(e) => setOutpassType(e.target.value)}
                    className="border border-gray-300 rounded-md w-full px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="OUTING">OUTING</option>
                    <option value="LEAVE">LEAVE</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="letter" className="text-gray-700">Supporting Document (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor="letter" 
                      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="mr-2 h-4 w-4 text-gray-500" />
                     
                      {letter ? letter.name : "Upload letter/document"}
                    </Label>
                    <Input 
                      id="letter"
                      type="file" 
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 rounded-b-lg">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 font-medium" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : "Submit OutPass Request"}
              </Button>
            </CardFooter>
          </Card>

          {/* Right Side - OutPass History */}
          <Card className="shadow-lg border-t-4 border-t-purple-500">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center text-purple-700">
                <User className="mr-2 h-6 w-6 text-purple-600" />
                Your OutPass History
              </CardTitle>
              <CardDescription>View status of all your outpass requests</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 px-2">
              <ScrollArea className="h-96">
                {outpasses.length > 0 ? (
                  <div className="space-y-4">
                    {outpasses.map((outpass) => (
                      <Card key={outpass.id} className="border-l-4 hover:shadow-md transition-shadow" 
                        style={{ 
                          borderLeftColor: outpass.status === 'APPROVED' ? '#10B981' : 
                                          outpass.status === 'PENDING' ? '#F59E0B' : '#EF4444' 
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-wrap items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">
                                {outpass.purpose || "OutPass Request"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                ID: {outpass.id.substring(0, 8)}...
                              </p>
                            </div>
                            {getStatusBadge(outpass.status)}
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-gray-500 mr-1 mt-0.5" />
                              <div>
                                <p className="text-gray-500">From</p>
                                <p className="font-medium">{formatDateTime(outpass.from)}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 text-gray-500 mr-1 mt-0.5" />
                              <div>
                                <p className="text-gray-500">To</p>
                                <p className="font-medium">{formatDateTime(outpass.to)}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-500">Requested On</p>
                              <p className="font-medium">{formatDateTime(outpass.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Duration</p>
                              <p className="font-medium">
                                {Math.round(((new Date(outpass.to)).getTime() - (new Date(outpass.from)).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                              </p>
                            </div>
                          </div>

                          {/* Caretaker information */}
                          {outpass.caretaker && outpass.caretaker.name && (
                            <div className="mb-3">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 text-gray-500 mr-1" />
                                <p className="text-gray-500">Caretaker:</p>
                                <p className="font-medium ml-1">{outpass.caretaker.name}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Print/Download button */}
                          <div className="flex justify-end mt-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className={`flex items-center ${outpass.status === 'APPROVED' ? 'text-green-600 border-green-300 hover:bg-green-50' : 'text-gray-500'}`}
                              onClick={() => showTicket(outpass)}
                              disabled={outpass.status !== 'APPROVED'}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Print/Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center py-12">
                    <div className="space-y-2">
                      <div className="rounded-full bg-gray-100 p-3 inline-block">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No outpass records found</p>
                      <p className="text-sm text-gray-400">Submit a new outpass request to see it here</p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ticket Dialog */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>OutPass Ticket</DialogTitle>
          </DialogHeader>
          
          {selectedOutpass && (
            <div className="py-4">
              <OutPassTicket outpass={selectedOutpass} />
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}