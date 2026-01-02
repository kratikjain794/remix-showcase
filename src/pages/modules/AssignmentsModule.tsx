import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const AssignmentsModule = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const assignments = [
    { id: 1, title: "Data Structures Lab 5", subject: "CS201", dueDate: "Jan 5, 2026", status: "pending", grade: null },
    { id: 2, title: "ML Algorithm Implementation", subject: "CS402", dueDate: "Jan 3, 2026", status: "submitted", grade: null },
    { id: 3, title: "Database Design Project", subject: "CS301", dueDate: "Dec 28, 2025", status: "graded", grade: "A" },
    { id: 4, title: "Research Paper Review", subject: "CS450", dueDate: "Dec 25, 2025", status: "graded", grade: "B+" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSelectedFile(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">Submit and track your assignments with AI-powered grading</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Submit Assignment */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-card border border-border p-6 mb-6">
                <h2 className="font-semibold text-xl mb-6">Submit Assignment</h2>
                
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    {selectedFile ? (
                      <div>
                        <p className="font-medium text-primary">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Drop files here or click to upload</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Button 
                      className="w-full bg-primary text-primary-foreground"
                      onClick={handleSubmit}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Submit Assignment"}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Assignment List */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="font-semibold text-xl mb-6">All Assignments</h2>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          assignment.status === "graded" ? "bg-green/20" :
                          assignment.status === "submitted" ? "bg-cyan/20" :
                          "bg-yellow/20"
                        }`}>
                          {assignment.status === "graded" ? (
                            <CheckCircle className="w-5 h-5 text-green" />
                          ) : assignment.status === "submitted" ? (
                            <Clock className="w-5 h-5 text-cyan" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subject} • Due: {assignment.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {assignment.grade && (
                          <span className="text-lg font-bold text-green">{assignment.grade}</span>
                        )}
                        <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                          assignment.status === "graded" ? "bg-green/20 text-green" :
                          assignment.status === "submitted" ? "bg-cyan/20 text-cyan" :
                          "bg-yellow/20 text-yellow"
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="font-bold text-green">14/16</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green rounded-full" style={{ width: "87.5%" }} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold text-cyan">A-</p>
                      <p className="text-xs text-muted-foreground">Average Grade</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-secondary/50">
                      <p className="text-2xl font-bold text-purple">2</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow/10 border border-yellow/20">
                    <Clock className="w-4 h-4 text-yellow" />
                    <div>
                      <p className="text-sm font-medium">ML Algorithm</p>
                      <p className="text-xs text-muted-foreground">Due tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data Structures Lab</p>
                      <p className="text-xs text-muted-foreground">Due in 3 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignmentsModule;