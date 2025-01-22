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
import { CelebrationOverlay } from "@/components/CelebrationOverlay";

type Question = {
  id: string;
  text: string;
  type: string;
  validation: (value: string) => { isValid: boolean; message: string };
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
    validation: (value) => ({ 
      isValid: validateAge(new Date(value)), 
      message: "You must be at least 18 years old" 
    }),
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
    id: "company_name",
    text: "What is the name of the company you work for?",
    type: "text",
    validation: (value) => {
      const isValid = value.length >= 2 && value.length <= 100;
      return { 
        isValid, 
        message: isValid ? "" : "Company name should be between 2 and 100 characters" 
      };
    },
    placeholder: "Enter company name",
    format: "2-100 characters"
  },
  {
    id: "office_address_line1",
    text: "Please enter your office address line 1 (Building name, Street):",
    type: "text",
    validation: (value) => {
      const isValid = value.length >= 5 && value.length <= 100;
      return {
        isValid,
        message: isValid ? "" : "Address should be between 5 and 100 characters"
      };
    },
    placeholder: "Building name, Street",
    format: "5-100 characters"
  },
  {
    id: "office_address_line2",
    text: "Please enter address line 2 (Area, Landmark):",
    type: "text",
    validation: (value) => {
      const isValid = value.length >= 5 && value.length <= 100;
      return {
        isValid,
        message: isValid ? "" : "Address should be between 5 and 100 characters"
      };
    },
    placeholder: "Area, Landmark",
    format: "5-100 characters"
  },
  {
    id: "office_city",
    text: "Please enter your office city:",
    type: "text",
    validation: validateCity,
    placeholder: "Enter city name",
    format: "Letters only, 2-50 characters"
  },
  {
    id: "office_state",
    text: "Please enter your office state:",
    type: "text",
    validation: validateCity,
    placeholder: "Enter state name",
    format: "Letters only, 2-50 characters"
  },
  {
    id: "office_pincode",
    text: "Please enter your office PIN code:",
    type: "text",
    validation: validatePinCode,
    placeholder: "Enter 6-digit PIN code",
    format: "6 digits starting with non-zero"
  },
  {
    id: "office_email",
    text: "Please enter your official email address:",
    type: "email",
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      return {
        isValid,
        message: isValid ? "" : "Please enter a valid email address"
      };
    },
    placeholder: "name@company.com",
    format: "Valid email address"
  }
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isApplicationComplete, setIsApplicationComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [lastCelebrationSection, setLastCelebrationSection] = useState("");
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

  const handlePostApplicationQuestion = async (question: string) => {
    if (!sessionId) return;

    await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: sessionId,
          message: question,
          is_bot: false
        }
      ]);

    setMessages((prev) => [...prev, { text: question, isBot: false }]);

    try {
      const response = await fetch('/functions/v1/handle-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          currentQuestion: 'post_application',
          applicationData: answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            message: data.response,
            is_bot: true
          }
        ]);

      setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = "I apologize, but I'm having trouble processing your question. Please try again later.";
      
      await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            message: errorMessage,
            is_bot: true
          }
        ]);

      setMessages((prev) => [...prev, { text: errorMessage, isBot: true }]);
    }
  };

  const handleSubmit = async (answer: string) => {
    if (!sessionId) return;

    if (isApplicationComplete) {
      await handlePostApplicationQuestion(answer);
      return;
    }

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

    const validationResult = question.validation(answer);

    if (!validationResult.isValid) {
      const errorMessage = `I'm sorry, but the value "${answer}" is not valid. ${validationResult.message}`;
      
      await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            message: errorMessage,
            is_bot: true
          }
        ]);

      setMessages((prev) => [...prev, { text: errorMessage, isBot: true }]);
      
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: validationResult.message,
      });
      return;
    }

    setAnswers((prev) => ({ ...prev, [question.id]: answer }));

    await supabase
      .from('chat_sessions')
      .update({ [question.id]: answer })
      .eq('id', sessionId);

    const currentSection = getSectionFromQuestion(currentQuestion);
    const nextSection = getSectionFromQuestion(currentQuestion + 1);

    if (currentSection !== nextSection && currentSection !== lastCelebrationSection) {
      setCelebrationMessage(`Great job! You've completed the ${currentSection} section!`);
      setShowCelebration(true);
      setLastCelebrationSection(currentSection);
      setTimeout(() => setShowCelebration(false), 5000);
    }

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

      const completionMessage = "Thank you for providing all the information! We'll review your application and get back to you soon. Feel free to ask any questions you have about our loan services.";
      
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
      setIsApplicationComplete(true);
      setCelebrationMessage("Congratulations! Your loan application is complete! 🎉");
      setShowCelebration(true);
      setLastCelebrationSection("completion");
    }
  };

  const getSectionFromQuestion = (questionIndex: number) => {
    if (questionIndex < 4) return "Personal Details";
    if (questionIndex < 5) return "Employment Details";
    if (questionIndex < 10) return "Office Address";
    if (questionIndex < 11) return "Email Verification";
    return "Loan Summary";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showCelebration && <CelebrationOverlay message={celebrationMessage} />}
      <div className="fixed top-0 left-0 right-0 z-50">
        <LoanHeader />
        <div className="bg-white shadow-md">
          <LoanProgress currentStep={currentQuestion} />
        </div>
      </div>
      <div className="p-4 mt-[160px]">
        <div className="mx-auto max-w-2xl bg-white rounded-xl shadow-lg p-4 min-h-[60vh] flex flex-col animate-fade-in">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isBot={message.isBot}
                className="animate-message-fade-in"
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