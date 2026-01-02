import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Send, Sparkles, BookOpen, FileText, Code, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AIAssistant = () => {
  const [messages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI academic assistant. How can I help you today? I can help with homework, explain concepts, prepare you for quizzes, or answer any academic questions."
    },
    {
      role: "user",
      content: "Can you explain how binary search works?"
    },
    {
      role: "assistant",
      content: `Of course! Binary search is an efficient algorithm for finding an item in a sorted list. Here's how it works:

1. **Start in the middle** of the sorted array
2. **Compare** the target value with the middle element
3. If they match, you found it!
4. If target is **smaller**, search the left half
5. If target is **larger**, search the right half
6. **Repeat** until found or the subarray is empty

The time complexity is O(log n), making it much faster than linear search for large datasets. Would you like me to show you a code example?`
    }
  ]);

  const suggestions = [
    { icon: BookOpen, text: "Explain binary search trees" },
    { icon: FileText, text: "Help with calculus homework" },
    { icon: Code, text: "Debug my Python code" },
    { icon: Target, text: "Prepare for tomorrow's quiz" },
  ];

  return (
    <section id="ai-assistant" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Support</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Your Personal <span className="text-gradient">Academic Assistant</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get instant help with homework, exam preparation, concept explanations, and more. 
            Available 24/7 to support your learning journey.
          </p>
        </motion.div>

        {/* Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">EduAI Assistant</h4>
                <p className="text-sm text-green">● Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground mb-1 block">EduAI</span>
                        <div className="p-4 rounded-2xl rounded-tl-md bg-secondary/50 border border-border">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="max-w-[80%]">
                      <div className="p-4 rounded-2xl rounded-tr-md bg-primary text-primary-foreground">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <Link to="/modules/ai-assistant">
                  <Button className="bg-primary text-primary-foreground rounded-xl p-3">
                    <Send className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  to="/modules/ai-assistant"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <suggestion.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{suggestion.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAssistant;