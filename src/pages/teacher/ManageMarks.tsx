import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Award, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type StudentMark = {
  id: string;
  student_id: string;
  subject: string;
  exam_type: string;
  marks_obtained: number;
  total_marks: number;
  remarks: string | null;
  created_at: string;
  students: { full_name: string; student_id: string } | null;
};

type Student = {
  id: string;
  student_id: string;
  full_name: string;
};

const ManageMarks = () => {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<StudentMark | null>(null);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [markForm, setMarkForm] = useState({
    student_id: "",
    subject: "",
    exam_type: "",
    marks_obtained: 0,
    total_marks: 100,
    remarks: "",
  });

  useEffect(() => {
    if (!authLoading && !hasRole("teacher") && !hasRole("admin")) {
      navigate("/dashboard");
      return;
    }
    if (!authLoading && user) {
      fetchTeacherId();
      fetchStudents();
    }
  }, [authLoading, hasRole, user, navigate]);

  const fetchTeacherId = async () => {
    if (!user) return;
    const { data } = await supabase.from("teachers").select("id").eq("user_id", user.id).maybeSingle();
    if (data) {
      setTeacherId(data.id);
      fetchMarks(data.id);
    } else {
      setLoading(false);
      toast({ title: "Not linked", description: "Your account is not linked to a teacher profile", variant: "destructive" });
    }
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("id, student_id, full_name").order("full_name");
    if (!error && data) setStudents(data);
  };

  const fetchMarks = async (tId: string) => {
    const { data, error } = await supabase
      .from("student_marks")
      .select("*, students(full_name, student_id)")
      .eq("teacher_id", tId)
      .order("created_at", { ascending: false });
    if (!error && data) setMarks(data);
    setLoading(false);
  };

  const handleSaveMark = async () => {
    if (!markForm.student_id || !markForm.subject || !markForm.exam_type || !teacherId) {
      toast({ title: "Error", description: "Student, subject, and exam type are required", variant: "destructive" });
      return;
    }

    const markData = {
      student_id: markForm.student_id,
      teacher_id: teacherId,
      subject: markForm.subject,
      exam_type: markForm.exam_type,
      marks_obtained: markForm.marks_obtained,
      total_marks: markForm.total_marks,
      remarks: markForm.remarks || null,
    };

    if (editingMark) {
      const { error } = await supabase.from("student_marks").update(markData).eq("id", editingMark.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Marks updated successfully" });
        fetchMarks(teacherId);
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("student_marks").insert(markData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Marks added successfully" });
        fetchMarks(teacherId);
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDeleteMark = async (id: string) => {
    const { error } = await supabase.from("student_marks").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Marks deleted successfully" });
      if (teacherId) fetchMarks(teacherId);
    }
  };

  const openEditMark = (mark: StudentMark) => {
    setEditingMark(mark);
    setMarkForm({
      student_id: mark.student_id,
      subject: mark.subject,
      exam_type: mark.exam_type,
      marks_obtained: mark.marks_obtained,
      total_marks: mark.total_marks,
      remarks: mark.remarks || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMark(null);
    setMarkForm({ student_id: "", subject: "", exam_type: "", marks_obtained: 0, total_marks: 100, remarks: "" });
  };

  const filteredMarks = marks.filter(
    (m) =>
      m.students?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.exam_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPercentage = (obtained: number, total: number) => {
    return ((obtained / total) * 100).toFixed(1);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-400" };
    if (percentage >= 80) return { grade: "A", color: "text-green-400" };
    if (percentage >= 70) return { grade: "B+", color: "text-blue-400" };
    if (percentage >= 60) return { grade: "B", color: "text-blue-400" };
    if (percentage >= 50) return { grade: "C", color: "text-yellow-400" };
    if (percentage >= 40) return { grade: "D", color: "text-orange-400" };
    return { grade: "F", color: "text-red-400" };
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Manage Marks</h1>
                  <p className="text-muted-foreground">Add and manage student marks and grades</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Marks
              </Button>
            </div>

            <div className="glass-card p-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student, subject, or exam type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No marks recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMarks.map((mark) => {
                        const pct = parseFloat(getPercentage(mark.marks_obtained, mark.total_marks));
                        const { grade, color } = getGrade(pct);
                        return (
                          <TableRow key={mark.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{mark.students?.full_name}</p>
                                <p className="text-xs text-muted-foreground">{mark.students?.student_id}</p>
                              </div>
                            </TableCell>
                            <TableCell>{mark.subject}</TableCell>
                            <TableCell>{mark.exam_type}</TableCell>
                            <TableCell>
                              {mark.marks_obtained} / {mark.total_marks}
                            </TableCell>
                            <TableCell>{pct}%</TableCell>
                            <TableCell className={`font-bold ${color}`}>{grade}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => openEditMark(mark)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteMark(mark.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMark ? "Edit Marks" : "Add Marks"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student *</Label>
              <Select value={markForm.student_id} onValueChange={(v) => setMarkForm({ ...markForm, student_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name} ({s.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={markForm.subject}
                  onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label>Exam Type *</Label>
                <Input
                  value={markForm.exam_type}
                  onChange={(e) => setMarkForm({ ...markForm, exam_type: e.target.value })}
                  placeholder="Mid-term"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marks Obtained</Label>
                <Input
                  type="number"
                  value={markForm.marks_obtained}
                  onChange={(e) => setMarkForm({ ...markForm, marks_obtained: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={markForm.total_marks}
                  onChange={(e) => setMarkForm({ ...markForm, total_marks: parseFloat(e.target.value) || 100 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea
                value={markForm.remarks}
                onChange={(e) => setMarkForm({ ...markForm, remarks: e.target.value })}
                placeholder="Optional remarks..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMark}>{editingMark ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMarks;
