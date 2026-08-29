import React, { useState, useRef, useEffect } from 'react';
import { AssessmentResult, PatientProfile, SymptomItem, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, AlertCircle, X, RefreshCw, MessageSquare } from 'lucide-react';

interface AIAssistantChatProps {
  assessment: AssessmentResult | null;
  patientProfile: PatientProfile;
  symptoms: SymptomItem[];
  language: 'en' | 'hi';
  onClose: () => void;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({
  assessment,
  patientProfile,
  symptoms,
  language,
  onClose,
}) => {
  const isHindi = language === 'hi';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: isHindi
        ? `नमस्ते! मैं आपका क्लिनिकल AI सहायक हूँ। आपके हालिया लक्षण मूल्यांकन के संदर्भ में, आप मुझसे कोई भी प्रश्न पूछ सकते हैं (जैसे: क्या घरेलू उपाय सुरक्षित हैं, डॉक्टर से क्या पूछें, या किन सावधानियों का पालन करें)।`
        : `Hello! I am your Clinical Medical AI Assistant. Based on your symptom evaluation, feel free to ask any clarifying questions regarding home care safety, tests your physician might suggest, or when to seek immediate attention.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          assessmentContext: {
            urgency: assessment?.urgency,
            urgencyLabel: assessment?.urgencyLabel,
            symptoms: symptoms.map((s) => s.name),
            differentialDiagnoses: assessment?.differentialDiagnoses,
          },
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Chat service error');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || (isHindi ? 'मुझे उत्तर देने में त्रुटि हुई।' : 'Error processing response.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        text: isHindi
          ? 'माफ़ कीजिए, सर्वर से संपर्क नहीं हो पाया। कृपया आराम करें, पर्याप्त तरल पदार्थ लें और समस्या बढ़ने पर डॉक्टर से संपर्क करें।'
          : 'I apologize, the assistant service is temporarily unreachable. Please rest, maintain hydration, and consult a doctor if symptoms worsen.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = isHindi
    ? [
        'खान-पान में मुझे क्या खाना चाहिए और क्या परहेज करना चाहिए?',
        'क्या गर्म पानी, भाप और घरेलू काढ़ा लेना सुरक्षित है?',
        'मुझे डॉक्टर के पास जाने से पहले क्या सावधानी रखनी चाहिए?',
        'क्या ये लक्षण खान-पान या वर्तमान स्थान के वातावरण से जुड़े हैं?',
      ]
    : [
        'What specific foods and drinks should I avoid right now?',
        'What safe home remedies can provide immediate relief?',
        'What diagnostic tests might the physician recommend?',
        'Could local environmental factors in my current location be triggering this?',
      ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-[580px] max-h-[85vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-radial from-blue-600 to-indigo-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
              <span>{isHindi ? 'क्लिनिकल AI सहायक' : 'Clinical AI Medical Assistant'}</span>
              <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                Online
              </span>
            </h3>
            <p className="text-[11px] text-blue-100 opacity-90">
              {isHindi ? 'लक्षणों व सावधानियों पर केंद्रित परामर्श' : 'Ask follow-up medical & triage questions'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 border border-blue-200 shadow-xs'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div
                className={`text-[10px] mt-1.5 text-right ${
                  msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-white text-blue-700 border border-blue-200 flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-400 text-[11px]">
                  {isHindi ? 'AI उत्तर तैयार कर रहा है...' : 'Analyzing clinical guidance...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          {isHindi ? 'सुझाव:' : 'Suggested:'}
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-all shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            isHindi
              ? 'अपने लक्षणों के बारे में कोई भी प्रश्न पूछें...'
              : 'Type a question about symptoms, home safety, or medications...'
          }
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
