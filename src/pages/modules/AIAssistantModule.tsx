import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  Sparkles,
  BookOpen,
  Code,
  Calculator,
  Lightbulb,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistantModule = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your EduAI academic assistant. I'm here to help you with:\n\n• Explaining complex concepts\n• Homework assistance\n• Quiz preparation\n• Debugging code\n• Study planning\n\nHow can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    { icon: BookOpen, text: "Explain recursion with examples" },
    { icon: Calculator, text: "Help me solve calculus problems" },
    { icon: Code, text: "Debug my sorting algorithm" },
    { icon: Lightbulb, text: "Give me study tips for exams" },
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("recursion")) {
      return `**Recursion** is a programming technique where a function calls itself to solve smaller instances of the same problem.

**Key Components:**
1. **Base Case** - The condition that stops recursion
2. **Recursive Case** - The function calling itself with modified parameters

**Example - Factorial:**
\`\`\`python
def factorial(n):
    if n <= 1:  # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case
\`\`\`

**How it works for factorial(5):**
- factorial(5) = 5 × factorial(4)
- factorial(4) = 4 × factorial(3)
- factorial(3) = 3 × factorial(2)
- factorial(2) = 2 × factorial(1)
- factorial(1) = 1 (base case reached!)

Result: 5 × 4 × 3 × 2 × 1 = **120**

Would you like me to explain another recursive example like Fibonacci?`;
    }
    
    if (lowerMessage.includes("binary search")) {
      return `**Binary Search** is an efficient algorithm for finding an item in a sorted array.

**Time Complexity:** O(log n) - much faster than linear search!

**How it works:**
1. Start with the middle element
2. If target matches middle, we're done!
3. If target < middle, search left half
4. If target > middle, search right half
5. Repeat until found or exhausted

**Example Code:**
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

Would you like me to trace through a specific example?`;
    }

    if (lowerMessage.includes("study") || lowerMessage.includes("exam")) {
      return `Here are my top **study tips** for exam preparation:

📚 **Active Learning:**
- Don't just read - practice problems
- Teach concepts to someone else
- Create flashcards for key terms

⏰ **Time Management:**
- Use Pomodoro technique (25 min study, 5 min break)
- Start with difficult topics when fresh
- Review before bed for better retention

✍️ **Effective Notes:**
- Use diagrams and mind maps
- Summarize each chapter in your own words
- Highlight formulas and key definitions

🧠 **Memory Techniques:**
- Use mnemonics for lists
- Connect new concepts to things you know
- Practice spaced repetition

💪 **Self-Care:**
- Get 7-8 hours of sleep
- Stay hydrated and eat brain foods
- Take regular breaks to avoid burnout

Which subject are you preparing for? I can give more specific tips!`;
    }

    if (lowerMessage.includes("debug") || lowerMessage.includes("code") || lowerMessage.includes("error")) {
      return `I'd be happy to help debug your code! 🔍

To help you effectively, please share:

1. **The code** you're working with
2. **The error message** (if any)
3. **Expected behavior** vs what's happening
4. **Programming language** you're using

**Common debugging steps:**
- Check for syntax errors (missing brackets, semicolons)
- Verify variable names and scope
- Add print statements to trace execution
- Check edge cases (empty arrays, null values)
- Review loop conditions for off-by-one errors

Paste your code and I'll analyze it!`;
    }

    return `That's a great question! Let me think about this...

Based on what you're asking about "${userMessage}", here are some thoughts:

1. This is an interesting topic that connects to several core concepts
2. I'd recommend breaking it down into smaller parts
3. Practice with examples is key to understanding

Would you like me to:
- Explain the fundamental concepts?
- Provide practice problems?
- Show code examples?
- Create a study plan?

Just let me know what would be most helpful! 📖`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: getAIResponse(input)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-4 flex flex-col">
        <div className="container mx-auto px-4 flex flex-col flex-1 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">EduAI Assistant</h1>
                <p className="text-sm text-green">● Online</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 rounded-2xl bg-card border border-border flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" ? (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="p-4 rounded-2xl rounded-tl-md bg-secondary/50 border border-border">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 max-w-[85%]">
                        <div className="p-4 rounded-2xl rounded-tr-md bg-primary text-primary-foreground">
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(suggestion.text)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border hover:border-primary/50 transition-colors text-sm"
                    >
                      <suggestion.icon className="w-4 h-4 text-muted-foreground" />
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <Button 
                  className="bg-primary text-primary-foreground rounded-xl p-3"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantModule;