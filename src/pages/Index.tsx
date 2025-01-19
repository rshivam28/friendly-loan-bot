import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { validatePAN, validateAge, validatePinCode, validateSalary } from "@/utils/validators";
import { useToast } from "@/components/ui/use-toast";

type Question = {
  id: string;
  text: string;
  type: string;
  validation?: (value: string) => boolean;
  placeholder: string;
};

const questions: Question[] = [
  { id: "name", text: "Hello! I'm here to help you with your personal loan application. First, could you please tell me your name?", type: "text", placeholder: "Enter your full name" },
  { id: "gender", text: "What is your gender?", type: "text", placeholder: "Male/Female/Other" },
  { id: "dob", text: "Please enter your date of birth (YYYY-MM-DD):", type: "date", validation: (value) => validateAge(new Date(value)), placeholder: "YYYY-MM-DD" },
  { id: "pan", text: "Please provide your PAN card number:", type: "text", validation: validatePAN, placeholder: "ABCDE1234F" },
  { id: "employment", text: "What is your employment type?", type: "text", placeholder: "Salaried/Self-employed" },
  { id: "salary", text: "What is your net monthly salary?", type: "number", validation: validateSalary, placeholder: "Enter amount in INR" },
  { id: "pincode", text: "Please enter your PIN code:", type: "text", validation: validatePinCode, placeholder: "Enter 6-digit PIN code" },
  { id: "city", text: "Finally, please confirm your city:", type: "text", placeholder: "Enter city name" },
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: questions[0].text, isBot: true },
  ]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (answer: string) => {
    const question = questions[currentQuestion];
    
    if (question.validation && !question.validation(answer)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please check your input and try again.",
      });
      return;
    }

    // Add user's answer to messages
    setMessages((prev) => [...prev, { text: answer, isBot: false }]);
    
    // Store the answer
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = questions[currentQuestion + 1];
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: nextQuestion.text, isBot: true }]);
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    } else {
      // Show completion message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Thank you for providing all the information! We'll review your application and get back to you soon.",
            isBot: true,
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-lg p-4 min-h-[80vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isBot={message.isBot}
            />
          ))}
        </div>
        <div className="mt-auto">
          <ChatInput
            onSubmit={handleSubmit}
            placeholder={questions[currentQuestion].placeholder}
            type={questions[currentQuestion].type}
            disabled={currentQuestion >= questions.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;