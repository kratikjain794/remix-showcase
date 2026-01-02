import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, FileText, BookOpen, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Quiz = {
  id: string;
  title: string;
  subject: string;
  class: string | null;
  description: string | null;
  duration_minutes: number;
  total_marks: number;
  is_published: boolean;
  created_at: string;
};

type Question = {
  id?: string;
  question: string;
  options: string[];
  correct_option: number;
  marks: number;
  order_index: number;
};

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuestionsDialogOpen, setIsQuestionsDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [quizForm, setQuizForm] = useState({
    title: "",
    subject: "",
    class: "",
    description: "",
    duration_minutes: 30,
    total_marks: 100,
  });

  useEffect(() => {
    if (!authLoading && !hasRole("teacher") && !hasRole("admin")) {
      navigate("/dashboard");
      return;
    }
    if (!authLoading && user) {
      fetchTeacherId();
    }
  }, [authLoading, hasRole, user, navigate]);

  const fetchTeacherId = async () => {
    if (!user) return;
    const { data } = await supabase.from("teachers").select("id").eq("user_id", user.id).maybeSingle();
    if (data) {
      setTeacherId(data.id);
      fetchQuizzes(data.id);
    } else {
      setLoading(false);
      toast({ title: "Not linked", description: "Your account is not linked to a teacher profile", variant: "destructive" });
    }
  };

  const fetchQuizzes = async (tId: string) => {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("teacher_id", tId)
      .order("created_at", { ascending: false });
    if (!error && data) setQuizzes(data);
    setLoading(false);
  };

  const fetchQuestions = async (quizId: string) => {
    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index");
    if (!error && data) {
      setQuestions(
        data.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options as string[],
          correct_option: q.correct_option,
          marks: q.marks || 1,
          order_index: q.order_index || 0,
        }))
      );
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizForm.title || !quizForm.subject || !teacherId) {
      toast({ title: "Error", description: "Title and subject are required", variant: "destructive" });
      return;
    }

    const quizData = {
      teacher_id: teacherId,
      title: quizForm.title,
      subject: quizForm.subject,
      class: quizForm.class || null,
      description: quizForm.description || null,
      duration_minutes: quizForm.duration_minutes,
      total_marks: quizForm.total_marks,
    };

    if (editingQuiz) {
      const { error } = await supabase.from("quizzes").update(quizData).eq("id", editingQuiz.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Quiz updated successfully" });
        fetchQuizzes(teacherId);
        setIsQuizDialogOpen(false);
        resetQuizForm();
      }
    } else {
      const { error } = await supabase.from("quizzes").insert(quizData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Quiz created successfully" });
        fetchQuizzes(teacherId);
        setIsQuizDialogOpen(false);
        resetQuizForm();
      }
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Quiz deleted successfully" });
      if (teacherId) fetchQuizzes(teacherId);
    }
  };

  const togglePublish = async (quiz: Quiz) => {
    const { error } = await supabase.from("quizzes").update({ is_published: !quiz.is_published }).eq("id", quiz.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      if (teacherId) fetchQuizzes(teacherId);
    }
  };

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      subject: quiz.subject,
      class: quiz.class || "",
      description: quiz.description || "",
      duration_minutes: quiz.duration_minutes,
      total_marks: quiz.total_marks,
    });
    setIsQuizDialogOpen(true);
  };

  const openQuestions = async (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    await fetchQuestions(quiz.id);
    setIsQuestionsDialogOpen(true);
  };

  const resetQuizForm = () => {
    setEditingQuiz(null);
    setQuizForm({ title: "", subject: "", class: "", description: "", duration_minutes: 30, total_marks: 100 });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct_option: 0, marks: 1, order_index: questions.length },
    ]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveQuestions = async () => {
    if (!selectedQuiz) return;

    // Delete existing questions
    await supabase.from("quiz_questions").delete().eq("quiz_id", selectedQuiz.id);

    // Insert new questions
    const questionsData = questions.map((q, i) => ({
      quiz_id: selectedQuiz.id,
      question: q.question,
      options: q.options,
      correct_option: q.correct_option,
      marks: q.marks,
      order_index: i,
    }));

    const { error } = await supabase.from("quiz_questions").insert(questionsData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Questions saved successfully" });
      setIsQuestionsDialogOpen(false);
    }
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
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Manage Quizzes</h1>
                  <p className="text-muted-foreground">Create and manage quizzes for your students</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  resetQuizForm();
                  setIsQuizDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            </div>

            <div className="glass-card p-6">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No quizzes created yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      quizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">{quiz.title}</TableCell>
                          <TableCell>{quiz.subject}</TableCell>
                          <TableCell>{quiz.class || "-"}</TableCell>
                          <TableCell>{quiz.duration_minutes} min</TableCell>
                          <TableCell>{quiz.total_marks}</TableCell>
                          <TableCell>
                            <Switch checked={quiz.is_published} onCheckedChange={() => togglePublish(quiz)} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openQuestions(quiz)}>
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditQuiz(quiz)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="Mathematics Chapter 5 Quiz"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={quizForm.subject}
                  onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Input
                  value={quizForm.class}
                  onChange={(e) => setQuizForm({ ...quizForm, class: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={quizForm.duration_minutes}
                  onChange={(e) => setQuizForm({ ...quizForm, duration_minutes: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={quizForm.total_marks}
                  onChange={(e) => setQuizForm({ ...quizForm, total_marks: parseInt(e.target.value) || 100 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                placeholder="Brief description of the quiz..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuiz}>{editingQuiz ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Questions Dialog */}
      <Dialog open={isQuestionsDialogOpen} onOpenChange={setIsQuestionsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Questions - {selectedQuiz?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border border-border rounded-lg space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Question {qIndex + 1}</Label>
                    <Textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                      placeholder="Enter question..."
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correct_option === oIndex}
                        onChange={() => updateQuestion(qIndex, "correct_option", oIndex)}
                        className="w-4 h-4 accent-primary"
                      />
                      <Input
                        value={opt}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Label>Marks:</Label>
                  <Input
                    type="number"
                    value={q.marks}
                    onChange={(e) => updateQuestion(qIndex, "marks", parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addQuestion} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveQuestions}>Save Questions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageQuizzes;
