import { SymptomItem, BodyRegion } from '../types';

export const BODY_REGIONS_CONFIG: {
  id: BodyRegion;
  label: string;
  hindiLabel: string;
  color: string;
  icon: string;
  frontAvailable: boolean;
  backAvailable: boolean;
}[] = [
  { id: 'head', label: 'Head & Neurological', hindiLabel: 'सिर व तंत्रिका तंत्र', color: 'indigo', icon: 'Brain', frontAvailable: true, backAvailable: true },
  { id: 'eyes_ent', label: 'Eyes, Ears, Nose & Throat', hindiLabel: 'आंख, कान, नाक, गला', color: 'cyan', icon: 'Eye', frontAvailable: true, backAvailable: false },
  { id: 'neck', label: 'Neck & Thyroid', hindiLabel: 'गर्दन व थायरॉइड', color: 'teal', icon: 'Sparkles', frontAvailable: true, backAvailable: true },
  { id: 'chest', label: 'Chest & Heart / Lungs', hindiLabel: 'छाती, हृदय व फेफड़े', color: 'rose', icon: 'HeartPulse', frontAvailable: true, backAvailable: false },
  { id: 'abdomen', label: 'Abdomen & Digestion', hindiLabel: 'पेट व पाचन तंत्र', color: 'amber', icon: 'ShieldAlert', frontAvailable: true, backAvailable: false },
  { id: 'pelvis', label: 'Pelvis & Urinary', hindiLabel: 'कमर का निचला हिस्सा व मूत्र पथ', color: 'purple', icon: 'Activity', frontAvailable: true, backAvailable: true },
  { id: 'spine_back', label: 'Spine & Back', hindiLabel: 'रीढ़ की हड्डी व पीठ', color: 'blue', icon: 'Layers', frontAvailable: false, backAvailable: true },
  { id: 'arms_hands', label: 'Arms, Shoulders & Hands', hindiLabel: 'बाजू, कंधे व हाथ', color: 'emerald', icon: 'Hand', frontAvailable: true, backAvailable: true },
  { id: 'legs_feet', label: 'Legs, Knees & Feet', hindiLabel: 'पैर, घुटने व पंजे', color: 'orange', icon: 'Footprints', frontAvailable: true, backAvailable: true },
  { id: 'skin_general', label: 'Whole Body & General Symptoms', hindiLabel: 'संपूर्ण शरीर व सामान्य लक्षण', color: 'violet', icon: 'Thermometer', frontAvailable: true, backAvailable: true },
];

export const SYMPTOMS_DATABASE: SymptomItem[] = [
  // HEAD & NEUROLOGICAL
  {
    id: 'headache_throbbing',
    name: 'Throbbing / Pulsating Headache',
    hindiName: 'तेज धड़कता हुआ सिरदर्द',
    bodyRegion: 'head',
    category: 'Neurological',
    description: 'Pounding pain usually on one or both sides of the head, worsened by light or sound.',
    hindiDescription: 'सिर के एक या दोनों तरफ तेज धड़कन जैसा दर्द, रोशनी या आवाज से बढ़ना।'
  },
  {
    id: 'headache_thunderclap',
    name: 'Sudden "Thunderclap" Severe Headache',
    hindiName: 'अचानक उठा असहनीय तीव्र सिरदर्द (थंडरक्लैप)',
    bodyRegion: 'head',
    category: 'Neurological',
    isRedFlag: true,
    description: 'Instantaneous, excruciating headache reaching peak intensity within seconds.',
    hindiDescription: 'कुछ ही सेकंड में अपनी चरम सीमा पर पहुंचने वाला असहनीय सिरदर्द - तुरंत आपातकालीन जांच की आवश्यकता।'
  },
  {
    id: 'dizziness_vertigo',
    name: 'Dizziness / Room Spinning (Vertigo)',
    hindiName: 'चक्कर आना / सिर घूमना',
    bodyRegion: 'head',
    category: 'Neurological',
    description: 'Feeling of lightheadedness, off-balance, or spinning sensation.',
    hindiDescription: 'संतुलन बिगड़ने का अहसास, कमजोरी या वातावरण का घूमता हुआ प्रतीत होना।'
  },
  {
    id: 'slurred_speech_facial_droop',
    name: 'Slurred Speech / Facial Asymmetry (Stroke Warning)',
    hindiName: 'बोलने में लड़खड़ाहट / चेहरे का टेढ़ापन (स्ट्रोक संकेत)',
    bodyRegion: 'head',
    category: 'Neurological',
    isRedFlag: true,
    description: 'Sudden weakness on one side of face or difficulty formulating speech (FAST sign).',
    hindiDescription: 'अचानक चेहरे के एक तरफ कमजोरी या बोलने में रुकावट - आपातकालीन 108 डायल करें।'
  },
  {
    id: 'scalp_tenderness',
    name: 'Scalp Tenderness & Pressure',
    hindiName: 'सिर की त्वचा में खिंचाव व भारीपन',
    bodyRegion: 'head',
    category: 'Neurological',
    description: 'Tight band-like constriction around head or tenderness when touching scalp.',
    hindiDescription: 'सिर के चारों ओर पट्टी जैसा खिंचाव या छूने पर दर्द।'
  },

  // EYES, EARS, NOSE & THROAT (ENT)
  {
    id: 'eye_redness_discharge',
    name: 'Eye Redness, Itching & Watery Discharge',
    hindiName: 'आंखों का लाल होना, खुजली व पानी आना (कंजंक्टिवाइटिस)',
    bodyRegion: 'eyes_ent',
    category: 'Ophthalmology / ENT',
    commonInVrindavanRegion: true,
    description: 'Pink/red conjunctiva, gritty sensation, sensitivity to light, common seasonal conjunctivitis.',
    hindiDescription: 'आंखों में लाली, धूल जैसा चुभन, पानी या कीचड़ आना।'
  },
  {
    id: 'sudden_vision_loss',
    name: 'Sudden Vision Loss / Darkness in Eye',
    hindiName: 'अचानक नजर जाना या अंधकार छाना',
    bodyRegion: 'eyes_ent',
    category: 'Ophthalmology',
    isRedFlag: true,
    description: 'Abrupt blurriness, curtain-like loss of sight, or blindness in one or both eyes.',
    hindiDescription: 'अचानक एक या दोनों आंखों की रोशनी कम होना या काला पर्दा दिखना।'
  },
  {
    id: 'sore_throat_difficulty_swallowing',
    name: 'Sore Throat & Painful Swallowing',
    hindiName: 'गले में खराश व निगलने में दर्द',
    bodyRegion: 'eyes_ent',
    category: 'ENT',
    commonInVrindavanRegion: true,
    description: 'Scratchy or burning feeling in throat, inflamed tonsils, pain when swallowing liquids or food.',
    hindiDescription: 'गले में चुभन, जलन, टॉन्सिल में सूजन व भोजन निगलने में तकलीफ।'
  },
  {
    id: 'earache_discharge',
    name: 'Ear Pain, Fullness or Discharge',
    hindiName: 'कान में तेज दर्द या मवाद/पानी निकलना',
    bodyRegion: 'eyes_ent',
    category: 'ENT',
    description: 'Throbbing ache in ear canal, muffled hearing, or fluid leakage.',
    hindiDescription: 'कान में दबाव, दर्द या सुनने में परेशानी।'
  },
  {
    id: 'nasal_congestion_sinus_pressure',
    name: 'Nasal Congestion & Facial Sinus Pressure',
    hindiName: 'नाक बंद होना व माथे/गालों पर साइनस का दबाव',
    bodyRegion: 'eyes_ent',
    category: 'ENT',
    description: 'Stuffy or runny nose, frontal headache, pressure behind eyes and cheeks.',
    hindiDescription: 'नाक बहना या बंद होना, गालों व माथे की हड्डियों में भारीपन।'
  },
  {
    id: 'mouth_ulcers_bleeding_gums',
    name: 'Mouth Ulcers / Bleeding Gums',
    hindiName: 'मुंह में छाले या मसूड़ों से खून आना',
    bodyRegion: 'eyes_ent',
    category: 'Dental / Oral',
    description: 'Painful sores on inner cheeks, tongue, or swollen bleeding gum margins.',
    hindiDescription: 'जीभ या गाल के अंदर दर्दनाक छाले, मसूड़ों में सूजन।'
  },

  // NECK & THYROID
  {
    id: 'stiff_neck_with_fever',
    name: 'Stiff Neck with High Fever (Meningism Sign)',
    hindiName: 'गर्दन में तेज अकड़न व तेज बुखार (मेनिन्जाइटिस लक्षण)',
    bodyRegion: 'neck',
    category: 'Neurological / Infectious',
    isRedFlag: true,
    description: 'Inability to bend chin toward chest accompanied by fever and photo-sensitivity.',
    hindiDescription: 'गर्दन मोड़ने में असमर्थता व तेज बुखार - तत्काल आपातकालीन परीक्षण आवश्यक।'
  },
  {
    id: 'swollen_lymph_nodes_neck',
    name: 'Swollen / Tender Glands in Neck',
    hindiName: 'गर्दन में दर्दनाक गिल्टियां / लिम्फ नोड्स में सूजन',
    bodyRegion: 'neck',
    category: 'Endocrine / Immune',
    description: 'Palpable lumps under jawline or sides of neck, often tender to touch.',
    hindiDescription: 'जबड़े के नीचे या गर्दन के दोनों ओर उभरी हुई दर्दनाक गांठें।'
  },
  {
    id: 'neck_muscle_spasm',
    name: 'Neck Muscle Spasm & Restricted Movement',
    hindiName: 'गर्दन की मांसपेशियों में खिंचाव व अकड़न',
    bodyRegion: 'neck',
    category: 'Musculoskeletal',
    description: 'Tight, sore neck muscles caused by poor sleeping posture or long screen use.',
    hindiDescription: 'गर्दन घुमाने में परेशानी, मांसपेशियों में तीव्र दर्द।'
  },

  // CHEST & RESPIRATORY / CARDIOVASCULAR
  {
    id: 'crushing_chest_pain_radiating',
    name: 'Crushing Chest Pain / Pressure Radiating to Left Arm or Jaw',
    hindiName: 'छाती में भारी दबाव व बाएं हाथ/जबड़े तक फैलता दर्द',
    bodyRegion: 'chest',
    category: 'Cardiovascular',
    isRedFlag: true,
    description: 'Heavy squeeze or tightness in central chest, sweating, nausea, shortness of breath.',
    hindiDescription: 'दिल का दौरा (Heart Attack) का प्रमुख संकेत - बिना देरी किए 108 पर कॉल करें।'
  },
  {
    id: 'shortness_of_breath_at_rest',
    name: 'Severe Shortness of Breath / Wheezing at Rest',
    hindiName: 'बैठे-बैठे सांस फूलना / घरघराहट होना',
    bodyRegion: 'chest',
    category: 'Respiratory',
    isRedFlag: true,
    description: 'Gasping for air, rapid shallow breathing, unable to complete full sentences.',
    hindiDescription: 'सांस लेने में भारी मशक्कत, छाती से सीटी जैसी आवाज आना।'
  },
  {
    id: 'persistent_dry_or_wet_cough',
    name: 'Persistent Cough (Dry or Phlegm)',
    hindiName: 'लगातार सूखी या बलगम वाली खांसी',
    bodyRegion: 'chest',
    category: 'Respiratory',
    commonInVrindavanRegion: true,
    description: 'Cough lasting several days, producing yellow/green mucus or throat tickle.',
    hindiDescription: 'कई दिनों से लगातार खांसी, बलगम या गले में भारीपन।'
  },
  {
    id: 'coughing_up_blood',
    name: 'Coughing up Blood (Hemoptysis)',
    hindiName: 'खांसी में खून आना',
    bodyRegion: 'chest',
    category: 'Respiratory',
    isRedFlag: true,
    description: 'Red streaks or frank blood in sputum when coughing.',
    hindiDescription: 'बलगम के साथ लाल खून आना - तुरंत चिकित्सकीय जांच जरूरी।'
  },
  {
    id: 'heart_palpitations_racing',
    name: 'Rapid / Irregular Heartbeats (Palpitations)',
    hindiName: 'दिल की तेज या अनियमित धड़कन (घबराहट)',
    bodyRegion: 'chest',
    category: 'Cardiovascular',
    description: 'Feeling like heart is fluttering, skipping beats, or racing while resting.',
    hindiDescription: 'छाती में दिल की धड़कन का असामान्य तेज होना या रुक-रुक कर चलना।'
  },
  {
    id: 'chest_wall_tenderness',
    name: 'Sharp Chest Pain when Breathing in or Pressing (Costochondritis)',
    hindiName: 'गहरी सांस लेने या छूने पर छाती की पसलियों में दर्द',
    bodyRegion: 'chest',
    category: 'Musculoskeletal',
    description: 'Localized rib cartilage inflammation, worsens when taking a deep breath or twisting.',
    hindiDescription: 'पसलियों के जोड़ों में सूजन, गहरी सांस या हिलने-डुलने पर सुई जैसा चुभन।'
  },

  // ABDOMEN & DIGESTIVE
  {
    id: 'acute_severe_stomach_cramps',
    name: 'Severe Sudden Abdominal Pain (Acute Abdomen)',
    hindiName: 'पेट में अचानक उठा असहनीय मरोड़ या दर्द',
    bodyRegion: 'abdomen',
    category: 'Gastroenterology',
    isRedFlag: true,
    description: 'Rigid belly, extreme tenderness, inability to stand straight, potential appendicitis/perforation.',
    hindiDescription: 'पेट का कड़ा हो जाना, छूने पर बहुत तेज दर्द - तुरंत इमरजेंसी जाएं।'
  },
  {
    id: 'watery_diarrhea_vomiting',
    name: 'Watery Diarrhea & Frequent Vomiting (Gastroenteritis)',
    hindiName: 'दस्त, उल्टी व पेट में मरोड़ (उल्टी-दस्त / गैस्ट्रो)',
    bodyRegion: 'abdomen',
    category: 'Gastroenterology',
    commonInVrindavanRegion: true,
    description: 'Loose watery bowel movements, nausea, dehydration risk, common water/food illness.',
    hindiDescription: 'बार-बार पतला दस्त, जी मिचलाना व शरीर में पानी की कमी का खतरा।'
  },
  {
    id: 'acid_reflux_heartburn',
    name: 'Heartburn & Burning Sensation in Upper Stomach (Acidity)',
    hindiName: 'पेट के ऊपरी भाग में जलन, खट्टी डकारें (एसिडिटी)',
    bodyRegion: 'abdomen',
    category: 'Gastroenterology',
    commonInVrindavanRegion: true,
    description: 'Burning feeling behind sternum or epigastrium after meals, sour taste in mouth.',
    hindiDescription: 'खाना खाने के बाद सीने या पेट में जलन, खट्टी डकार व भारीपन।'
  },
  {
    id: 'vomiting_blood_coffee_ground',
    name: 'Vomiting Blood / Dark Black Stools (GI Bleeding)',
    hindiName: 'उल्टी में खून आना या काला मल आना',
    bodyRegion: 'abdomen',
    category: 'Gastroenterology',
    isRedFlag: true,
    description: 'Coffee-ground emesis or tarry black stools indicating internal gastrointestinal bleeding.',
    hindiDescription: 'आंतरिक रक्तस्त्राव का गंभीर संकेत - तत्काल अस्पताल पहुंचे।'
  },
  {
    id: 'bloating_gas_loss_of_appetite',
    name: 'Abdominal Bloating, Gas & Loss of Appetite',
    hindiName: 'पेट का फूलना, गैस व भूख न लगना',
    bodyRegion: 'abdomen',
    category: 'Gastroenterology',
    description: 'Distended stomach, flatulence, feeling overly full after small portions.',
    hindiDescription: 'पेट में भारीपन, गैस का बनना और भूख में अचानक कमी।'
  },
  {
    id: 'jaundice_yellow_eyes_urine',
    name: 'Yellow Eyes / Skin & Dark Urine (Jaundice / Hepatitis Sign)',
    hindiName: 'आंखों/त्वचा का पीला पड़ना व गहरा पीला पेशाब (पीलिया)',
    bodyRegion: 'abdomen',
    category: 'Hepatobiliary',
    commonInVrindavanRegion: true,
    description: 'Icterus in sclera, pale clay-colored stools, fatigue indicating liver inflammation.',
    hindiDescription: 'लीवर से संबंधित समस्या, आंखों में पीलापन व अत्यधिक थकान।'
  },

  // PELVIS & URINARY
  {
    id: 'burning_urination_frequency',
    name: 'Burning Sensation while Urinating & Frequent Urge (UTI)',
    hindiName: 'पेशाब में तेज जलन व बार-बार पेशाब की इच्छा (यूटीआई)',
    bodyRegion: 'pelvis',
    category: 'Urology',
    commonInVrindavanRegion: true,
    description: 'Dysuria, pelvic pressure, cloudy or foul-smelling urine.',
    hindiDescription: 'पेशाब करते समय दर्द/जलन, बूंद-बूंद पेशाब आना व मूंछ में दबाव।'
  },
  {
    id: 'blood_in_urine_hematuria',
    name: 'Red or Pink Blood in Urine (Hematuria)',
    hindiName: 'पेशाब में लाल रंग का खून आना',
    bodyRegion: 'pelvis',
    category: 'Urology',
    isRedFlag: true,
    description: 'Visible blood or clots in urine, requires urgent urological workup.',
    hindiDescription: 'पेशाब के साथ खून आना - गुर्दे या मूत्राशय की तत्काल जांच आवश्यक।'
  },
  {
    id: 'flank_lower_back_pain_kidney_stone',
    name: 'Severe Sharp Flank Pain Radiating to Groin (Kidney Stone Colic)',
    hindiName: 'कमर के एक तरफ असहनीय तेज दर्द जो नीचे तक जाता है (पथरी का दर्द)',
    bodyRegion: 'pelvis',
    category: 'Urology',
    description: 'Sudden spasmodic pain in side/back, nausea, difficulty finding a comfortable position.',
    hindiDescription: 'गुर्दे की पथरी का तीव्र दर्द, मरोड़ के साथ उठना व बेचैनी।'
  },
  {
    id: 'lower_pelvic_cramping',
    name: 'Lower Pelvic Spasms / Menstrual or Reproductive Cramping',
    hindiName: 'पेल्विक भाग में ऐंठन व गर्भाशय/मासिक धर्म संबंधी दर्द',
    bodyRegion: 'pelvis',
    category: 'Gynecology / Urology',
    description: 'Aching or cramping in lower pelvic bowl, exacerbated during cycles or movement.',
    hindiDescription: 'कमर के निचले हिस्से व पेल्विस में लगातार दर्द।'
  },

  // SPINE & BACK
  {
    id: 'lumbar_lower_back_pain',
    name: 'Lower Back Muscle Stiffness & Lumbar Ache',
    hindiName: 'कमर का निचला दर्द (लंबर स्ट्रेन / कटिशूल)',
    bodyRegion: 'spine_back',
    category: 'Orthopedics / Spine',
    description: 'Dull or sharp ache in lower back after lifting, prolonged standing, or travel.',
    hindiDescription: 'झुकने या वजन उठाने पर कमर में दर्द, जकड़न।'
  },
  {
    id: 'sciatica_shooting_nerve_pain',
    name: 'Shooting Pain from Lower Back Down One Leg (Sciatica)',
    hindiName: 'कमर से पैर के पिछले हिस्से तक बिजली जैसा दर्द (सायटिका)',
    bodyRegion: 'spine_back',
    category: 'Spine / Neurological',
    description: 'Electric shock-like radiating pain down buttock, thigh, and calf, numbness in foot.',
    hindiDescription: 'रीढ़ की नस दबने से पैर में सुन्नपन, झनझनाहट व खिंचाव।'
  },
  {
    id: 'upper_back_between_shoulder_blades',
    name: 'Upper Back / Mid-Spine Muscle Knotting',
    hindiName: 'पीठ के ऊपरी भाग व कंधों के बीच तेज जकड़न',
    bodyRegion: 'spine_back',
    category: 'Orthopedics',
    description: 'Stiffness between scapulae caused by posture strain or physical labor.',
    hindiDescription: 'पीठ के मध्य भाग में मांसपेशियों की गांठें व दर्द।'
  },
  {
    id: 'loss_of_bladder_bowel_control',
    name: 'Numbness in Groin + Loss of Bladder/Bowel Control (Cauda Equina)',
    hindiName: 'कमर दर्द के साथ पेशाब/मल पर नियंत्रण खोना (काउडा इक्विना)',
    bodyRegion: 'spine_back',
    category: 'Spine / Neurological',
    isRedFlag: true,
    description: 'Saddle anesthesia and acute incontinence - medical surgical emergency.',
    hindiDescription: 'गुप्तांगों में सुन्नपन व पेशाब न रुकना - तुरंत रीढ़ के ऑपरेशन की आवश्यकता।'
  },

  // ARMS & HANDS
  {
    id: 'shoulder_joint_stiffness_pain',
    name: 'Shoulder Pain & Frozen Joint Immobility',
    hindiName: 'कंधे में दर्द व हाथ ऊपर उठाने में असमर्थता (फ्रोजन शोल्डर)',
    bodyRegion: 'arms_hands',
    category: 'Orthopedics',
    description: 'Inability to lift arm above head, nighttime ache, rotator cuff strain.',
    hindiDescription: 'कंधे का जाम होना, हाथ हिलाने पर तेज दर्द।'
  },
  {
    id: 'wrist_numbness_tingling',
    name: 'Tingling / "Pins & Needles" in Hand & Fingers (Carpal Tunnel)',
    hindiName: 'हाथ की उंगलियों में झनझनाहट व सुन्नपन',
    bodyRegion: 'arms_hands',
    category: 'Neurology / Orthopedics',
    description: 'Numbness in thumb, index, and middle finger, weakness when gripping objects.',
    hindiDescription: 'हथेली और उंगलियों में चींटियां काटने जैसा अहसास, पकड़ कमजोर होना।'
  },
  {
    id: 'elbow_tendon_pain',
    name: 'Outer or Inner Elbow Tendon Pain (Tennis / Golfer Elbow)',
    hindiName: 'कोहनी के जोड़ में दर्द व खिंचाव',
    bodyRegion: 'arms_hands',
    category: 'Orthopedics',
    description: 'Sharp pain on bony bump of elbow when gripping, lifting, or twisting wrist.',
    hindiDescription: 'कोहनी की हड्डी में हाथ मोड़ने पर दर्द।'
  },
  {
    id: 'finger_joint_swelling_morning_stiffness',
    name: 'Swollen Finger Joints & Morning Hand Stiffness (Arthritis)',
    hindiName: 'उंगलियों के जोड़ों में सूजन व सुबह-सुबह जकड़न (गठिया / आर्थराइटिस)',
    bodyRegion: 'arms_hands',
    category: 'Rheumatology',
    description: 'Puffy knuckle joints, difficulty making a fist upon waking lasting > 30 minutes.',
    hindiDescription: 'सुबह सोकर उठने पर हाथों में भारी जकड़न व जोड़ों में सूजन।'
  },

  // LEGS & FEET
  {
    id: 'knee_pain_crepitus_swelling',
    name: 'Knee Joint Pain, Clicking & Swelling (Osteoarthritis)',
    hindiName: 'घुटनों में दर्द, सूजन व कट-कट की आवाज (घुटनों का घिसाव)',
    bodyRegion: 'legs_feet',
    category: 'Orthopedics',
    commonInVrindavanRegion: true,
    description: 'Deep ache in knee during parikrama/walking, climbing stairs, or kneeling.',
    hindiDescription: 'परिक्रमा या सीढ़ियां चढ़ने पर घुटने में तेज दर्द, सूजन व आवाज।'
  },
  {
    id: 'calf_swelling_one_leg_dvt',
    name: 'Sudden Swelling, Warmth & Redness in One Calf (DVT Warning)',
    hindiName: 'एक पैर की पिण्डली में अचानक सूजन, लाली व गर्माहट (खून का थक्का / DVT)',
    bodyRegion: 'legs_feet',
    category: 'Cardiovascular / Vascular',
    isRedFlag: true,
    description: 'Unilateral swollen tender calf muscle indicating possible deep vein thrombosis clot.',
    hindiDescription: 'एक पैर में अचानक दर्दनाक सूजन - खून के थक्के का खतरा, तुरंत जांच कराएं।'
  },
  {
    id: 'ankle_sprain_swelling',
    name: 'Twisted Ankle Swelling & Inability to Bear Weight',
    hindiName: 'टखने में मोच, सूजन व पैर जमीन पर न रख पाना',
    bodyRegion: 'legs_feet',
    category: 'Orthopedics',
    description: 'Bruising, rapid edema on outer ankle after misstep on uneven path or temple steps.',
    hindiDescription: 'पैर मुड़ जाने से टखने पर सूजन, नीला निशान व चलने में दर्द।'
  },
  {
    id: 'heel_pain_first_step_morning',
    name: 'Stabbing Heel Pain on First Steps in Morning (Plantar Fasciitis)',
    hindiName: 'सुबह जमीन पर पहला कदम रखने पर एड़ी में तेज चुभन (एड़ी का दर्द)',
    bodyRegion: 'legs_feet',
    category: 'Orthopedics',
    commonInVrindavanRegion: true,
    description: 'Sharp pain underneath heel after resting or barefoot walking on hard temple floors.',
    hindiDescription: 'नंगे पैर चलने के बाद एड़ी में सुई जैसी चुभन जो चलने पर थोड़ी देर बाद हल्की होती है।'
  },
  {
    id: 'bilateral_leg_swelling_edema',
    name: 'Swelling in Both Feet & Ankles (Pitting Edema)',
    hindiName: 'दोनों पैरों व पंजों में सूजन (दबाने पर गड्ढा पड़ना)',
    bodyRegion: 'legs_feet',
    category: 'Cardio / Renal',
    description: 'Puffy ankles where socks leave deep indentations, may indicate fluid retention.',
    hindiDescription: 'पैरों में पानी भरना, जूते/चप्पल तंग होना, दिल या गुर्दे से जुड़ा लक्षण।'
  },

  // WHOLE BODY & GENERAL SYMPTOMS
  {
    id: 'high_fever_with_chills_shivering',
    name: 'High Fever with Chills & Rigors (Dengue / Malaria Pattern)',
    hindiName: 'तेज बुखार, ठंड लगकर कांपना व बदन दर्द (डेंगू/मलेरिया संकेत)',
    bodyRegion: 'skin_general',
    category: 'Infectious Disease',
    commonInVrindavanRegion: true,
    description: 'Temperature spiking above 101-104°F, intense shaking, severe retro-orbital headache, platelet monitoring needed.',
    hindiDescription: 'कपकपी के साथ तेज बुखार, आंखों के पीछे दर्द व प्लेटलेट्स गिरने का खतरा।'
  },
  {
    id: 'extreme_fatigue_lethargy',
    name: 'Severe Exhaustion, Weakness & Lethargy',
    hindiName: 'अत्यधिक कमजोरी, थकान व सुस्ती',
    bodyRegion: 'skin_general',
    category: 'General Medicine',
    description: 'Total lack of energy, unable to carry out basic daily activities or stand for long.',
    hindiDescription: 'बिस्तर से उठने में भी असमर्थता, शरीर में भारी कमजोरी।'
  },
  {
    id: 'body_rash_itchy_hives',
    name: 'Widespread Itchy Skin Rash or Hives (Urticaria)',
    hindiName: 'पूरे शरीर पर लाल चकत्ते, दाने या तेज खुजली (पित्ती / एलर्जी)',
    bodyRegion: 'skin_general',
    category: 'Dermatology / Allergy',
    description: 'Raised erythematous welts across skin, pruritus, allergic reaction or viral exanthem.',
    hindiDescription: 'त्वचा पर लाल उभरे हुए निशान, तेज खुजली या जलन।'
  },
  {
    id: 'heat_exhaustion_fainting',
    name: 'Heat Exhaustion, Heavy Sweating & Syncope / Fainting',
    hindiName: 'लू लगना, अत्यधिक पसीना, चक्कर आकर बेहोश होना (हीट स्ट्रोक)',
    bodyRegion: 'skin_general',
    category: 'Emergency / Environmental',
    isRedFlag: true,
    commonInVrindavanRegion: true,
    description: 'Dehydration from intense summer heat, rapid pulse, clammy or dry hot skin, confusion.',
    hindiDescription: 'गर्मी और धूप से शरीर का तापमान बढ़ना, भ्रम या बेहोशी - तुरंत ठंडी जगह ले जाएं।'
  },
  {
    id: 'severe_allergic_swelling_anaphylaxis',
    name: 'Swelling of Lips, Tongue & Wheezing (Anaphylaxis Emergency)',
    hindiName: 'होंठों/जीभ पर अचानक सूजन व सांस रुकना (एनाफिलेक्सिस)',
    bodyRegion: 'skin_general',
    category: 'Emergency / Allergy',
    isRedFlag: true,
    description: 'Immediate systemic hypersensitivity reaction causing airway obstruction.',
    hindiDescription: 'दवा, कीड़े के काटने या खाने से जानलेवा एलर्जी - तुरंत आपातकालीन इंजेक्शन/अस्पताल।'
  },
  {
    id: 'generalized_joint_muscle_aches',
    name: 'Widespread Joint & Muscle Pain (Chikungunya / Viral Arthralgia)',
    hindiName: 'समस्त जोड़ों व मांसपेशियों में असहनीय दर्द (चिकनगुनिया लक्षण)',
    bodyRegion: 'skin_general',
    category: 'Infectious / Rheumatology',
    commonInVrindavanRegion: true,
    description: 'Crippling multi-joint pain, stiffness in wrists, ankles, and knees after fever.',
    hindiDescription: 'बुखार के बाद सभी जोड़ों में भारी जकड़न व हिलने-डुलने में दर्द।'
  }
];

export const PRE_EXISTING_CONDITIONS_LIST = [
  { id: 'diabetes', label: 'Diabetes (मधुमेह)', icon: 'Activity' },
  { id: 'hypertension', label: 'High Blood Pressure (उच्च रक्तचाप)', icon: 'HeartPulse' },
  { id: 'asthma_copd', label: 'Asthma / COPD (दमा / सांस की बीमारी)', icon: 'Wind' },
  { id: 'heart_disease', label: 'Heart Disease / CAD (हृदय रोग)', icon: 'Heart' },
  { id: 'kidney_disease', label: 'Kidney / Renal Condition (गुर्दे की बीमारी)', icon: 'ShieldAlert' },
  { id: 'liver_disease', label: 'Liver / Hepatitis (लीवर विकार)', icon: 'CircleDot' },
  { id: 'thyroid', label: 'Thyroid Disorder (थायरॉइड)', icon: 'Sparkles' },
  { id: 'arthritis', label: 'Arthritis / Joint Disease (गठिया)', icon: 'Layers' },
  { id: 'immunosuppressed', label: 'Low Immunity / On Steroids (कमजोर प्रतिरक्षा)', icon: 'Shield' },
];
