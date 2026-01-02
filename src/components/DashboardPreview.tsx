import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Settings, 
  CheckCircle, 
  TrendingUp, 
  Award, 
  FileText,
  Clock,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Role = "student" | "teacher" | "admin";

const DashboardPreview = () => {
  const [activeRole, setActiveRole] = useState<Role>("student");

  const roles = [
    { id: "student" as Role, name: "Student", icon: BookOpen },
    { id: "teacher" as Role, name: "Teacher", icon: Users },
    { id: "admin" as Role, name: "Administrator", icon: Settings },
  ];

  const dashboardData = {
    student: {
      name: "Sarah",
      subtitle: "Computer Science, 3rd Year",
      stats: [
        { label: "Attendance", value: "94.5%", change: "+2.3%", icon: CheckCircle, color: "text-cyan" },
        { label: "Focus Score", value: "88%", change: "+5%", icon: TrendingUp, color: "text-purple" },
        { label: "Quiz Average", value: "85.2%", change: "+3.1%", icon: Award, color: "text-yellow" },
        { label: "Assignments", value: "14/16", subtext: "2 pending", icon: FileText, color: "text-green" },
      ],
      schedule: [
        { time: "09:00 - 10:30", subject: "Data Structures", status: "completed" },
        { time: "11:00 - 12:30", subject: "Machine Learning", status: "ongoing" },
        { time: "14:00 - 15:30", subject: "Database Systems", status: "upcoming" },
        { time: "16:00 - 17:00", subject: "Project Lab", status: "upcoming" },
      ],
      actions: ["Mark Attendance", "Take Quiz", "View Marks"]
    },
    teacher: {
      name: "Dr. Smith",
      subtitle: "Computer Science Department",
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
      actions: ["Create Quiz", "Grade Assignments", "View Analytics"]
    },
    admin: {
      name: "Admin Panel",
      subtitle: "Institution Overview",
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
      actions: ["Manage Users", "View Reports", "System Settings"]
    }
  };

  const currentData = dashboardData[activeRole];

  return (
    <section id="dashboards" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Role-Based <span className="text-gradient">Dashboards</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for every stakeholder with real-time data visualization and actionable insights.
          </p>
        </motion.div>

        {/* Role Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {roles.map((role) => (
            <Button
              key={role.id}
              variant={activeRole === role.id ? "default" : "outline"}
              onClick={() => setActiveRole(role.id)}
              className={`px-6 py-3 ${
                activeRole === role.id 
                  ? "bg-primary text-primary-foreground" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              <role.icon className="w-4 h-4 mr-2" />
              {role.name}
            </Button>
          ))}
        </div>

        {/* Dashboard Preview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    Welcome, {currentData.name}!
                  </h3>
                  <p className="text-muted-foreground">{currentData.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="w-5 h-5" />
                  </Button>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {currentData.name[0]}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {currentData.stats.map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    )}
                    {stat.subtext && (
                      <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Schedule & Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Schedule */}
                <div>
                  <h4 className="font-semibold mb-4">Today's Schedule</h4>
                  <div className="space-y-3">
                    {currentData.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground w-24">{item.time}</span>
                          <span className="font-medium">{item.subject}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
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

                {/* Quick Actions */}
                <div>
                  <h4 className="font-semibold mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    {currentData.actions.map((action, index) => (
                      <Link
                        key={index}
                        to="/dashboard"
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        <span className="group-hover:text-primary transition-colors">{action}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DashboardPreview;