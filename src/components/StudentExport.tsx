import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

const StudentExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState("");

  const downloadFile = async () => {
    try {
      setLoading(true);
      setError("");

      // Make API request to download endpoint
      const response = await axios.get(
        `${BACKEND_URL}/attendance/export/${format}`,
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/pdf",
      });

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        format === "csv" ? "students.csv" : "students.pdf"
      );
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setLoading(false);
    } catch (err) {
      setError("Failed to download file. Please try again.");
      setLoading(false);
      console.error("Download error:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Select
          value={format}
          onValueChange={(value) => {
            setFormat(value);
          }}
        >
          <SelectTrigger className="w-32 bg-white border border-gray-300">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={downloadFile}
          disabled={loading || !format}
          className=" hover:bg-gray-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Download
        </Button>
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default StudentExport;