import React, { useState } from 'react';
import { AssessmentResult, PatientProfile, SymptomItem, TriageUrgency } from '../types';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Stethoscope,
  PhoneCall,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Info,
  Utensils,
  Ban,
  Droplets,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react';

interface AssessmentReportProps {
  assessment: AssessmentResult;
  patientProfile: PatientProfile;
  symptoms: SymptomItem[];
  language: 'en' | 'hi';
  onNewAssessment: () => void;
  onOpenDirectory: () => void;
  onOpenFollowUpChat: () => void;
}

export const AssessmentReport: React.FC<AssessmentReportProps> = ({
  assessment,
  patientProfile,
  symptoms,
  language,
  onNewAssessment,
  onOpenDirectory,
  onOpenFollowUpChat,
}) => {
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const isHindi = language === 'hi';

  const getUrgencyTheme = (urgency: TriageUrgency) => {
    switch (urgency) {
      case 'EMERGENCY':
        return {
          bg: 'bg-red-500 text-white',
          badgeBg: 'bg-red-100 text-red-900 border-red-200',
          borderColor: 'border-red-500',
          iconColor: 'text-red-500',
          title: isHindi ? 'आपातकालीन चिकित्सा आवश्यक (Immediate Emergency)' : 'Immediate Emergency Care Required',
          actionText: isHindi ? 'बिना देरी किए तुरंत 108 एम्बुलेंस या नजदीकी अस्पताल इमरजेंसी जाएं' : 'Call 108 / 112 immediately or proceed to the nearest hospital Emergency Room.',
        };
      case 'URGENT':
        return {
          bg: 'bg-amber-500 text-white',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
          borderColor: 'border-amber-500',
          iconColor: 'text-amber-500',
          title: isHindi ? 'शीघ्र चिकित्सकीय परामर्श (Urgent Care)' : 'Urgent Medical Attention Recommended',
          actionText: isHindi ? 'अगले 12 से 24 घंटों के भीतर किसी डॉक्टर या क्लिनिक में दिखाएं' : 'Visit a physician or urgent care center within 12 to 24 hours.',
        };
      case 'ROUTINE':
        return {
          bg: 'bg-blue-600 text-white',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-600',
          title: isHindi ? 'सामान्य डॉक्टर परामर्श (Routine Clinic Visit)' : 'Routine Clinical Evaluation',
          actionText: isHindi ? 'सुविधाजनक समय पर 2-3 दिनों में अपने डॉक्टर से परामर्श लें' : 'Schedule an outpatient appointment with a general physician.',
        };
      case 'SELF_CARE':
      default:
        return {
          bg: 'bg-emerald-600 text-white',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          borderColor: 'border-emerald-500',
          iconColor: 'text-emerald-600',
          title: isHindi ? 'घर पर देखभाल एवं निगरानी (Self-Care & Monitoring)' : 'Self-Care & Home Monitoring',
          actionText: isHindi ? 'आराम करें, पर्याप्त तरल पदार्थ लें और लक्षणों की निगरानी करें' : 'Manage symptoms with conservative home measures and rest.',
        };
    }
  };

  const theme = getUrgencyTheme(assessment.urgency);

  const handleCopyQuestions = () => {
    const text = assessment.doctorQuestions.join('\n• ');
    navigator.clipboard.writeText(`Questions for Doctor:\n• ${text}`);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Urgency Rating */}
      <div className={`rounded-2xl p-6 shadow-sm ${theme.bg} transition-all`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isHindi ? 'ट्रायज परिणाम' : 'Triage Classification'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{assessment.urgencyLabel || theme.title}</h2>
            <p className="text-sm opacity-95 mt-1 max-w-2xl">{theme.actionText}</p>
          </div>

          {/* Quick Action Buttons on Banner */}
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto shrink-0">
            {assessment.urgency === 'EMERGENCY' ? (
              <a
                href="tel:108"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white text-red-600 hover:bg-red-50 font-black px-5 py-3 rounded-xl text-sm shadow-md transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isHindi ? '108 एम्बुलेंस' : 'Call 108 Ambulance'}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={onOpenFollowUpChat}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isHindi ? 'AI से प्रश्न पूछें' : 'Ask AI Follow-Up'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-white/20 transition-all"
              title="Print Summary for Doctor"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'प्रिंट / सेव' : 'Print / Export'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Summary & Patient Specs Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Stethoscope className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-900 text-base">
            {isHindi ? 'नैदानिक मूल्यांकन सारांश' : 'Clinical Assessment Summary'}
          </h3>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          {assessment.summary}
        </p>

        {/* Patient Parameters Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'मरीज प्रोफाइल' : 'Patient'}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
              {patientProfile.age} yrs • {patientProfile.biologicalSex}
              {patientProfile.isPregnant && ' (Pregnant)'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'अवधि व शुरुआत' : 'Duration & Onset'}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
              {patientProfile.symptomsDuration} • {patientProfile.onset}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'दर्द / असुविधा स्तर' : 'Severity Scale'}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <span>{patientProfile.severityScale}/10</span>
              {patientProfile.fever && <span className="text-amber-600 text-xs">🔥 Fever</span>}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'दर्ज लक्षण' : 'Symptoms Reported'}
            </div>
            <div className="text-xs sm:text-sm font-bold text-blue-700 mt-0.5">
              {symptoms.length} {isHindi ? 'लक्षण' : 'conditions selected'}
            </div>
          </div>
        </div>
      </div>

      {/* Differential Considerations Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {isHindi ? 'संभावित नैदानिक विचार (Differential Considerations)' : 'Potential Conditions to Discuss with Doctor'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {isHindi ? 'केवल सूचनार्थ' : 'Differential possibilities'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessment.differentialDiagnoses.map((diff, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">
                    {diff.conditionName}
                  </h4>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      diff.likelihood === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : diff.likelihood === 'Moderate'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {diff.likelihood} {isHindi ? 'संभावना' : 'Likelihood'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {diff.explanation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                {diff.recommendedSpecialist && (
                  <div className="text-indigo-700 font-semibold text-[11px] flex items-center gap-1">
                    <span>👨‍⚕️ {diff.recommendedSpecialist}</span>
                  </div>
                )}
                <div className="text-slate-400 text-[11px]">
                  {diff.matchedSymptoms?.length || 0} {isHindi ? 'लक्षण मेल खाते हैं' : 'matched symptoms'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Action & Red Flags Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Immediate Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              {isHindi ? 'तुरंत उठाए जाने वाले कदम' : 'Recommended Immediate Next Steps'}
            </h4>
          </div>
          <ul className="space-y-2.5">
            {assessment.immediateActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Red Flags to Watch For */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-red-50">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h4 className="font-bold text-sm sm:text-base text-red-900">
              {isHindi ? 'सतर्क रहें: इन लक्षणों पर तुरंत अस्पताल जाएं' : 'Red Flags: When to Seek Immediate ER'}
            </h4>
          </div>
          <ul className="space-y-2.5">
            {assessment.redFlagsToWatch.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dietary Adjustments & Nutrition Strategy */}
      {assessment.dietaryRecommendations && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Utensils className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isHindi ? 'खान-पान व आहार संबंधी परामर्श (Dietary Adjustments)' : 'Diagnosis-Based Dietary Adjustments'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'लक्षणों से शीघ्र राहत और स्वास्थ्य सुधार के लिए खान-पान निर्देश' : 'Nutritional strategies tailored to support rapid physiological recovery'}
                </p>
              </div>
            </div>
            {assessment.dietaryRecommendations.rationale && (
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg hidden md:inline-block max-w-sm text-right truncate">
                {assessment.dietaryRecommendations.rationale}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foods to Eat / Prioritize */}
            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'क्या खाएं और प्राथमिकता दें (Foods to Eat)' : 'Recommended Foods & Fluids to Prioritize'}</span>
              </div>
              <ul className="space-y-2">
                {assessment.dietaryRecommendations.foodsToEat.map((food, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                    <span className="leading-relaxed font-medium">{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>{isHindi ? 'किन चीजों से परहेज करें (Foods to Avoid)' : 'Foods, Irritants & Items to Strictly Avoid'}</span>
              </div>
              <ul className="space-y-2">
                {assessment.dietaryRecommendations.foodsToAvoid.map((avoid, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                    <span className="leading-relaxed font-medium">{avoid}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hydration Strategy Card */}
          {assessment.dietaryRecommendations.hydrationTips?.length > 0 && (
            <div className="bg-sky-50/50 border border-sky-200/80 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-950 font-bold text-sm">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>{isHindi ? 'जलयोजन एवं तरल पदार्थ नियम (Hydration Strategy)' : 'Hydration & Electrolyte Guidelines'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {assessment.dietaryRecommendations.hydrationTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-sky-100">
                    <span className="text-sky-600 font-bold">💧</span>
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rationale note on mobile */}
          {assessment.dietaryRecommendations.rationale && (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-lg p-3 md:hidden">
              <span className="font-semibold text-slate-800">{isHindi ? 'आहार का कारण: ' : 'Nutritional Rationale: '}</span>
              {assessment.dietaryRecommendations.rationale}
            </div>
          )}
        </div>
      )}

      {/* Safe Home Remedies & Supportive Comfort Measures */}
      {assessment.homeRemedies && assessment.homeRemedies.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                <HeartHandshake className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {isHindi ? 'सुरक्षित घरेलू उपचार व देखभाल (Safe Home Remedies)' : 'Evidence-Based Home Remedies & Comfort Measures'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'प्राकृतिक व सुरक्षित उपाय जो प्राथमिक राहत में सहायक हैं' : 'Non-pharmacological supportive therapies to alleviate discomfort safely'}
                </p>
              </div>
            </div>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg hidden sm:inline font-semibold">
              {isHindi ? 'चिकित्सकीय सलाह का पूरक' : 'Supportive Care'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessment.homeRemedies.map((remedy, idx) => (
              <div
                key={idx}
                className="bg-amber-50/20 hover:bg-amber-50/40 border border-amber-200/70 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors"
              >
                <div>
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {remedy.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pl-7">
                    {remedy.instructions}
                  </p>
                </div>

                {remedy.safetyNote && (
                  <div className="pt-2 border-t border-amber-200/50 flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded-lg">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold">{isHindi ? 'सावधानी: ' : 'Caution: '}</strong>{remedy.safetyNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for Doctor & Safe Home Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Questions to Ask Doctor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-sm sm:text-base text-slate-900">
                {isHindi ? 'डॉक्टर से क्या पूछें?' : 'Questions to Ask Your Doctor'}
              </h4>
            </div>
            <button
              type="button"
              onClick={handleCopyQuestions}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg transition-all"
            >
              {copiedQuestions ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">{isHindi ? 'कॉपी हो गया' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
          <ul className="space-y-2">
            {assessment.doctorQuestions.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-blue-600 font-bold">Q{idx + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Healthcare Connect Box */}
        <div className="bg-radial from-blue-50/70 to-indigo-50/50 border border-blue-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-700" />
              <h4 className="font-bold text-base text-blue-950">
                {isHindi ? 'स्थानिक चिकित्सा संसाधन एवं अस्पताल' : 'Local Healthcare Connect'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? 'सरकारी मेडिकल कॉलेज, जिला अस्पताल एवं 24x7 आपातकालीन एम्बुलेंस सुविधाएं आपके क्षेत्र में उपलब्ध हैं।'
                : 'Tertiary medical colleges, district hospitals, and 24x7 emergency ambulance hotlines are accessible for your location.'}
            </p>

            <div className="mt-3 bg-white/90 border border-blue-200/70 rounded-xl p-3 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Emergency Medical Facility</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">24x7 Open</span>
              </div>
              <div className="text-slate-600">Verified regional hospital network & trauma services</div>
              <div className="flex items-center gap-2 pt-1 font-bold text-blue-700">
                <PhoneCall className="w-3.5 h-3.5" />
                <a href="tel:108">Emergency Ambulance: 108</a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={onOpenDirectory}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
            >
              <span>{isHindi ? 'सभी अस्पताल व निर्देशिका देखें' : 'View Location Directory'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer Box */}
      <div className="bg-slate-100/90 border border-slate-200/80 rounded-xl p-4 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">
            {isHindi ? 'चिकित्सीय अस्वीकरण (Medical Disclaimer): ' : 'Medical Disclaimer: '}
          </span>
          {assessment.disclaimer ||
            'This assessment is an informational clinical decision aid and does not constitute a formal doctor-patient relationship, medical diagnosis, or prescription. Always seek the advice of a qualified healthcare professional.'}
        </div>
      </div>

      {/* Bottom Floating Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onNewAssessment}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all"
        >
          {isHindi ? '← नया लक्षण परीक्षण शुरू करें' : '← Start New Assessment'}
        </button>

        <button
          type="button"
          onClick={onOpenFollowUpChat}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isHindi ? 'AI डॉक्टर से चैट करें' : 'Chat with AI Assistant'}</span>
        </button>
      </div>
    </div>
  );
};
