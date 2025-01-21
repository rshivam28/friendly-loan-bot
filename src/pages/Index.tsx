import { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { 
  validateName, 
  validateGender, 
  validateAge, 
  validatePAN, 
  validateEmploymentType, 
  validateSalary, 
  validatePinCode, 
  validateCity 
} from "@/utils/validators";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoanHeader } from "@/components/LoanHeader";
import { LoanProgress } from "@/components/LoanProgress";
import { VoiceAssistant } from "@/components/VoiceAssistant";

type Question = {
  id: string;
  text: string;
  type: string;
  validation: (value: string) => { isValid: boolean; message: string } | boolean;
  placeholder: string;
  format?: string;
};

const questions: Question[] = [
  { 
    id: "name", 
    text: "Hello! I'm here to help you with your personal loan application. First, could you please tell me your full name (First Name Last Name)?", 
    type: "text", 
    validation: validateName,
    placeholder: "e.g., John Smith",
    format: "First Name Last Name"
  },
  { 
    id: "gender", 
    text: "What is your gender?", 
    type: "text", 
    validation: validateGender,
    placeholder: "Male/Female/Other",
    format: "Enter Male, Female, or Other"
  },
  { 
    id: "date_of_birth", 
    text: "Please enter your date of birth (You must be at least 18 years old):", 
    type: "date", 
    validation: (value) => validateAge(new Date(value)),
    placeholder: "YYYY-MM-DD",
    format: "YYYY-MM-DD"
  },
  { 
    id: "pan_card", 
    text: "Please provide your PAN card number:", 
    type: "text", 
    validation: validatePAN,
    placeholder: "ABCDE1234F",
    format: "5 Letters + 4 Numbers + 1 Letter"
  },
  { 
    id: "employment_type", 
    text: "What is your employment type?", 
    type: "text", 
    validation: validateEmploymentType,
    placeholder: "Salaried/Self-employed",
    format: "Enter Salaried or Self-employed"
  },
  { 
    id: "monthly_salary", 
    text: "What is your net monthly salary? (Min: ₹10,000, Max: ₹1,00,00,000)", 
    type: "number", 
    validation: validateSalary,
    placeholder: "Enter amount in INR",
    format: "Enter amount between 10,000 and 1,00,00,000"
  },
  { 
    id: "pin_code", 
    text: "Please enter your PIN code:", 
    type: "text", 
    validation: validatePinCode,
    placeholder: "Enter 6-digit PIN code",
    format: "6 digits starting with non-zero"
  },
  { 
    id: "city", 
    text: "Finally, please confirm your city:", 
    type: "text", 
    validation: validateCity,
    placeholder: "Enter city name",
    format: "Letters only, 2-50 characters"
  },
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeChat = async () => {
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([{}])
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating chat session:', sessionError);
        return;
      }

      setSessionId(session.id);

      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: session.id,
            message: questions[0].text,
            is_bot: true
          }
        ]);

      if (messageError) {
        console.error('Error inserting initial message:', messageError);
        return;
      }

      setMessages([{ text: questions[0].text, isBot: true }]);
    };

    initializeChat();
  }, []);

  const handleDynamicResponse = async (userMessage: string) => {
    try {
      const response = await fetch('/functions/v1/handle-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          currentQuestion: questions[currentQuestion].id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I apologize, but I'm having trouble processing that. Could you please answer the current question?";
    }
  };

  const handleSubmit = async (answer: string) => {
    if (!sessionId) return;

    const question = questions[currentQuestion];
    
    await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: sessionId,
          message: answer,
          is_bot: false
        }
      ]);

    setMessages((prev) => [...prev, { text: answer, isBot: false }]);

    if (question.validation && !question.validation(answer)) {
      const aiResponse = await handleDynamicResponse(answer);
      
      await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            message: aiResponse,
            is_bot: true
          }
        ]);

      setMessages((prev) => [...prev, { text: aiResponse, isBot: true }]);
      
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please check your input and try again.",
      });
      return;
    }

    setAnswers((prev) => ({ ...prev, [question.id]: answer }));

    await supabase
      .from('chat_sessions')
      .update({ [question.id]: answer })
      .eq('id', sessionId);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = questions[currentQuestion + 1];
      
      await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            message: nextQuestion.text,
            is_bot: true
          }
        ]);

      setMessages((prev) => [...prev, { text: nextQuestion.text, isBot: true }]);
      setCurrentQuestion((prev) => prev + 1);
    } else {
      await supabase
        .from('chat_sessions')
        .update({ completed: true })
        .eq('id', sessionId);

      const completionMessage = "Thank you for providing all the information! We'll review your application and get back to you soon.";
      
      await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            message: completionMessage,
            is_bot: true
          }
        ]);

      setMessages((prev) => [...prev, { text: completionMessage, isBot: true }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <LoanHeader />
        <div className="bg-white shadow-md">
          <LoanProgress currentStep={currentQuestion} />
        </div>
      </div>
      <div className="p-4 mt-[160px]">
        <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-lg p-4 min-h-[60vh] flex flex-col">
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
      <VoiceAssistant 
        onMessage={handleSubmit}
        isListening={isListening}
        setIsListening={setIsListening}
      />
    </div>
  );
};

export default Index;