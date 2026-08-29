export type BodyRegion =
  | 'head'
  | 'eyes_ent'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'pelvis'
  | 'spine_back'
  | 'arms_hands'
  | 'legs_feet'
  | 'skin_general';

export type BodyView = 'front' | 'back';
export type BiologicalSex = 'male' | 'female' | 'other';
export type TriageUrgency = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'SELF_CARE';

export interface SymptomItem {
  id: string;
  name: string;
  hindiName: string;
  bodyRegion: BodyRegion;
  category: string;
  isRedFlag?: boolean;
  commonInVrindavanRegion?: boolean;
  description: string;
  hindiDescription?: string;
  typicalOnset?: string;
  severityDefault?: number; // 1-10
}

export interface PatientProfile {
  age: number;
  ageGroup: 'infant' | 'child' | 'teen' | 'adult' | 'senior';
  biologicalSex: BiologicalSex;
  isPregnant: boolean;
  symptomsDuration: string; // "Less than 24 hrs", "1-3 days", "4-7 days", "1-2 weeks", "More than 2 weeks"
  severityScale: number; // 1 to 10
  onset: 'sudden' | 'gradual' | 'intermittent';
  fever: boolean;
  temperature?: number; // Fahrenheit
  preExistingConditions: string[];
  medications?: string;
  allergies?: string;
  notes?: string;
}

export interface DifferentialDiagnosis {
  conditionName: string;
  likelihood: 'High' | 'Moderate' | 'Low';
  explanation: string;
  matchedSymptoms: string[];
  recommendedSpecialist?: string;
}

export interface DietaryRecommendation {
  foodsToEat: string[];
  foodsToAvoid: string[];
  hydrationTips: string[];
  rationale: string;
}

export interface HomeRemedy {
  title: string;
  instructions: string;
  safetyNote?: string;
}

export interface AssessmentResult {
  urgency: TriageUrgency;
  urgencyLabel: string;
  summary: string;
  primaryConcerns: string[];
  differentialDiagnoses: DifferentialDiagnosis[];
  immediateActions: string[];
  dietaryRecommendations?: DietaryRecommendation;
  homeRemedies?: HomeRemedy[];
  redFlagsToWatch: string[];
  doctorQuestions: string[];
  homeCareTips?: string[];
  disclaimer: string;
  source?: 'gemini' | 'clinical-rules-engine';
  timestamp?: string;
}

export interface PrevalentConditionItem {
  name: string;
  hindiName: string;
  category: 'Gastrointestinal' | 'Vector-Borne / Fever' | 'Heat & Exertion' | 'Respiratory / Allergy' | 'Zoonotic / Bite' | 'General';
  prevalenceLevel: 'High' | 'Moderate' | 'Seasonal Alert';
  triggerFactor: string;
  hindiTriggerFactor: string;
  keySymptoms: string[];
  preventionTips: string[];
  hindiPreventionTips: string[];
  immediateAction: string;
}

export interface LocationHealthZone {
  id: string;
  name: string;
  hindiName: string;
  areaType: 'Temple Core' | 'Corridor / Arterial' | 'Highway Super-Speciality' | 'Pilgrim Circuit' | 'River Ghats' | 'Urban & Riverine Hub';
  landmark: string;
  hindiLandmark: string;
  description: string;
  hindiDescription: string;
  latitude?: number;
  longitude?: number;
  currentPrevalentConditions: PrevalentConditionItem[];
  environmentalRiskNote: string;
  hindiEnvironmentalRiskNote: string;
  recommendedFacilityIds: string[];
}

export interface MedicalFacility {
  id: string;
  name: string;
  hindiName: string;
  type: 'Hospital' | 'Charitable Mission' | 'Medical College' | 'Community Health Center' | 'Emergency Service' | '24x7 Pharmacy';
  zone?: string;
  address: string;
  hindiAddress?: string;
  phone: string;
  emergencyPhone?: string;
  timing: string;
  services: string[];
  hasEmergency24x7: boolean;
  hasICU: boolean;
  verifiedGovtOrTrust: boolean;
  distanceNote: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
