import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Brain, 
  Eye, 
  EyeOff, 
  Activity,
  TrendingUp,
  Clock,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const FocusAnalytics = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [focusLevel, setFocusLevel] = useState(85);

  const sessions = [
    { subject: "Machine Learning", duration: "1h 30m", score: 92, status: "Attentive" },
    { subject: "Data Structures", duration: "1h 15m", score: 78, status: "Attentive" },
    { subject: "Database Systems", duration: "1h 00m", score: 65, status: "Distracted" },
    { subject: "Project Lab", duration: "2h 00m", score: 88, status: "Attentive" },
  ];

  const weeklyData = [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 78 },
    { day: "Wed", score: 92 },
    { day: "Thu", score: 70 },
    { day: "Fri", score: 88 },
  ];

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      // Simulate focus level changes
      const interval = setInterval(() => {
        setFocusLevel(prev => {
          const change = Math.random() > 0.5 ? 5 : -5;
          return Math.min(100, Math.max(0, prev + change));
        });
      }, 2000);
      setTimeout(() => clearInterval(interval), 30000);
    }
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
              <h1 className="font-display text-3xl font-bold">Focus Analytics</h1>
              <p className="text-muted-foreground">AI-powered attention and engagement tracking</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Tracking */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">Live Focus Tracking</h2>
                  <Button 
                    onClick={toggleTracking}
                    className={isTracking ? "bg-destructive hover:bg-destructive/90" : "bg-primary"}
                  >
                    {isTracking ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Stop Tracking
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Start Tracking
                      </>
                    )}
                  </Button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  {/* Focus Circle */}
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-secondary"
                      />
                      <motion.circle
                        cx="128"
                        cy="128"
                        r="110"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        className={focusLevel >= 70 ? "text-green" : focusLevel >= 40 ? "text-yellow" : "text-destructive"}
                        strokeDasharray={691}
                        initial={{ strokeDashoffset: 691 }}
                        animate={{ strokeDashoffset: 691 - (691 * focusLevel) / 100 }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Brain className={`w-12 h-12 mb-2 ${isTracking ? "animate-pulse" : ""} ${
                        focusLevel >= 70 ? "text-green" : focusLevel >= 40 ? "text-yellow" : "text-destructive"
                      }`} />
                      <span className="text-4xl font-bold">{focusLevel}%</span>
                      <span className="text-muted-foreground">Focus Score</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                    focusLevel >= 70 ? "bg-green/20 text-green" : 
                    focusLevel >= 40 ? "bg-yellow/20 text-yellow" : 
                    "bg-destructive/20 text-destructive"
                  }`}>
                    <Activity className="w-5 h-5" />
                    <span className="font-semibold">
                      {focusLevel >= 70 ? "Attentive" : focusLevel >= 40 ? "Moderate" : "Distracted"}
                    </span>
                  </div>

                  {isTracking && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Tracking eye movement and attention patterns...
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Weekly Chart */}
              <div className="rounded-2xl bg-card border border-border p-6 mt-6">
                <h3 className="font-semibold mb-4">Weekly Focus Trend</h3>
                <div className="flex items-end justify-between h-40 gap-4">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        className={`w-full rounded-t-lg ${
                          day.score >= 80 ? "bg-green" : day.score >= 60 ? "bg-yellow" : "bg-orange"
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${day.score}%` }}
                        transition={{ delay: index * 0.1 }}
                      />
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats & Sessions */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">This Week</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-cyan" />
                      <span className="text-sm">Average Score</span>
                    </div>
                    <span className="font-bold text-cyan">82.6%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple" />
                      <span className="text-sm">Focus Time</span>
                    </div>
                    <span className="font-bold text-purple">12.5h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green" />
                      <span className="text-sm">Best Session</span>
                    </div>
                    <span className="font-bold text-green">92%</span>
                  </div>
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Recent Sessions</h3>
                <div className="space-y-3">
                  {sessions.map((session, index) => (
                    <div key={index} className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{session.subject}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          session.status === "Attentive" ? "bg-green/20 text-green" : "bg-yellow/20 text-yellow"
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{session.duration}</span>
                        <span className="font-medium">{session.score}% focus</span>
                      </div>
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

export default FocusAnalytics;