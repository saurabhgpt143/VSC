import React from 'react';
import { PatientProfile, BiologicalSex } from '../types';
import { PRE_EXISTING_CONDITIONS_LIST } from '../data/symptomsData';
import { User, Heart, Thermometer, Clock, AlertCircle, Activity, Shield } from 'lucide-react';

interface PatientContextFormProps {
  profile: PatientProfile;
  onChangeProfile: (profile: PatientProfile) => void;
  language: 'en' | 'hi';
}

export const PatientContextForm: React.FC<PatientContextFormProps> = ({
  profile,
  onChangeProfile,
  language,
}) => {
  const isHindi = language === 'hi';

  const handleFieldChange = (field: keyof PatientProfile, value: any) => {
    onChangeProfile({
      ...profile,
      [field]: value,
    });
  };

  const toggleCondition = (conditionId: string) => {
    const current = profile.preExistingConditions || [];
    const exists = current.includes(conditionId);
    const updated = exists
      ? current.filter((c) => c !== conditionId)
      : [...current, conditionId];
    handleFieldChange('preExistingConditions', updated);
  };

  const getSeverityLabel = (val: number) => {
    if (val <= 3) return { label: isHindi ? 'हल्का (Mild)' : 'Mild Discomfort', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 6) return { label: isHindi ? 'मध्यम (Moderate)' : 'Moderate Distress', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (val <= 8) return { label: isHindi ? 'तीव्र (Severe)' : 'Severe Pain', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: isHindi ? 'असहनीय / गंभीर (Extreme / Critical)' : 'Extreme / Critical Pain', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const severityBadge = getSeverityLabel(profile.severityScale);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-900 text-base">
            {isHindi ? 'मरीज का विवरण व स्वास्थ्य संदर्भ' : 'Patient Demographics & Clinical Context'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {isHindi
            ? 'सटीक नैदानिक ट्रायज मूल्यांकन के लिए यह जानकारी महत्वपूर्ण है।'
            : 'Crucial for accurate clinical triage evaluation and tailored recommendations.'}
        </p>
      </div>

      {/* Basic Demographics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Age */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {isHindi ? 'आयु (वर्ष)' : 'Patient Age'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="120"
              value={profile.age}
              onChange={(e) => {
                const age = Number(e.target.value) || 0;
                let ageGroup: PatientProfile['ageGroup'] = 'adult';
                if (age < 1) ageGroup = 'infant';
                else if (age <= 12) ageGroup = 'child';
                else if (age <= 18) ageGroup = 'teen';
                else if (age >= 65) ageGroup = 'senior';
                onChangeProfile({ ...profile, age, ageGroup });
              }}
              className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {profile.ageGroup}
            </span>
          </div>
        </div>

        {/* Biological Sex */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {isHindi ? 'जैविक लिंग (Biological Sex)' : 'Biological Sex'}
          </label>
          <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs w-full">
            {(['male', 'female', 'other'] as BiologicalSex[]).map((sex) => (
              <button
                key={sex}
                type="button"
                onClick={() => handleFieldChange('biologicalSex', sex)}
                className={`flex-1 py-2 rounded-lg font-medium capitalize transition-all ${
                  profile.biologicalSex === sex
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sex === 'male' ? (isHindi ? 'पुरुष' : 'Male') : sex === 'female' ? (isHindi ? 'महिला' : 'Female') : (isHindi ? 'अन्य' : 'Other')}
              </button>
            ))}
          </div>
        </div>

        {/* Pregnancy Status (if female) */}
        {profile.biologicalSex === 'female' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isHindi ? 'गर्भावस्था की स्थिति' : 'Pregnancy Status'}
            </label>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs w-full">
              <button
                type="button"
                onClick={() => handleFieldChange('isPregnant', false)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  !profile.isPregnant
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'नहीं' : 'Not Pregnant'}
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('isPregnant', true)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  profile.isPregnant
                    ? 'bg-rose-50 text-rose-800 shadow-xs font-bold border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'गर्भवती' : 'Pregnant'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Symptom Progression & Severity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-100">
        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'लक्षणों की अवधि (कितने समय से हैं)' : 'Symptom Duration'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'Less than 24 hrs', label: isHindi ? '< 24 घंटे' : '< 24 hours' },
              { id: '1-3 days', label: isHindi ? '1-3 दिन' : '1-3 days' },
              { id: '4-7 days', label: isHindi ? '4-7 दिन' : '4-7 days' },
              { id: '1-2 weeks', label: isHindi ? '1-2 सप्ताह' : '1-2 weeks' },
              { id: 'More than 2 weeks', label: isHindi ? '> 2 सप्ताह (दीर्घकालिक)' : '> 2 weeks' },
            ].map((dur) => (
              <button
                key={dur.id}
                type="button"
                onClick={() => handleFieldChange('symptomsDuration', dur.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  profile.symptomsDuration === dur.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Onset Speed */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            {isHindi ? 'लक्षणों की शुरुआत कैसे हुई?' : 'How Did Symptoms Start?'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sudden', label: isHindi ? 'अचानक (Sudden)' : 'Sudden' },
              { id: 'gradual', label: isHindi ? 'धीरे-धीरे (Gradual)' : 'Gradual' },
              { id: 'intermittent', label: isHindi ? 'रुक-रुक कर (Intermittent)' : 'Intermittent' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFieldChange('onset', item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  profile.onset === item.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pain / Distress Severity Rating (1-10 Slider) */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">
            {isHindi ? 'दर्द व परेशानी की तीव्रता (स्केल 1-10)' : 'Overall Pain / Distress Severity (Scale 1-10)'}
          </label>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityBadge.color}`}>
            {profile.severityScale}/10 • {severityBadge.label}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={profile.severityScale}
          onChange={(e) => handleFieldChange('severityScale', Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
          <span>1 ({isHindi ? 'हल्का' : 'Mild'})</span>
          <span>5 ({isHindi ? 'मध्यम' : 'Moderate'})</span>
          <span>8 ({isHindi ? 'तीव्र' : 'Severe'})</span>
          <span>10 ({isHindi ? 'असहनीय' : 'Worst Possible'})</span>
        </div>
      </div>

      {/* Fever & Temperature Check */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">
              {isHindi ? 'क्या बुखार या शरीर गर्म महसूस हो रहा है?' : 'Do you have fever or elevated temperature?'}
            </div>
            <div className="text-[11px] text-slate-500">
              {isHindi ? 'थर्मामीटर रीडिंग दर्ज कर सकते हैं' : 'Indicate if measured or suspected'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={profile.fever}
              onChange={(e) => handleFieldChange('fever', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>

          {profile.fever && (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.1"
                min="96"
                max="108"
                placeholder="100.4"
                value={profile.temperature || ''}
                onChange={(e) => handleFieldChange('temperature', parseFloat(e.target.value) || undefined)}
                className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500"
              />
              <span className="text-xs font-semibold text-slate-500">°F</span>
            </div>
          )}
        </div>
      </div>

      {/* Pre-existing Conditions Multi-select */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{isHindi ? 'पूर्व मौजूदा स्वास्थ्य स्थितियां (यदि कोई हो)' : 'Pre-existing Medical Conditions'}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRE_EXISTING_CONDITIONS_LIST.map((cond) => {
            const isChecked = profile.preExistingConditions?.includes(cond.id);
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => toggleCondition(cond.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isChecked
                    ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {cond.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Freeform Notes / Medications */}
      <div className="pt-3 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {isHindi ? 'अतिरिक्त विवरण या दवाएं (वैकल्पिक)' : 'Additional Notes, Ongoing Medications or Allergies (Optional)'}
        </label>
        <textarea
          rows={2}
          value={profile.notes || ''}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          placeholder={
            isHindi
              ? 'उदा: हाल ही में यात्रा की, कोई विशिष्ट एलर्जी या वर्तमान में ली जाने वाली दवाएं...'
              : 'e.g. recent travel history, ongoing BP tablets, known penicillin allergy...'
          }
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
        />
      </div>
    </div>
  );
};
