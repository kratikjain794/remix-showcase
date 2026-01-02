import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Settings, 
  Bell,
  CheckCircle,
  TrendingUp,
  Award,
  FileText,
  Clock,
  Brain,
  Calendar,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

type Role = "student" | "teacher" | "admin";

const Dashboard = () => {
  const [activeRole, setActiveRole] = useState<Role>("student");

  const roles = [
    { id: "student" as Role, name: "Student", icon: BookOpen },
    { id: "teacher" as Role, name: "Teacher", icon: Users },
    { id: "admin" as Role, name: "Administrator", icon: Settings },
  ];

  const studentData = {
    stats: [
      { label: "Attendance", value: "94.5%", change: "+2.3%", icon: CheckCircle, color: "text-cyan" },
      { label: "Focus Score", value: "88%", change: "+5%", icon: Brain, color: "text-purple" },
      { label: "Quiz Average", value: "85.2%", change: "+3.1%", icon: Award, color: "text-yellow" },
      { label: "Assignments", value: "14/16", subtext: "2 pending", icon: FileText, color: "text-green" },
    ],
    schedule: [
      { time: "09:00 - 10:30", subject: "Data Structures", status: "completed" },
      { time: "11:00 - 12:30", subject: "Machine Learning", status: "ongoing" },
      { time: "14:00 - 15:30", subject: "Database Systems", status: "upcoming" },
      { time: "16:00 - 17:00", subject: "Project Lab", status: "upcoming" },
    ],
    quickLinks: [
      { name: "Mark Attendance", href: "/modules/attendance", icon: CheckCircle },
      { name: "Take Quiz", href: "/modules/quizzes", icon: FileText },
      { name: "View Marks", href: "/modules/marks", icon: BarChart3 },
      { name: "AI Assistant", href: "/modules/ai-assistant", icon: MessageSquare },
    ]
  };

  const teacherData = {
    stats: [
      { label: "Classes Today", value: "4", change: "", icon: BookOpen, color: "text-cyan" },
      { label: "Students", value: "156", change: "+12", icon: Users, color: "text-purple" },
      { label: "Avg. Engagement", value: "87%", change: "+4%", icon: TrendingUp, color: "text-yellow" },
      { label: "Pending Reviews", value: "23", subtext: "assignments", icon: FileText, color: "text-orange" },
    ],
    schedule: [
      { time: "09:00 - 10:30", subject: "CS301 - Algorithms", status: "completed" },
      { time: "11:00 - 12:30", subject: "CS402 - AI Fundamentals", status: "ongoing" },
      { time: "14:00 - 15:30", subject: "CS201 - Data Structures", status: "upcoming" },
      { time: "16:00 - 17:00", subject: "Office Hours", status: "upcoming" },
    ],
    quickLinks: [
      { name: "Create Quiz", href: "/modules/quizzes", icon: FileText },
      { name: "Grade Assignments", href: "/modules/assignments", icon: CheckCircle },
      { name: "View Analytics", href: "/modules/focus-analytics", icon: BarChart3 },
      { name: "Schedule Class", href: "#", icon: Calendar },
    ]
  };

  const adminData = {
    stats: [
      { label: "Total Students", value: "2,450", change: "+125", icon: Users, color: "text-cyan" },
      { label: "Faculty", value: "89", change: "+3", icon: BookOpen, color: "text-purple" },
      { label: "Attendance Rate", value: "91.2%", change: "+1.5%", icon: CheckCircle, color: "text-green" },
      { label: "Active Classes", value: "48", subtext: "today", icon: Clock, color: "text-yellow" },
    ],
    schedule: [
      { time: "Today", subject: "Staff Meeting at 10:00 AM", status: "upcoming" },
      { time: "Today", subject: "Budget Review at 2:00 PM", status: "upcoming" },
      { time: "Tomorrow", subject: "Academic Council", status: "upcoming" },
      { time: "Friday", subject: "Parent-Teacher Meeting", status: "upcoming" },
    ],
    quickLinks: [
      { name: "Manage Users", href: "#", icon: Users },
      { name: "View Reports", href: "#", icon: BarChart3 },
      { name: "System Settings", href: "#", icon: Settings },
      { name: "Announcements", href: "#", icon: Bell },
    ]
  };

  const currentData = activeRole === "student" ? studentData : activeRole === "teacher" ? teacherData : adminData;
  const userName = activeRole === "student" ? "Sarah" : activeRole === "teacher" ? "Dr. Smith" : "Admin";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Role Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={activeRole === role.id ? "default" : "outline"}
                onClick={() => setActiveRole(role.id)}
                className={activeRole === role.id ? "bg-primary text-primary-foreground" : ""}
              >
                <role.icon className="w-4 h-4 mr-2" />
                {role.name}
              </Button>
            ))}
          </div>

          {/* Dashboard Content */}
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold">Welcome, {userName}!</h1>
                  <p className="text-muted-foreground">
                    {activeRole === "student" ? "Computer Science, 3rd Year" : 
                     activeRole === "teacher" ? "Computer Science Department" : 
                     "Institution Overview"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {userName[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {currentData.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl bg-card border border-border p-6"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-muted-foreground">{stat.change}</p>
                  )}
                  {stat.subtext && (
                    <p className="text-sm text-muted-foreground">{stat.subtext}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Schedule & Quick Links */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Schedule */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="font-semibold text-xl mb-4">Today's Schedule</h2>
                <div className="space-y-3">
                  {currentData.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-28">{item.time}</span>
                        <span className="font-medium">{item.subject}</span>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        item.status === "completed" ? "bg-green/20 text-green" :
                        item.status === "ongoing" ? "bg-cyan/20 text-cyan" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="font-semibold text-xl mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {currentData.quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.href}
                      className="flex flex-col items-center gap-3 p-6 rounded-xl bg-secondary/30 border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <link.icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                        {link.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;