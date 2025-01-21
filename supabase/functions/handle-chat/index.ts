import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, currentQuestion, applicationData } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    let prompt;
    if (currentQuestion === 'post_application') {
      // Create a context-aware prompt for post-application questions
      prompt = `You are a helpful loan service assistant. The user has completed their loan application with the following details:
      ${applicationData ? JSON.stringify(applicationData, null, 2) : 'Application data not available'}
      
      Please provide helpful information about our loan services, policies, and general guidance. 
      Keep responses professional, friendly, and focused on general loan information without making promises about approval or specific terms.
      
      User question: ${message}`;
    } else {
      // Use the existing prompt for application process
      prompt = `You are a helpful loan application assistant. You are currently asking the user about ${currentQuestion}. 
      If the user asks something unrelated, politely acknowledge their question and guide them back to providing the required information.
      Keep responses professional, concise, and friendly. Don't provide specific loan terms or conditions.
      
      User message: ${message}`;
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in handle-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, but I'm having trouble processing that. Could you please try again?" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});