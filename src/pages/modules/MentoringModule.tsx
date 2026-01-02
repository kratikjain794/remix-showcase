import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  MessageSquare,
  Calendar,
  Star,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const MentoringModule = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "Senior AI Engineer",
      company: "Google",
      batch: "2018",
      expertise: ["Machine Learning", "NLP", "Career Growth"],
      rating: 4.9,
      sessions: 45,
      available: true
    },
    {
      id: 2,
      name: "Rahul Sharma",
      role: "Product Manager",
      company: "Microsoft",
      batch: "2019",
      expertise: ["Product Management", "Tech Strategy", "Interviews"],
      rating: 4.8,
      sessions: 32,
      available: true
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Full Stack Developer",
      company: "Amazon",
      batch: "2020",
      expertise: ["Web Development", "System Design", "Coding"],
      rating: 4.7,
      sessions: 28,
      available: false
    },
    {
      id: 4,
      name: "Michael Park",
      role: "Data Scientist",
      company: "Meta",
      batch: "2017",
      expertise: ["Data Science", "Analytics", "Research"],
      rating: 4.9,
      sessions: 56,
      available: true
    },
  ];

  const categories = [
    { id: "all", name: "All Mentors" },
    { id: "tech", name: "Technology" },
    { id: "product", name: "Product" },
    { id: "research", name: "Research" },
  ];

  const upcomingSessions = [
    { mentor: "Dr. Sarah Chen", topic: "AI Career Path", date: "Jan 5, 2026", time: "3:00 PM" },
    { mentor: "Rahul Sharma", topic: "Interview Prep", date: "Jan 8, 2026", time: "5:00 PM" },
  ];

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
              <h1 className="font-display text-3xl font-bold">Alumni Mentoring</h1>
              <p className="text-muted-foreground">Connect with alumni for career guidance and mentorship</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mentors List */}
            <div className="lg:col-span-2">
              {/* Category Filter */}
              <div className="flex gap-3 mb-6 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    size="sm"
                    className={selectedCategory === category.id ? "bg-primary" : ""}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Mentor Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {mentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-purple/50 flex items-center justify-center text-lg font-bold">
                          {mentor.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="font-semibold">{mentor.name}</h3>
                          <p className="text-sm text-muted-foreground">{mentor.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        mentor.available ? "bg-green/20 text-green" : "bg-muted text-muted-foreground"
                      }`}>
                        {mentor.available ? "Available" : "Busy"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {mentor.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        Batch {mentor.batch}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.map((skill, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow fill-yellow" />
                          <span>{mentor.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{mentor.sessions} sessions</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary text-primary-foreground"
                        disabled={!mentor.available}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Book
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Upcoming Sessions</h3>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="p-4 rounded-xl bg-secondary/30 border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{session.mentor}</p>
                          <p className="text-xs text-muted-foreground">{session.topic}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {session.date} at {session.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-cyan">5</p>
                    <p className="text-xs text-muted-foreground">Sessions Done</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-purple">3</p>
                    <p className="text-xs text-muted-foreground">Mentors</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-green">2</p>
                    <p className="text-xs text-muted-foreground">Upcoming</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-secondary/50">
                    <p className="text-2xl font-bold text-yellow">4.8</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-purple/20 border border-primary/30 p-6">
                <MessageSquare className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Not sure which mentor to choose? Our AI can recommend the best match for you.
                </p>
                <Link to="/modules/ai-assistant">
                  <Button className="w-full bg-primary text-primary-foreground">
                    Get Recommendations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentoringModule;