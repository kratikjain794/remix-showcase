import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  QrCode, 
  ScanFace, 
  CheckCircle, 
  Clock, 
  Calendar,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const AttendanceModule = () => {
  const [attendanceMethod, setAttendanceMethod] = useState<"face" | "qr" | "geo">("face");
  const [isMarking, setIsMarking] = useState(false);
  const [marked, setMarked] = useState(false);

  const attendanceHistory = [
    { date: "Jan 2, 2026", subject: "Data Structures", time: "09:00 AM", status: "present" },
    { date: "Jan 2, 2026", subject: "Machine Learning", time: "11:00 AM", status: "present" },
    { date: "Jan 1, 2026", subject: "Database Systems", time: "14:00 PM", status: "present" },
    { date: "Jan 1, 2026", subject: "Project Lab", time: "16:00 PM", status: "absent" },
    { date: "Dec 31, 2025", subject: "Algorithms", time: "09:00 AM", status: "present" },
  ];

  const handleMarkAttendance = () => {
    setIsMarking(true);
    setTimeout(() => {
      setIsMarking(false);
      setMarked(true);
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
              <h1 className="font-display text-3xl font-bold">Smart Attendance</h1>
              <p className="text-muted-foreground">Mark and track your attendance with multiple methods</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Mark Attendance Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-card border border-border p-6">
                <h2 className="font-semibold text-xl mb-6">Mark Attendance</h2>
                
                {/* Method Selection */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {[
                    { id: "face", icon: ScanFace, label: "Face Recognition" },
                    { id: "qr", icon: QrCode, label: "QR Code" },
                    { id: "geo", icon: MapPin, label: "Geo-Fencing" },
                  ].map((method) => (
                    <Button
                      key={method.id}
                      variant={attendanceMethod === method.id ? "default" : "outline"}
                      onClick={() => setAttendanceMethod(method.id as any)}
                      className={attendanceMethod === method.id ? "bg-primary" : ""}
                    >
                      <method.icon className="w-4 h-4 mr-2" />
                      {method.label}
                    </Button>
                  ))}
                </div>

                {/* Attendance Interface */}
                <motion.div
                  key={attendanceMethod}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  {attendanceMethod === "face" && (
                    <div className="space-y-6">
                      <div className="w-48 h-48 mx-auto rounded-full bg-secondary border-4 border-dashed border-primary/50 flex items-center justify-center">
                        {isMarking ? (
                          <div className="animate-pulse">
                            <ScanFace className="w-20 h-20 text-primary" />
                          </div>
                        ) : marked ? (
                          <CheckCircle className="w-20 h-20 text-green" />
                        ) : (
                          <ScanFace className="w-20 h-20 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {isMarking ? "Scanning face..." : marked ? "Attendance marked successfully!" : "Position your face in the circle"}
                      </p>
                    </div>
                  )}

                  {attendanceMethod === "qr" && (
                    <div className="space-y-6">
                      <div className="w-48 h-48 mx-auto rounded-2xl bg-secondary border border-border flex items-center justify-center">
                        {isMarking ? (
                          <div className="animate-pulse">
                            <QrCode className="w-20 h-20 text-primary" />
                          </div>
                        ) : marked ? (
                          <CheckCircle className="w-20 h-20 text-green" />
                        ) : (
                          <QrCode className="w-20 h-20 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {isMarking ? "Scanning QR code..." : marked ? "Attendance marked successfully!" : "Scan the classroom QR code"}
                      </p>
                    </div>
                  )}

                  {attendanceMethod === "geo" && (
                    <div className="space-y-6">
                      <div className="w-48 h-48 mx-auto rounded-full bg-secondary border-4 border-primary/30 flex items-center justify-center relative">
                        {isMarking ? (
                          <div className="animate-ping absolute w-32 h-32 rounded-full bg-primary/20" />
                        ) : null}
                        {marked ? (
                          <CheckCircle className="w-20 h-20 text-green" />
                        ) : (
                          <MapPin className="w-20 h-20 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {isMarking ? "Verifying location..." : marked ? "Location verified! Attendance marked." : "Verify you are on campus"}
                      </p>
                    </div>
                  )}

                  {!marked && (
                    <Button 
                      size="lg" 
                      className="mt-6 bg-primary text-primary-foreground"
                      onClick={handleMarkAttendance}
                      disabled={isMarking}
                    >
                      {isMarking ? "Processing..." : "Mark Attendance"}
                    </Button>
                  )}

                  {marked && (
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="mt-6"
                      onClick={() => setMarked(false)}
                    >
                      Mark Another Class
                    </Button>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Stats & History */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">This Month</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <TrendingUp className="w-6 h-6 text-cyan mx-auto mb-2" />
                    <p className="text-2xl font-bold text-cyan">94.5%</p>
                    <p className="text-xs text-muted-foreground">Attendance Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/50">
                    <Calendar className="w-6 h-6 text-purple mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple">23/24</p>
                    <p className="text-xs text-muted-foreground">Days Present</p>
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-semibold mb-4">Recent Attendance</h3>
                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{record.subject}</p>
                          <p className="text-xs text-muted-foreground">{record.date} • {record.time}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        record.status === "present" ? "bg-green/20 text-green" : "bg-destructive/20 text-destructive"
                      }`}>
                        {record.status}
                      </span>
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

export default AttendanceModule;