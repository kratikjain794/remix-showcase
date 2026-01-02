import { Link } from "react-router-dom";
import { 
  ScanFace, 
  QrCode, 
  MapPin, 
  Eye, 
  Brain, 
  FileQuestion,
  FileText,
  BarChart3,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: ScanFace,
      title: "Face Authentication",
      description: "Advanced facial recognition ensures accurate identity verification for attendance marking.",
      color: "text-cyan",
      bgColor: "bg-cyan/10",
      href: "/modules/attendance"
    },
    {
      icon: QrCode,
      title: "QR Code Attendance",
      description: "Quick and contactless attendance with dynamic QR codes that refresh every session.",
      color: "text-purple",
      bgColor: "bg-purple/10",
      href: "/modules/attendance"
    },
    {
      icon: MapPin,
      title: "Geo-Fencing",
      description: "Location-based verification ensures students are physically present on campus.",
      color: "text-cyan",
      bgColor: "bg-cyan/10",
      href: "/modules/attendance"
    },
    {
      icon: Eye,
      title: "Engagement Tracking",
      description: "AI monitors eye and head movements to classify attention levels in real-time.",
      color: "text-purple",
      bgColor: "bg-purple/10",
      href: "/modules/focus-analytics"
    },
    {
      icon: Brain,
      title: "Focus Analytics",
      description: "Machine learning classifies students as Attentive, Distracted, or Absent.",
      color: "text-pink",
      bgColor: "bg-pink/10",
      href: "/modules/focus-analytics"
    },
    {
      icon: FileQuestion,
      title: "AI Quizzes",
      description: "Automated quiz generation after each class or chapter for instant assessment.",
      color: "text-yellow",
      bgColor: "bg-yellow/10",
      href: "/modules/quizzes"
    },
    {
      icon: FileText,
      title: "Assignment System",
      description: "Upload, submit, and evaluate assignments with AI-powered grading assistance.",
      color: "text-orange",
      bgColor: "bg-orange/10",
      href: "/modules/assignments"
    },
    {
      icon: BarChart3,
      title: "Marks Management",
      description: "Comprehensive internal and exam marks tracking with automated calculations.",
      color: "text-green",
      bgColor: "bg-green/10",
      href: "/modules/marks"
    },
    {
      icon: GraduationCap,
      title: "Alumni Mentoring",
      description: "Connect with alumni for career guidance and mentorship opportunities.",
      color: "text-cyan",
      bgColor: "bg-cyan/10",
      href: "/modules/mentoring"
    },
    {
      icon: LayoutDashboard,
      title: "Multi-Role Dashboards",
      description: "Tailored interfaces for students, teachers, and administrators.",
      color: "text-purple",
      bgColor: "bg-purple/10",
      href: "/dashboard"
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      description: "24/7 instant academic support powered by intelligent conversational AI.",
      color: "text-pink",
      bgColor: "bg-pink/10",
      href: "/modules/ai-assistant"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Access the platform seamlessly on any device with responsive design.",
      color: "text-green",
      bgColor: "bg-green/10",
      href: "/"
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="text-gradient">Modern Education</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of AI-powered tools designed to revolutionize how educational 
            institutions manage attendance, engagement, and academic performance.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={feature.href}
                className="block h-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className={`feature-icon ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;