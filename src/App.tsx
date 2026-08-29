import React, { useState, useMemo, useEffect } from 'react';
import {
  BodyRegion,
  SymptomItem,
  PatientProfile,
  AssessmentResult,
  BiologicalSex,
} from './types';
import { Navbar } from './components/Navbar';
import { BodyMap } from './components/BodyMap';
import { SymptomSelector } from './components/SymptomSelector';
import { PatientContextForm } from './components/PatientContextForm';
import { RedFlagAlert } from './components/RedFlagAlert';
import { AssessmentReport } from './components/AssessmentReport';
import { AIAssistantChat } from './components/AIAssistantChat';
import { VrindavanDirectory } from './components/VrindavanDirectory';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import {
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  PhoneCall,
  Activity,
  Heart,
  MessageSquare,
  Flame,
  Info,
} from 'lucide-react';

const DEFAULT_PROFILE: PatientProfile = {
  age: 32,
  ageGroup: 'adult',
  biologicalSex: 'male',
  isPregnant: false,
  symptomsDuration: '1-3 days',
  severityScale: 4,
  onset: 'gradual',
  fever: false,
  temperature: undefined,
  preExistingConditions: [],
  notes: '',
};

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeView, setActiveView] = useState<'checker' | 'directory' | 'report'>('checker');
  const [currentStep, setCurrentStep] = useState<1 | 2>(1); // Step 1: Select symptoms, Step 2: Patient Context

  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomItem[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(DEFAULT_PROFILE);

  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [showFollowUpChat, setShowFollowUpChat] = useState(false);

  const isHindi = language === 'hi';

  // Compute selected count per body region
  const selectedSymptomRegionCounts = useMemo(() => {
    const counts: Record<BodyRegion, number> = {
      head: 0,
      eyes_ent: 0,
      neck: 0,
      chest: 0,
      abdomen: 0,
      pelvis: 0,
      spine_back: 0,
      arms_hands: 0,
      legs_feet: 0,
      skin_general: 0,
    };
    for (const s of selectedSymptoms) {
      if (counts[s.bodyRegion] !== undefined) {
        counts[s.bodyRegion]++;
      }
    }
    return counts;
  }, [selectedSymptoms]);

  // Identify red flag symptoms
  const redFlagSymptoms = useMemo(() => {
    return selectedSymptoms.filter((s) => s.isRedFlag);
  }, [selectedSymptoms]);

  // Toggle symptom selection
  const handleToggleSymptom = (symptom: SymptomItem) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.some((s) => s.id === symptom.id);
      if (exists) {
        return prev.filter((s) => s.id !== symptom.id);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // Reset entire form
  const handleReset = () => {
    setSelectedSymptoms([]);
    setSelectedRegion(null);
    setPatientProfile(DEFAULT_PROFILE);
    setAssessment(null);
    setCurrentStep(1);
    setActiveView('checker');
    setShowFollowUpChat(false);
    setAssessmentError(null);
  };

  // Trigger Assessment API call
  const handleRunAssessment = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsAssessing(true);
    setAssessmentError(null);

    try {
      const response = await fetch('/api/assess-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          patientProfile,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Assessment service failed');
      }

      const data = await response.json();
      setAssessment(data.assessment);
      setActiveView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Assessment error:', err);
      setAssessmentError(
        isHindi
          ? 'मूल्यांकन तैयार करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Failed to complete AI medical triage. Please check your network and retry.'
      );
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'checker' && assessment) {
            setActiveView('report');
          }
        }}
        onReset={handleReset}
        hasSelectedSymptoms={selectedSymptoms.length > 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Critical Red Flag Banner if applicable */}
        {redFlagSymptoms.length > 0 && (
          <div className="mb-6">
            <RedFlagAlert redFlagSymptoms={redFlagSymptoms} language={language} />
          </div>
        )}

        {/* VIEW 1: SYMPTOM CHECKER & STEP FLOW */}
        {activeView === 'checker' && (
          <div className="space-y-6">
            {/* Step Progress Tracker Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    currentStep === 1
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>{isHindi ? 'शारीरिक अंग व लक्षण' : 'Body Map & Symptoms'}</span>
                </button>

                <div className="w-4 h-0.5 bg-slate-200 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => {
                    if (selectedSymptoms.length > 0) setCurrentStep(2);
                  }}
                  disabled={selectedSymptoms.length === 0}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-blue-600 text-white shadow-xs'
                      : selectedSymptoms.length > 0
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'opacity-50 cursor-not-allowed text-slate-400 bg-slate-50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>{isHindi ? 'मरीज का संदर्भ व तीव्रता' : 'Patient Context & Severity'}</span>
                </button>
              </div>

              {/* Selected Count Indicator & Next CTA */}
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {selectedSymptoms.length} {isHindi ? 'लक्षण चयनित' : 'symptoms selected'}
                  </span>
                </div>

                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={selectedSymptoms.length === 0}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                  >
                    <span>{isHindi ? 'आगे बढ़ें (Next)' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRunAssessment}
                    disabled={isAssessing}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isAssessing ? (isHindi ? 'मूल्यांकन जारी...' : 'Analyzing...') : (isHindi ? 'AI मूल्यांकन प्राप्त करें' : 'Get AI Assessment')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error Message if API fails */}
            {assessmentError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs sm:text-sm text-red-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{assessmentError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunAssessment}
                  className="font-bold underline text-red-900 hover:text-red-950"
                >
                  {isHindi ? 'पुनः प्रयास करें' : 'Retry'}
                </button>
              </div>
            )}

            {/* STEP 1: INTERACTIVE BODY MAP & SYMPTOM SELECTOR DUAL COLUMN */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column: Interactive Vector Body Map */}
                <div className="lg:col-span-6 flex flex-col">
                  <BodyMap
                    selectedRegion={selectedRegion}
                    onSelectRegion={(region) => setSelectedRegion(region)}
                    selectedSymptomRegionCounts={selectedSymptomRegionCounts}
                    language={language}
                    biologicalSex={patientProfile.biologicalSex}
                    onToggleSex={(sex) => setPatientProfile((p) => ({ ...p, biologicalSex: sex }))}
                  />
                </div>

                {/* Right Column: Symptoms Browser & Search */}
                <div className="lg:col-span-6 flex flex-col">
                  <SymptomSelector
                    selectedRegion={selectedRegion}
                    onSelectRegion={setSelectedRegion}
                    selectedSymptoms={selectedSymptoms}
                    onToggleSymptom={handleToggleSymptom}
                    language={language}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PATIENT CONTEXT & ASSESSMENT TRIGGER */}
            {currentStep === 2 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <PatientContextForm
                  profile={patientProfile}
                  onChangeProfile={setPatientProfile}
                  language={language}
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{isHindi ? 'वापस: लक्षण बदलें' : 'Back: Edit Symptoms'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunAssessment}
                    disabled={isAssessing}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:opacity-95 text-white font-black rounded-xl text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isAssessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isHindi ? 'AI नैदानिक मूल्यांकन तैयार हो रहा है...' : 'Generating Clinical AI Triage...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>{isHindi ? 'पूर्ण नैदानिक ट्रायज रिपोर्ट देखें' : 'Generate Clinical Triage Report'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CLINICAL ASSESSMENT REPORT VIEW */}
        {activeView === 'report' && assessment && (
          <div className="space-y-6">
            <AssessmentReport
              assessment={assessment}
              patientProfile={patientProfile}
              symptoms={selectedSymptoms}
              language={language}
              onNewAssessment={handleReset}
              onOpenDirectory={() => setActiveView('directory')}
              onOpenFollowUpChat={() => setShowFollowUpChat(true)}
            />
          </div>
        )}

        {/* VIEW 3: VRINDAVAN HEALTHCARE DIRECTORY VIEW */}
        {activeView === 'directory' && (
          <div className="space-y-6">
            <VrindavanDirectory
              language={language}
              onClose={() => setActiveView(assessment ? 'report' : 'checker')}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for AI Chat or Assistant Drawer */}
      {showFollowUpChat && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl">
            <AIAssistantChat
              assessment={assessment}
              patientProfile={patientProfile}
              symptoms={selectedSymptoms}
              language={language}
              onClose={() => setShowFollowUpChat(false)}
            />
          </div>
        </div>
      )}

      {/* Persistent Floating Chat Trigger when on Report or Checker with symptoms */}
      {!showFollowUpChat && (
        <button
          type="button"
          onClick={() => setShowFollowUpChat(true)}
          className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 bg-gradient-to-tr from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-4 py-3 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-extrabold">
            {isHindi ? 'AI डॉक्टर से पूछें' : 'Ask AI Doctor'}
          </span>
        </button>
      )}

      {/* PWA Offline Indicator and Install Prompt */}
      <PWAInstallBanner language={language} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Vrindavan Symptom Checker</span>
            <span>•</span>
            <span>Clinical Triage System</span>
          </div>
          <div>
            {isHindi
              ? 'आपातकालीन स्थिति में तुरंत 108 या 112 डायल करें'
              : 'In case of medical emergencies, dial 108 or 112 immediately'}
          </div>
        </div>
      </footer>
    </div>
  );
}
