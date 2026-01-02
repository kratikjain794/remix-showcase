import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const MarksModule = () => {
  const [selectedSemester, setSelectedSemester] = useState("current");

  const subjects = [
    { name: "Data Structures", internal: 42, external: 85, total: 127, max: 150, grade: "A" },
    { name: "Machine Learning", internal: 38, external: 78, total: 116, max: 150, grade: "A-" },
    { name: "Database Systems", internal: 40, external: 82, total: 122, max: 150, grade: "A" },
    { name: "Computer Networks", internal: 35, external: 70, total: 105, max: 150, grade: "B+" },
    { name: "Project Lab", internal: 45, external: 88, total: 133, max: 150, grade: "A+" },
  ];

  const semesterGPA = [
    { sem: "Sem 1", gpa: 8.2 },
    { sem: "Sem 2", gpa: 8.5 },
    { sem: "Sem 3", gpa: 8.8 },
    { sem: "Sem 4", gpa: 9.1 },
    { sem: "Sem 5", gpa: 8.9 },
  ];

  const currentCGPA = 8.7;
  const classRank = 12;
  const totalStudents = 120;

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
              <h1 className="font-display text-3xl font-bold">Marks Management</h1>
              <p className="text-muted-foreground">Track your academic performance and grades</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <Award className="w-8 h-8 text-yellow mx-auto mb-3" />
              <p className="text-3xl font-bold text-yellow">{currentCGPA}</p>
              <p className="text-sm text-muted-foreground">Current CGPA</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green mx-auto mb-3" />
              <p className="text-3xl font-bold text-green">9.1</p>
              <p className="text-sm text-muted-foreground">Best SGPA</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <BarChart3 className="w-8 h-8 text-cyan mx-auto mb-3" />
              <p className="text-3xl font-bold text-cyan">#{classRank}</p>
              <p className="text-sm text-muted-foreground">Class Rank</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6 text-center">
              <BookOpen className="w-8 h-8 text-purple mx-auto mb-3" />
              <p className="text-3xl font-bold text-purple">603</p>
              <p className="text-sm text-muted-foreground">Total Marks</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subject Marks */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">Subject Marks</h2>
                  <select 
                    className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                  >
                    <option value="current">Current Semester</option>
                    <option value="sem4">Semester 4</option>
                    <option value="sem3">Semester 3</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Internal</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">External</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/50"
                        >
                          <td className="py-4 px-4">
                            <span className="font-medium">{subject.name}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-muted-foreground">{subject.internal}/50</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-muted-foreground">{subject.external}/100</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-bold text-primary">{subject.total}/{subject.max}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              subject.grade.startsWith("A") ? "bg-green/20 text-green" :
                              subject.grade.startsWith("B") ? "bg-cyan/20 text-cyan" :
                              "bg-yellow/20 text-yellow"
                            }`}>
                              {subject.grade}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* GPA Chart */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">SGPA Trend</h3>
                <div className="flex items-end justify-between h-40 gap-3">
                  {semesterGPA.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.gpa / 10) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                      />
                      <span className="text-xs font-medium">{item.gpa}</span>
                      <span className="text-xs text-muted-foreground">{item.sem}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Grade Distribution</h3>
                <div className="space-y-3">
                  {[
                    { grade: "A+", count: 1, color: "bg-green" },
                    { grade: "A", count: 2, color: "bg-cyan" },
                    { grade: "A-", count: 1, color: "bg-purple" },
                    { grade: "B+", count: 1, color: "bg-yellow" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium">{item.grade}</span>
                      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / 5) * 100}%` }}
                          transition={{ delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarksModule;