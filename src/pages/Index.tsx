import { useState, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { validatePAN, validateAge, validatePinCode, validateSalary } from "@/utils/validators";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeChat = async () => {
      // Create a new chat session
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

      // Insert initial bot message
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
    
    // Store user's message
    await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: sessionId,
          message: answer,
          is_bot: false
        }
      ]);

    // Add user's answer to messages
    setMessages((prev) => [...prev, { text: answer, isBot: false }]);

    // Check if the answer is valid for the current question
    if (question.validation && !question.validation(answer)) {
      const aiResponse = await handleDynamicResponse(answer);
      
      // Store bot's response
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

    // Store the valid answer
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));

    // Update session with the new answer
    await supabase
      .from('chat_sessions')
      .update({ [question.id]: answer })
      .eq('id', sessionId);

    // Move to next question if available
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = questions[currentQuestion + 1];
      
      // Store next bot question
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
      // Mark session as completed
      await supabase
        .from('chat_sessions')
        .update({ completed: true })
        .eq('id', sessionId);

      const completionMessage = "Thank you for providing all the information! We'll review your application and get back to you soon.";
      
      // Store completion message
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