import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Trophy,
  Target,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

const QuizzesModule = () => {
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const quizzes = [
    { id: 1, title: "Data Structures - Chapter 5", questions: 5, duration: "10 min", difficulty: "Medium" },
    { id: 2, title: "Machine Learning Basics", questions: 8, duration: "15 min", difficulty: "Hard" },
    { id: 3, title: "Database Normalization", questions: 6, duration: "12 min", difficulty: "Easy" },
  ];

  const sampleQuestions = [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1
    },
    {
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1
    },
    {
      question: "What is a balanced binary tree?",
      options: [
        "Tree with equal left and right subtrees",
        "Tree where height difference is at most 1",
        "Tree with only left children",
        "Tree with maximum nodes"
      ],
      correct: 1
    },
    {
      question: "Hash table average lookup time complexity is:",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correct: 2
    },
    {
      question: "Which sorting algorithm has O(n log n) worst case?",
      options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Selection Sort"],
      correct: 2
    },
  ];

  const handleStartQuiz = (quizId: number) => {
    setActiveQuiz(quizId);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === sampleQuestions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
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
              <h1 className="font-display text-3xl font-bold">AI Quizzes</h1>
              <p className="text-muted-foreground">AI-generated assessments for instant learning validation</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!activeQuiz ? (
              /* Quiz Selection */
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        quiz.difficulty === "Easy" ? "bg-green/20 text-green" :
                        quiz.difficulty === "Medium" ? "bg-yellow/20 text-yellow" :
                        "bg-orange/20 text-orange"
                      }`}>
                        {quiz.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{quiz.duration}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{quiz.questions} questions</p>
                    <Button 
                      className="w-full bg-primary text-primary-foreground"
                      onClick={() => handleStartQuiz(quiz.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                ))}
              </motion.div>
            ) : showResults ? (
              /* Results */
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto"
              >
                <div className="rounded-2xl bg-card border border-border p-8 text-center">
                  <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    score >= 4 ? "bg-green/20" : score >= 3 ? "bg-yellow/20" : "bg-orange/20"
                  }`}>
                    <Trophy className={`w-12 h-12 ${
                      score >= 4 ? "text-green" : score >= 3 ? "text-yellow" : "text-orange"
                    }`} />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-muted-foreground mb-6">You've finished the assessment</p>
                  
                  <div className="flex justify-center gap-8 mb-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">{score}/{sampleQuestions.length}</p>
                      <p className="text-sm text-muted-foreground">Correct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-cyan">{Math.round((score / sampleQuestions.length) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Score</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={handleRetry}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Button className="flex-1 bg-primary" onClick={() => setActiveQuiz(null)}>
                      More Quizzes
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Quiz Question */
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl mx-auto"
              >
                <div className="rounded-2xl bg-card border border-border p-6">
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {sampleQuestions.length}
                    </span>
                    <div className="flex gap-1">
                      {sampleQuestions.map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-2 rounded-full ${
                            i < currentQuestion ? "bg-primary" :
                            i === currentQuestion ? "bg-primary/50" : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <h2 className="font-display text-xl font-semibold mb-6">
                    {sampleQuestions[currentQuestion].question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {sampleQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          selectedAnswer === index
                            ? "bg-primary/20 border-primary border-2"
                            : "bg-secondary/50 border border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            selectedAnswer === index ? "bg-primary text-primary-foreground" : "bg-secondary"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveQuiz(null)}>
                      Exit Quiz
                    </Button>
                    <Button 
                      className="bg-primary text-primary-foreground"
                      onClick={handleNext}
                      disabled={selectedAnswer === null}
                    >
                      {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default QuizzesModule;