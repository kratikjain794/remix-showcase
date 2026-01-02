import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Users, GraduationCap, UserCog, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Teacher = {
  id: string;
  teacher_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  subjects: string[] | null;
  qualification: string | null;
};

type Student = {
  id: string;
  student_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  class: string | null;
  section: string | null;
  parent_name: string | null;
  parent_phone: string | null;
};

const ManageUsers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [teacherForm, setTeacherForm] = useState({
    teacher_id: "",
    full_name: "",
    email: "",
    phone: "",
    department: "",
    subjects: "",
    qualification: "",
  });

  const [studentForm, setStudentForm] = useState({
    student_id: "",
    full_name: "",
    email: "",
    phone: "",
    class: "",
    section: "",
    parent_name: "",
    parent_phone: "",
  });

  useEffect(() => {
    if (!authLoading && !hasRole("admin")) {
      navigate("/dashboard");
      return;
    }
    if (!authLoading) {
      fetchTeachers();
      fetchStudents();
    }
  }, [authLoading, hasRole, navigate]);

  const fetchTeachers = async () => {
    const { data, error } = await supabase.from("teachers").select("*").order("full_name");
    if (!error && data) setTeachers(data);
    setLoading(false);
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*").order("full_name");
    if (!error && data) setStudents(data);
  };

  const handleSaveTeacher = async () => {
    if (!teacherForm.teacher_id || !teacherForm.full_name) {
      toast({ title: "Error", description: "Teacher ID and name are required", variant: "destructive" });
      return;
    }

    const teacherData = {
      teacher_id: teacherForm.teacher_id,
      full_name: teacherForm.full_name,
      email: teacherForm.email || null,
      phone: teacherForm.phone || null,
      department: teacherForm.department || null,
      subjects: teacherForm.subjects ? teacherForm.subjects.split(",").map((s) => s.trim()) : null,
      qualification: teacherForm.qualification || null,
    };

    if (editingTeacher) {
      const { error } = await supabase.from("teachers").update(teacherData).eq("id", editingTeacher.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Teacher updated successfully" });
        fetchTeachers();
        setIsTeacherDialogOpen(false);
        resetTeacherForm();
      }
    } else {
      const { error } = await supabase.from("teachers").insert(teacherData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Teacher added successfully" });
        fetchTeachers();
        setIsTeacherDialogOpen(false);
        resetTeacherForm();
      }
    }
  };

  const handleSaveStudent = async () => {
    if (!studentForm.student_id || !studentForm.full_name) {
      toast({ title: "Error", description: "Student ID and name are required", variant: "destructive" });
      return;
    }

    const studentData = {
      student_id: studentForm.student_id,
      full_name: studentForm.full_name,
      email: studentForm.email || null,
      phone: studentForm.phone || null,
      class: studentForm.class || null,
      section: studentForm.section || null,
      parent_name: studentForm.parent_name || null,
      parent_phone: studentForm.parent_phone || null,
    };

    if (editingStudent) {
      const { error } = await supabase.from("students").update(studentData).eq("id", editingStudent.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Student updated successfully" });
        fetchStudents();
        setIsStudentDialogOpen(false);
        resetStudentForm();
      }
    } else {
      const { error } = await supabase.from("students").insert(studentData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Student added successfully" });
        fetchStudents();
        setIsStudentDialogOpen(false);
        resetStudentForm();
      }
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Teacher deleted successfully" });
      fetchTeachers();
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Student deleted successfully" });
      fetchStudents();
    }
  };

  const openEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      teacher_id: teacher.teacher_id,
      full_name: teacher.full_name,
      email: teacher.email || "",
      phone: teacher.phone || "",
      department: teacher.department || "",
      subjects: teacher.subjects?.join(", ") || "",
      qualification: teacher.qualification || "",
    });
    setIsTeacherDialogOpen(true);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentForm({
      student_id: student.student_id,
      full_name: student.full_name,
      email: student.email || "",
      phone: student.phone || "",
      class: student.class || "",
      section: student.section || "",
      parent_name: student.parent_name || "",
      parent_phone: student.parent_phone || "",
    });
    setIsStudentDialogOpen(true);
  };

  const resetTeacherForm = () => {
    setEditingTeacher(null);
    setTeacherForm({ teacher_id: "", full_name: "", email: "", phone: "", department: "", subjects: "", qualification: "" });
  };

  const resetStudentForm = () => {
    setEditingStudent(null);
    setStudentForm({ student_id: "", full_name: "", email: "", phone: "", class: "", section: "", parent_name: "", parent_phone: "" });
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacher_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <UserCog className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold">Manage Users</h1>
                <p className="text-muted-foreground">Add, edit, or remove teachers and students</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Tabs defaultValue="teachers">
                <TabsList className="mb-4">
                  <TabsTrigger value="teachers" className="gap-2">
                    <Users className="w-4 h-4" />
                    Teachers ({teachers.length})
                  </TabsTrigger>
                  <TabsTrigger value="students" className="gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Students ({students.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="teachers">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => {
                        resetTeacherForm();
                        setIsTeacherDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Teacher
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Subjects</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTeachers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No teachers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTeachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                              <TableCell className="font-mono text-sm">{teacher.teacher_id}</TableCell>
                              <TableCell className="font-medium">{teacher.full_name}</TableCell>
                              <TableCell>{teacher.email || "-"}</TableCell>
                              <TableCell>{teacher.department || "-"}</TableCell>
                              <TableCell>{teacher.subjects?.join(", ") || "-"}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => openEditTeacher(teacher)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTeacher(teacher.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="students">
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => {
                        resetStudentForm();
                        setIsStudentDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No students found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                              <TableCell className="font-medium">{student.full_name}</TableCell>
                              <TableCell>{student.email || "-"}</TableCell>
                              <TableCell>{student.class || "-"}</TableCell>
                              <TableCell>{student.section || "-"}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => openEditStudent(student)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Teacher Dialog */}
      <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teacher ID *</Label>
                <Input
                  value={teacherForm.teacher_id}
                  onChange={(e) => setTeacherForm({ ...teacherForm, teacher_id: e.target.value })}
                  placeholder="TCH001"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={teacherForm.full_name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  placeholder="john@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={teacherForm.department}
                  onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label>Qualification</Label>
                <Input
                  value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                  placeholder="M.Sc., B.Ed."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects (comma separated)</Label>
              <Input
                value={teacherForm.subjects}
                onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                placeholder="Math, Physics, Chemistry"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeacherDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeacher}>{editingTeacher ? "Update" : "Add"} Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Dialog */}
      <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Add Student"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Student ID *</Label>
                <Input
                  value={studentForm.student_id}
                  onChange={(e) => setStudentForm({ ...studentForm, student_id: e.target.value })}
                  placeholder="STU001"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={studentForm.full_name}
                  onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="jane@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Input
                  value={studentForm.class}
                  onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input
                  value={studentForm.section}
                  onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                  placeholder="A"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Parent Name</Label>
                <Input
                  value={studentForm.parent_name}
                  onChange={(e) => setStudentForm({ ...studentForm, parent_name: e.target.value })}
                  placeholder="Robert Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Phone</Label>
                <Input
                  value={studentForm.parent_phone}
                  onChange={(e) => setStudentForm({ ...studentForm, parent_phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStudentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStudent}>{editingStudent ? "Update" : "Add"} Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
