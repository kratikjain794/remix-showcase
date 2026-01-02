import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  QrCode, 
  ScanFace, 
  CheckCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  Camera,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useCamera } from "@/hooks/use-camera";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";
import { useToast } from "@/hooks/use-toast";

const AttendanceModule = () => {
  const [attendanceMethod, setAttendanceMethod] = useState<"face" | "qr" | "geo">("face");
  const [isProcessing, setIsProcessing] = useState(false);
  const [marked, setMarked] = useState(false);
  
  const { toast } = useToast();
  
  // Camera for face recognition
  const faceCamera = useCamera({ facingMode: "user" });
  
  // Barcode scanner for QR
  const barcodeScanner = useBarcodeScanner();
  
  // Geolocation
  const geolocation = useGeolocation();

  const attendanceHistory = [
    { date: "Jan 2, 2026", subject: "Data Structures", time: "09:00 AM", status: "present" },
    { date: "Jan 2, 2026", subject: "Machine Learning", time: "11:00 AM", status: "present" },
    { date: "Jan 1, 2026", subject: "Database Systems", time: "14:00 PM", status: "present" },
    { date: "Jan 1, 2026", subject: "Project Lab", time: "16:00 PM", status: "absent" },
    { date: "Dec 31, 2025", subject: "Algorithms", time: "09:00 AM", status: "present" },
  ];

  // Handle method change - stop all active captures
  useEffect(() => {
    faceCamera.stopCamera();
    barcodeScanner.stopScanning();
    geolocation.reset();
    setMarked(false);
  }, [attendanceMethod]);

  // Handle face capture completion
  const handleFaceCapture = async () => {
    const image = faceCamera.captureImage();
    if (image) {
      setIsProcessing(true);
      // Simulate face verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsProcessing(false);
      faceCamera.stopCamera();
      setMarked(true);
      toast({
        title: "Attendance Marked!",
        description: "Face verified successfully.",
      });
    }
  };

  // Handle QR scan completion
  useEffect(() => {
    if (barcodeScanner.scannedCode && !marked) {
      setMarked(true);
      toast({
        title: "Attendance Marked!",
        description: `QR Code scanned: ${barcodeScanner.scannedCode}`,
      });
    }
  }, [barcodeScanner.scannedCode, marked, toast]);

  // Handle geo verification
  const handleGeoVerify = async () => {
    setIsProcessing(true);
    const success = await geolocation.getCurrentPosition();
    setIsProcessing(false);
    
    if (success) {
      setMarked(true);
      toast({
        title: "Attendance Marked!",
        description: "Location verified successfully.",
      });
    } else if (geolocation.error) {
      toast({
        title: "Location Error",
        description: geolocation.error,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setMarked(false);
    faceCamera.resetCapture();
    barcodeScanner.resetScan();
    geolocation.reset();
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={attendanceMethod}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-8"
                  >
                    {/* Face Recognition */}
                    {attendanceMethod === "face" && (
                      <div className="space-y-6">
                        <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden bg-secondary border-4 border-dashed border-primary/50">
                          {faceCamera.isActive ? (
                            <>
                              <video
                                ref={faceCamera.videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover scale-x-[-1]"
                              />
                              {/* Face guide overlay */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-40 h-48 border-2 border-primary/60 rounded-[50%]" />
                              </div>
                            </>
                          ) : faceCamera.capturedImage ? (
                            <img 
                              src={faceCamera.capturedImage} 
                              alt="Captured face" 
                              className="w-full h-full object-cover scale-x-[-1]"
                            />
                          ) : marked ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <CheckCircle className="w-20 h-20 text-green" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ScanFace className="w-20 h-20 text-muted-foreground" />
                            </div>
                          )}
                          
                          {isProcessing && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                              <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                        
                        {faceCamera.error && (
                          <p className="text-destructive text-sm">{faceCamera.error}</p>
                        )}
                        
                        <p className="text-muted-foreground">
                          {isProcessing 
                            ? "Verifying face..." 
                            : marked 
                              ? "Attendance marked successfully!" 
                              : faceCamera.isActive 
                                ? "Position your face in the circle and capture"
                                : "Start camera to capture your face"}
                        </p>
                        
                        {!marked && (
                          <div className="flex gap-3 justify-center">
                            {!faceCamera.isActive ? (
                              <Button onClick={faceCamera.startCamera} className="bg-primary">
                                <Camera className="w-4 h-4 mr-2" />
                                Start Camera
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  onClick={handleFaceCapture} 
                                  className="bg-primary"
                                  disabled={isProcessing}
                                >
                                  <ScanFace className="w-4 h-4 mr-2" />
                                  Capture & Verify
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={faceCamera.stopCamera}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* QR Code Scanner */}
                    {attendanceMethod === "qr" && (
                      <div className="space-y-6">
                        <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-secondary border border-border">
                          {barcodeScanner.isScanning ? (
                            <>
                              <video
                                ref={barcodeScanner.videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                              />
                              {/* Scan line animation */}
                              <div className="absolute inset-0 pointer-events-none">
                                <motion.div
                                  className="h-0.5 bg-primary shadow-lg shadow-primary/50"
                                  animate={{ y: [0, 256, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                              </div>
                              {/* Corner guides */}
                              <div className="absolute inset-8 pointer-events-none">
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary" />
                              </div>
                            </>
                          ) : barcodeScanner.scannedCode ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <CheckCircle className="w-20 h-20 text-green" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <QrCode className="w-20 h-20 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {barcodeScanner.error && (
                          <p className="text-destructive text-sm">{barcodeScanner.error}</p>
                        )}
                        
                        {barcodeScanner.scannedCode && (
                          <p className="text-sm text-muted-foreground font-mono bg-secondary px-3 py-2 rounded-lg inline-block">
                            {barcodeScanner.scannedCode}
                          </p>
                        )}
                        
                        <p className="text-muted-foreground">
                          {barcodeScanner.isScanning 
                            ? "Point camera at QR code..." 
                            : marked 
                              ? "Attendance marked successfully!" 
                              : "Scan the classroom QR code"}
                        </p>
                        
                        {!marked && (
                          <div className="flex gap-3 justify-center">
                            {!barcodeScanner.isScanning ? (
                              <Button onClick={barcodeScanner.startScanning} className="bg-primary">
                                <QrCode className="w-4 h-4 mr-2" />
                                Start Scanner
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                onClick={barcodeScanner.stopScanning}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Geo-Fencing */}
                    {attendanceMethod === "geo" && (
                      <div className="space-y-6">
                        <div className="relative w-64 h-64 mx-auto rounded-full bg-secondary border-4 border-primary/30 flex items-center justify-center">
                          {geolocation.isLoading && (
                            <motion.div 
                              className="absolute inset-0 rounded-full bg-primary/10"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                          
                          {marked ? (
                            <CheckCircle className="w-20 h-20 text-green" />
                          ) : geolocation.latitude !== null ? (
                            <div className="text-center">
                              <MapPin className="w-16 h-16 text-primary mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">
                                {geolocation.latitude.toFixed(4)}, {geolocation.longitude?.toFixed(4)}
                              </p>
                              {geolocation.accuracy && (
                                <p className="text-xs text-muted-foreground">
                                  ±{Math.round(geolocation.accuracy)}m accuracy
                                </p>
                              )}
                            </div>
                          ) : (
                            <MapPin className="w-20 h-20 text-muted-foreground" />
                          )}
                          
                          {geolocation.isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            </div>
                          )}
                        </div>
                        
                        {geolocation.error && (
                          <p className="text-destructive text-sm">{geolocation.error}</p>
                        )}
                        
                        {geolocation.distance !== null && !marked && (
                          <p className="text-sm text-muted-foreground">
                            Distance from campus: {geolocation.distance}m 
                            {geolocation.isWithinCampus ? " ✓ Within range" : ` (need to be within ${geolocation.campusRadius}m)`}
                          </p>
                        )}
                        
                        <p className="text-muted-foreground">
                          {geolocation.isLoading 
                            ? "Getting your location..." 
                            : marked 
                              ? "Location verified! Attendance marked." 
                              : "Verify you are on campus"}
                        </p>
                        
                        {!marked && (
                          <Button 
                            onClick={handleGeoVerify} 
                            className="bg-primary"
                            disabled={geolocation.isLoading}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            {geolocation.isLoading ? "Verifying..." : "Verify Location"}
                          </Button>
                        )}
                      </div>
                    )}

                    {marked && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="mt-6"
                        onClick={handleReset}
                      >
                        Mark Another Class
                      </Button>
                    )}
                  </motion.div>
                </AnimatePresence>
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
