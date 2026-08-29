import { MedicalFacility, LocationHealthZone } from '../types';

export const VRINDAVAN_EMERGENCY_HOTLINES = [
  {
    name: 'National Ambulance Service (Emergency)',
    hindiName: 'राष्ट्रीय एम्बुलेंस सेवा (आपातकालीन)',
    number: '108',
    type: 'Free 24x7 Emergency Ambulance',
    desc: 'Government emergency ambulance for acute medical, cardiac, accident, and trauma cases across UP & Vrindavan.',
  },
  {
    name: 'Maternity & Child Health Ambulance',
    hindiName: 'मातृ एवं शिशु स्वास्थ्य एम्बुलेंस',
    number: '102',
    type: 'Maternal & Neonatal Transport',
    desc: 'Free transport for pregnant women, new mothers, and infants to hospital.',
  },
  {
    name: 'All-in-One National Emergency Helpline',
    hindiName: 'अखिल भारतीय आपातकालीन नंबर',
    number: '112',
    type: 'Police, Fire & Medical Integrated',
    desc: 'Centralized emergency response system.',
  },
  {
    name: 'UP Health Consultation Helpline',
    hindiName: 'उत्तर प्रदेश स्वास्थ्य परामर्श हेल्पलाइन',
    number: '104',
    type: 'Medical Advice & Guidance',
    desc: 'Government health advice line for medical guidance and epidemic reporting.',
  }
];

export const VRINDAVAN_LOCATION_ZONES: LocationHealthZone[] = [
  {
    id: 'jabalpur_narmada_valley',
    name: 'Jabalpur & Narmada River Basin (Mahakoshal Region)',
    hindiName: 'जबलपुर एवं नर्मदा घाटी (महाकौशल क्षेत्र)',
    areaType: 'Urban & Riverine Hub',
    landmark: 'Bhedaghat, Gwarighat, Tilwaraghat, Madan Mahal, Wright Town, Civil Lines',
    hindiLandmark: 'भेड़ाघाट, ग्वारीघाट, तिलवाराघाट, मदन महल, राइट टाउन, सिविल लाइंस',
    latitude: 23.1815,
    longitude: 79.9864,
    description: 'Central Madhya Pradesh cultural hub on the Narmada river with dense river ghats, surrounding forested plateaus, and major tertiary medical research centers (ICMR-NIRTH).',
    hindiDescription: 'मध्य प्रदेश का प्रमुख ऐतिहासिक व सांस्कृतिक केंद्र जो नर्मदा नदी के तट पर स्थित है। यहाँ प्रसिद्ध नदी घाट, संगमरमर की चट्टानें एवं प्रमुख आईसीएमआर (ICMR) अनुसंधान संस्थान स्थित हैं।',
    environmentalRiskNote: 'High endemic transmission of vector-borne tropical fevers (Malaria falciparum/vivax, Dengue, Chikungunya) due to post-monsoon river water stagnation; Scrub Typhus & Leptospirosis in peri-urban vegetation zones; waterborne hepatitis/gastroenteritis.',
    hindiEnvironmentalRiskNote: 'नर्मदा कछार व नालों के जलजमाव से वेक्टर-जनित बुखार (मलेरिया, डेंगू, चिकनगुनिया) का स्थानिक प्रकोप; झाड़ियों व ग्रामीण सीमा क्षेत्रों में स्क्रब टाइफस (Scrub Typhus) व लेप्टोस्पायरोसिस; नदी जल संक्रमण।',
    recommendedFacilityIds: ['nscb_medical_college_jabalpur', 'victor_hospital_jabalpur', 'city_hospital_jabalpur'],
    currentPrevalentConditions: [
      {
        name: 'Endemic Malaria (P. vivax & P. falciparum Cerebral Alert)',
        hindiName: 'स्थानिक मलेरिया (प्लास्मोडियम वाइवैक्स व खतरनाक फाल्सीपेरम)',
        category: 'Vector-Borne / Fever',
        prevalenceLevel: 'High',
        triggerFactor: 'High Anopheles mosquito density across Narmada river plains, forested outskirts, and rural Mahakoshal belts',
        hindiTriggerFactor: 'नर्मदा बेसिन व आस-पास के वनांचल में एनोफिलीज मच्छरों की बहुलता',
        keySymptoms: ['Shaking chills with rigors (कम्पन के साथ तेज बुखार)', 'Profuse sweating upon fever drop', 'Severe frontal headache', 'Nausea/Vomiting', 'Enlarged spleen/hepatomegaly'],
        preventionTips: [
          'Sleep inside insecticide-treated bed nets (ITNs)',
          'Apply DEET repellent when visiting ghats or outdoor parks in the evening',
          'Eliminate standing freshwater collections around coolers and pots'
        ],
        hindiPreventionTips: [
          'मच्छरदानी का नियमित उपयोग करें',
          'शाम को नदी घाटों या पार्कों में जाने पर ओडोमॉस/मच्छर रोधी लोशन लगाएं',
          'कूलर व गमलों में पानी जमा न होने दें'
        ],
        immediateAction: 'Get an immediate Peripheral Blood Smear (MP) and Rapid Antigen Test (RDT) at NSCB Medical College or District Victoria Hospital. Complete the full course of ACT (Artemisinin Combination Therapy) or Chloroquine/Primaquine under physician supervision.'
      },
      {
        name: 'Scrub Typhus (Orientia tsutsugamushi Rickettsial Infection)',
        hindiName: 'स्क्रब टाइफस (पिस्सू/चिगर्स माइट जनित रिकेट्सियल बुखार)',
        category: 'Vector-Borne / Fever',
        prevalenceLevel: 'Seasonal Alert',
        triggerFactor: 'Bites from microscopic larval trombiculid mites (chiggers) in scrub vegetation, riverbanks, and agricultural gardens around Jabalpur',
        hindiTriggerFactor: 'झाड़ियों, घास के मैदानों व खेतों में पाए जाने वाले सूक्ष्म माइट्स (चिगर्स) का काटना',
        keySymptoms: ['Black cigarette-burn-like skin scab (Eschar / काला पपड़ीदार निशान)', 'Continuous high fever (103-104°F)', 'Severe myalgia & headache', 'Lymph node swelling (lymphadenopathy)', 'Dry cough & confusion'],
        preventionTips: [
          'Wear long pants tucked into boots/socks when walking in tall grass or riverbank trails',
          'Avoid sitting directly on damp soil or untrimmed grass near ghats and farms',
          'Inspect skin folds (groin, axilla, waistband) after outdoor visits'
        ],
        hindiPreventionTips: [
          'घास-झाड़ियों वाले रास्तों पर पूरी पैंट को मोजों में दबाकर पहनें',
          'नदी किनारे या खेतों में सीधे नंगी जमीन/घास पर न बैठें',
          'घर लौटने पर शरीर पर काले निशान (एस्कर) की जांच करें'
        ],
        immediateAction: 'Critically check body for an "Eschar" scab. Doxycycline is the specific first-line antimicrobial when administered early under medical direction at NSCB Medical College. Do not delay, as untreated cases risk multiorgan involvement.'
      },
      {
        name: 'Dengue & Severe Chikungunya Polyarthralgia',
        hindiName: 'डेंगू एवं चिकनगुनिया (जोड़ों का तीव्र दर्द व बुखार)',
        category: 'Vector-Borne / Fever',
        prevalenceLevel: 'High',
        triggerFactor: 'Day-biting Aedes aegypti mosquitoes breeding in urban domestic water containers and stagnant rainwater pools',
        hindiTriggerFactor: 'घरेलू टंकियों व जमे हुए बारिश के पानी में पनपने वाले एडिस मच्छर',
        keySymptoms: ['Sudden high spiking fever', 'Debilitating joint stiffness & pain (कलाई/घुटने में असहनीय दर्द)', 'Pain behind eyeballs (retro-orbital)', 'Red pinpoint petechiae rash', 'Extreme lethargy'],
        preventionTips: [
          'Empty and scrub domestic water coolers and overhead tanks weekly (Dry Day practice)',
          'Wear light-colored clothing covering arms and legs during daylight hours',
          'Use indoor mosquito vaporizers'
        ],
        hindiPreventionTips: [
          'हफ्ते में एक दिन कूलर व पानी के बर्तनों को सुखाकर साफ करें',
          'दिन के समय पूरी आस्तीन के कपड़े पहनें',
          'घर में मच्छर भगाने वाले क्वाइल/वेपोराइजर का प्रयोग करें'
        ],
        immediateAction: 'Do NOT take Aspirin, Brufen, or Diclofenac (can cause internal bleeding). Hydrate aggressively with coconut water and ORS. Monitor complete blood count (Platelet count) daily at a licensed laboratory.'
      },
      {
        name: 'Waterborne Acute Enteric Infections & Viral Hepatitis E/A',
        hindiName: 'दूषित जलजनित हेपेटाइटिस (पीलिया) एवं आंत्रशोथ',
        category: 'Gastrointestinal',
        prevalenceLevel: 'Moderate',
        triggerFactor: 'Ingestion of unpurified river water during ritual bathing or unhygienic street beverages/sugarcane juice',
        hindiTriggerFactor: 'नदी जल का सीधा आचमन या सड़क किनारे अस्वच्छ बर्फ-युक्त पेय पदार्थों का सेवन',
        keySymptoms: ['Dark yellow tea-colored urine', 'Yellowing of sclera (eyes)', 'Upper right quadrant abdominal heaviness', 'Nausea & loss of appetite', 'Pale stools'],
        preventionTips: [
          'Drink exclusively boiled or reliable RO purified water',
          'Avoid road-side juices made with contaminated commercial ice',
          'Wash hands thoroughly before handling food'
        ],
        hindiPreventionTips: [
          'केवल उबला या आरओ (RO) शुद्ध जल ही पिएं',
          'ठेले के बर्फ वाले शर्बत/गन्ने के रस से बचें',
          'खाना खाने से पहले हाथ अच्छी तरह साबुन से धोएं'
        ],
        immediateAction: 'Get Liver Function Tests (Serum Bilirubin, SGPT/SGOT) and Viral Serology. Rest, maintain high-carbohydrate light meals, and avoid liver-toxic herbal concoctions.'
      }
    ]
  },
  {
    id: 'banke_bihari_old_town',
    name: 'Banke Bihari & Old Town Galiyan',
    hindiName: 'बांके बिहारी मंदिर एवं पुराना नगर (संकरी गलियां)',
    areaType: 'Temple Core',
    landmark: 'Banke Bihari Mandir, Radha Vallabh, Nidhivan, Loi Bazaar',
    hindiLandmark: 'बांके बिहारी मंदिर, राधा वल्लभ, निधिवन, लोई बाजार',
    latitude: 27.5815,
    longitude: 77.7025,
    description: 'High-density pilgrim core with narrow historic streets, immense foot traffic, and open prasad food stalls.',
    hindiDescription: 'अत्यधिक भीड़भाड़ वाला तीर्थ क्षेत्र, संकरी गलियां, भारी पैदल आवाजाही एवं खुले प्रसाद/स्ट्रीट फूड स्टॉल।',
    environmentalRiskNote: 'High risk of food/water contamination from open stalls; severe monkey aggression/biting risk in alleys; crowd stampede/crush and heat asphyxia during festive darshan peak hours.',
    hindiEnvironmentalRiskNote: 'खुले भोजन व पानी से संक्रमण का खतरा; गलियों में बंदरों द्वारा काटने/झपट्टा मारने का जोखिम; भीड़ में अत्यधिक उमस व ऑक्सीजन की कमी से बेहोशी।',
    recommendedFacilityIds: ['district_combined_vrindavan', 'ramakrishna_mission', 'chc_vrindavan'],
    currentPrevalentConditions: [
      {
        name: 'Acute Gastroenteritis & Foodborne Dysentery',
        hindiName: 'तीव्र आंत्रशोथ (दस्त, पेचिश व उल्टी)',
        category: 'Gastrointestinal',
        prevalenceLevel: 'High',
        triggerFactor: 'Unboiled local borehole water, contaminated street lassi/kachori, unpeeled cut fruit prasad',
        hindiTriggerFactor: 'असुरक्षित स्थानीय जल, खुले में बिकने वाली लस्सी, कचौड़ी, और कटे हुए फल',
        keySymptoms: ['Watery diarrhea', 'Abdominal cramping', 'Nausea/Vomiting', 'Low-grade fever', 'Dry mouth'],
        preventionTips: [
          'Drink exclusively packaged sealed or boiled RO water',
          'Avoid unpasteurized rabdi/mithai stored in open air',
          'Carry personal WHO-ORS hydration sachets'
        ],
        hindiPreventionTips: [
          'केवल सील पैक या उबला हुआ पानी पिएं',
          'खुले में रखी बासी रबड़ी या मिठाइयां खाने से बचें',
          'ओआरएस (ORS) के पैकेट हमेशा साथ रखें'
        ],
        immediateAction: 'Start frequent ORS electrolyte sips; if blood in stool or unrelenting vomiting occurs, go to Ramakrishna Mission / Combined Hospital immediately.'
      },
      {
        name: 'Monkey Bites & Scratches (Rabies Risk)',
        hindiName: 'बंदर के काटने व खरोंचने के घाव (रेबीज खतरा)',
        category: 'Zoonotic / Bite',
        prevalenceLevel: 'High',
        triggerFactor: 'Aggressive rhesus macaques targeting spectacles, bags, prasad, and food in narrow alleys',
        hindiTriggerFactor: 'गलियों में चश्मे, प्रसाद, थैलों व खाने पर बंदरों का अचानक हमला',
        keySymptoms: ['Puncture wounds', 'Lacerations', 'Bleeding', 'Local pain & swelling', 'Infection risk'],
        preventionTips: [
          'Remove eyeglasses, sunglasses, and loose shiny ornaments before entering temple lanes',
          'Never carry visible polythene bags or loose food packets in open hands',
          'Do not make direct eye contact or tease monkeys'
        ],
        hindiPreventionTips: [
          'गलियों में प्रवेश करने से पहले चश्मा व चमकदार वस्तुएं बैग में सुरक्षित रखें',
          'हाथ में खाने के खुले पैकेट या प्लास्टिक की थैलियां न लेकर चलें',
          'बंदरों की आंखों में सीधे न घूरें और न ही उन्हें छेड़ें'
        ],
        immediateAction: 'Wash wound immediately under running tap water with detergent soap for 15 full minutes. Visit District Combined Hospital or CHC within 24 hours for Post-Exposure Prophylaxis (Anti-Rabies Vaccine + Immunoglobulin).'
      },
      {
        name: 'Crowd Heat Syncope & Panic Suffocation',
        hindiName: 'भीड़ में दम घुटना, अत्यधिक पसीना व चक्कर (सिंकोप)',
        category: 'Heat & Exertion',
        prevalenceLevel: 'Moderate',
        triggerFactor: 'Long queue standstill under poor ventilation and high humidity in temple courtyard',
        hindiTriggerFactor: 'मंदिर परिसर व गलियों में भारी भीड़, उमस व हवा की कमी',
        keySymptoms: ['Lightheadedness/Fainting', 'Cold clammy skin', 'Palpitations', 'Tunnel vision', 'Hyperventilation'],
        preventionTips: [
          'Avoid peak darshan rush (prefer early morning or late afternoon slots)',
          'Carry a folding hand fan and hydrate before queueing',
          'Elderly and cardiac patients should avoid high-density inner sanctum gates'
        ],
        hindiPreventionTips: [
          'भीड़ के चरम समय (आरती के समय) के बजाय शांत समय दर्शन करें',
          'पंखा, टोपी और पानी की बोतल साथ रखें',
          'बुजुर्ग व हृदय रोगी अत्यधिक भीड़ वाले संकरे रास्तों से बचें'
        ],
        immediateAction: 'Move to an airy shaded area, elevate legs above heart level, loosen tight clothing, and sip cool electrolyte water.'
      }
    ]
  },
  {
    id: 'raman_reti_iskcon_prem_mandir',
    name: 'Raman Reti, ISKCON & Prem Mandir Corridor',
    hindiName: 'रमण रेती, इस्कॉन एवं प्रेम मंदिर कॉरिडोर',
    areaType: 'Corridor / Arterial',
    landmark: 'Prem Mandir, ISKCON Krishna Balaram Mandir, Bhaktivedanta Marg, Raman Reti',
    hindiLandmark: 'प्रेम मंदिर, इस्कॉन मंदिर, भक्तिवेदांत मार्ग, रमण रेती',
    latitude: 27.5714,
    longitude: 77.6748,
    description: 'Wide boulevard with modern ashrams, major footfall of national and international pilgrims, large outdoor courtyards.',
    hindiDescription: 'चौड़े मार्ग, प्रमुख आश्रम, राष्ट्रीय व विदेशी श्रद्धालुओं की भारी संख्या तथा विशाल मंदिर परिसर।',
    environmentalRiskNote: 'Extreme pavement surface heat causing foot sole blisters; sudden weather/temperature shifts between air-conditioned interiors and scorching outdoor courtyards triggering viral respiratory infections.',
    hindiEnvironmentalRiskNote: 'गर्म फर्श पर नंगे पैर चलने से छालों का खतरा; एसी से अचानक गर्मी में आने पर वायरल सर्दी-जुकाम व गले में संक्रमण का प्रसार।',
    recommendedFacilityIds: ['ramakrishna_mission', 'chc_vrindavan', 'shree_ji_pharmacy_24x7'],
    currentPrevalentConditions: [
      {
        name: 'Viral Pharyngitis & Upper Respiratory Infection',
        hindiName: 'वायरल ग्रसनीशोथ (गले में खराश, जुकाम व बुखार)',
        category: 'Respiratory / Allergy',
        prevalenceLevel: 'High',
        triggerFactor: 'Sudden temperature shifts (chilled AC guesthouses to hot humid outdoors) + mass airborne droplet transmission',
        hindiTriggerFactor: 'एसी कमरों से सीधे चिलचिलाती धूप में जाना एवं भीड़भाड़ में ड्रॉपलेट संक्रमण',
        keySymptoms: ['Sore throat', 'Dry cough', 'Mild fever (100°F)', 'Body aches', 'Sneezing / Nasal congestion'],
        preventionTips: [
          'Avoid drinking iced water immediately after walking in extreme heat',
          'Wear a light face mask in crowded prayer halls',
          'Maintain regular warm water and saline gargles'
        ],
        hindiPreventionTips: [
          'धूप से आने के तुरंत बाद फ्रिज का ठंडा पानी न पिएं',
          'भीड़भाड़ वाले हॉल में मास्क का उपयोग करें',
          'दिन में दो बार गुनगुने पानी से गरारे करें'
        ],
        immediateAction: 'Rest, hydrate with warm tulsi-ginger decoctions, take paracetamol for fever, and avoid unprescribed antibiotics.'
      },
      {
        name: 'Foot Sole Blisters & Calcaneal Plantar Strain',
        hindiName: 'पैरों के छालों का फूटना व एड़ी में तीव्र दर्द',
        category: 'Heat & Exertion',
        prevalenceLevel: 'High',
        triggerFactor: 'Walking barefoot on heated stone pavements and dusty sand paths around temple parikramas',
        hindiTriggerFactor: 'गर्म संगमरमर व पथरीले रास्तों पर नंगे पैर निरंतर चलना',
        keySymptoms: ['Painful friction blisters', 'Erythema of soles', 'Heel throbbing pain', 'Difficulty walking'],
        preventionTips: [
          'Wear white cotton socks inside temple premises where permitted',
          'Use walking footwear between temples; avoid barefoot street walking',
          'Wash and dry feet thoroughly with antiseptic soap each evening'
        ],
        hindiPreventionTips: [
          'मंदिर परिसरों में जहां अनुमति हो, सफेद सूती मोजे पहनें',
          'मंदिरों के बीच सड़क पर नंगे पैर चलने से बचें',
          'शाम को पैरों को गुनगुने पानी और साबुन से साफ करें'
        ],
        immediateAction: 'Do not burst blisters with needles. Clean with saline, apply povidone-iodine ointment and sterile gauze cushion.'
      }
    ]
  },
  {
    id: 'parikrama_marg_yamuna_ghats',
    name: 'Vrindavan Parikrama Marg & Yamuna River Ghats',
    hindiName: 'वृन्दावन परिक्रमा मार्ग एवं यमुना घाट (केशी घाट/काली दह)',
    areaType: 'Pilgrim Circuit',
    landmark: '11-km Parikrama Circuit, Keshi Ghat, Kaliya Dah, Cheer Ghat, Seva Kunj',
    hindiLandmark: '11 किमी परिक्रमा मार्ग, केशी घाट, काली दह, चीर घाट, सेवा कुंज',
    latitude: 27.5878,
    longitude: 77.7082,
    description: 'The sacred 11-kilometer circumambulation path circling the city alongside the Yamuna riverbed.',
    hindiDescription: 'वृन्दावन नगर के चारों ओर 11 किलोमीटर का परिक्रमा पथ जो यमुना तट के समीप से गुजरता है।',
    environmentalRiskNote: 'River water microbial contaminants during ritual bathing/achaman; profound physical exhaustion over the 11-km barefoot walk; high mosquito breeding in waterlogging pockets near ghats.',
    hindiEnvironmentalRiskNote: 'यमुना जल के सीधे आचमन से जलजनित कीटाणुओं का खतरा; 11 किमी की पैदल परिक्रमा से मांसपेशियों में ऐंठन व डिहाइड्रेशन; घाटों के पास मच्छरों का प्रकोप।',
    recommendedFacilityIds: ['ramakrishna_mission', 'district_combined_vrindavan', 'chc_vrindavan'],
    currentPrevalentConditions: [
      {
        name: 'Exertional Heat Exhaustion & Muscle Cramping',
        hindiName: 'शारीरिक थकावट, निर्जलीकरण व मांसपेशियों में ऐंठन',
        category: 'Heat & Exertion',
        prevalenceLevel: 'High',
        triggerFactor: 'Completing 11km or 21km Parikrama without adequate electrolyte replenishment in warm weather',
        hindiTriggerFactor: 'बिना पर्याप्त पानी व इलेक्ट्रोलाइट्स के 11 किमी की लंबी परिक्रमा पूरी करना',
        keySymptoms: ['Severe calf spasms', 'Profuse sweating', 'Nausea', 'Extreme fatigue', 'Dark yellow urine'],
        preventionTips: [
          'Start Parikrama before dawn (4:00 AM) or after sunset (6:30 PM)',
          'Carry at least 1.5 liters of water mixed with glucose-electrolyte powder',
          'Take 5-minute seated rests every 3 kilometers'
        ],
        hindiPreventionTips: [
          'परिक्रमा तड़के (सुबह 4-5 बजे) या शाम को शुरू करें',
          'इलेक्ट्रोलाइट युक्त पानी की बोतल साथ रखें',
          'हर 2-3 किलोमीटर पर 5 मिनट का विश्राम लें'
        ],
        immediateAction: 'Sit immediately in the shade, consume chilled coconut water or ORS solution, and stretch the calf muscles gently.'
      },
      {
        name: 'Seasonal Vector-Borne Fevers (Dengue / Chikungunya)',
        hindiName: 'वेक्टर-जनित मौसमी बुखार (डेंगू व चिकनगुनिया)',
        category: 'Vector-Borne / Fever',
        prevalenceLevel: 'Seasonal Alert',
        triggerFactor: 'Aedes mosquito breeding in stagnant water near river ghats, open drains, and construction areas',
        hindiTriggerFactor: 'घाटों व नालियों के पास जमे पानी में एडिस मच्छरों का पनपना',
        keySymptoms: ['High sudden fever (103°F)', 'Severe retro-orbital eye pain', 'Intense joint & back pain', 'Skin rash', 'Extreme weakness'],
        preventionTips: [
          'Apply DEET or picaridin-based mosquito repellent creams on exposed skin',
          'Wear light-colored, full-sleeve shirts and full trousers',
          'Avoid sitting near open water bodies at dawn and dusk'
        ],
        hindiPreventionTips: [
          'खुली त्वचा पर मच्छर रोधक क्रीम (Odomos आदि) लगाएं',
          'पूरी आस्तीन के कपड़े और पूरी पैंट पहनें',
          'सुबह-शाम नदी या पानी के गड्ढों के पास लंबे समय न बैठें'
        ],
        immediateAction: 'Do NOT take Ibuprofen/Aspirin (increases bleeding risk). Take Paracetamol for fever, maintain intense hydration, and get CBC (Platelet count) test at Ramakrishna Mission or Combined Hospital.'
      },
      {
        name: 'Bacterial / Viral Conjunctivitis (Eye Flu)',
        hindiName: 'आंखों का संक्रमण / आई फ्लू (कंजंक्टिवाइटिस)',
        category: 'General',
        prevalenceLevel: 'Moderate',
        triggerFactor: 'River water splashing directly into eyes, touching eyes with unwashed hands in crowd',
        hindiTriggerFactor: 'नदी का पानी आंखों में जाना और गंदे हाथों से आंखों को मसलना',
        keySymptoms: ['Eye redness', 'Gritty sensation', 'Watery discharge', 'Crusting on eyelids in morning', 'Photophobia'],
        preventionTips: [
          'Avoid splashing untreated Yamuna or tank water directly into open eyes',
          'Carry lubricating carboxymethylcellulose eye drops',
          'Do not rub eyes; use sterile wipes'
        ],
        hindiPreventionTips: [
          'अशुद्ध पानी को सीधे खुली आंखों में न छिड़कें',
          'आंखों को बार-बार हाथों से न रगड़ें',
          'लुब्रिकेटिंग आई ड्रॉप्स साथ रखें'
        ],
        immediateAction: 'Wash eyes with sterile saline water, wear protective sunglasses, and consult an eye specialist before using steroid drops.'
      }
    ]
  },
  {
    id: 'chhatikara_nh2_highway',
    name: 'Chhatikara Road & NH-2 Highway Corridor',
    hindiName: 'छटीकरा रोड एवं एनएच-2 दिल्ली-मथुरा हाईवे',
    areaType: 'Highway Super-Speciality',
    landmark: 'Chhatikara Entrance Gate, NH-2 Highway, GLA University corridor, Akbarpur Cut',
    hindiLandmark: 'छटीकरा प्रवेश द्वार, एनएच-2 हाईवे, जीएलए विश्वविद्यालय कॉरिडोर',
    latitude: 27.5510,
    longitude: 77.6322,
    description: 'High-speed vehicular transit gateway connecting Mathura, Vrindavan, and Delhi NCR with advanced tertiary medical colleges.',
    hindiDescription: 'मथुरा, वृन्दावन और दिल्ली को जोड़ने वाला मुख्य राजमार्ग जहां आधुनिक मेडिकल कॉलेज व सुपर-स्पेशलिटी अस्पताल स्थित हैं।',
    environmentalRiskNote: 'High risk of vehicular accidents, severe orthopaedic trauma, high levels of highway dust particulate matter causing acute asthma and allergic bronchitis.',
    hindiEnvironmentalRiskNote: 'राजमार्ग पर सड़क दुर्घटनाएं व फ्रैक्चर का खतरा; वाहनों के धुएं व धूल से दमा, ब्रोंकाइटिस व सांस की एलर्जी का प्रकोप।',
    recommendedFacilityIds: ['kd_medical_college', 'brij_healthcare'],
    currentPrevalentConditions: [
      {
        name: 'Acute Highway Trauma & Orthopedic Fractures',
        hindiName: 'सड़क दुर्घटना चोटें, अस्थिभंग (फ्रैक्चर) व पॉलीट्रामा',
        category: 'General',
        prevalenceLevel: 'High',
        triggerFactor: 'High-speed highway traffic, e-rickshaw collisions at Chhatikara crossing',
        hindiTriggerFactor: 'हाईवे पर तेज रफ्तार वाहन एवं छटीकरा मोड़ पर ई-रिक्शा दुर्घटनाएं',
        keySymptoms: ['Bone deformity', 'Severe acute localized pain', 'Inability to bear weight', 'Active bleeding', 'Concussion'],
        preventionTips: [
          'Use designated pedestrian crossings and footbridges',
          'Always wear helmets on two-wheelers and seatbelts in cars',
          'Avoid boarding overcrowded e-rickshaws'
        ],
        hindiPreventionTips: [
          'हाईवे पार करते समय सावधानी बरतें',
          'दोपहिया पर हेलमेट और कार में सीटबेल्ट अनिवार्य रूप से लगाएं',
          'ओवरलोडेड ई-रिक्शा में न बैठें'
        ],
        immediateAction: 'Immobilize injured limb immediately; do not attempt to pop back broken bones. Call 108 or KD Medical College Emergency (+91 5662 250108) for Advanced Life Support ambulance.'
      },
      {
        name: 'Allergic Rhinitis & Particulate Airway Hyperreactivity',
        hindiName: 'धूल-धुएं की एलर्जी, दमा का दौरा व एलर्जी राइनाइटिस',
        category: 'Respiratory / Allergy',
        prevalenceLevel: 'Moderate',
        triggerFactor: 'High vehicular PM2.5 emissions, road construction dust along highway',
        hindiTriggerFactor: 'राजमार्ग पर वाहनों का धुआं एवं निर्माण कार्यों से उड़ने वाली धूल',
        keySymptoms: ['Continuous sneezing', 'Watery itchy eyes', 'Dry hacking cough', 'Wheezing / Chest tightness'],
        preventionTips: [
          'Wear an N95 or snug protective mask while traveling on open e-rickshaws',
          'Asthmatic patients must carry rescue inhalers (Salbutamol) at all times'
        ],
        hindiPreventionTips: [
          'खुले ई-रिक्शा में यात्रा करते समय एन-95 मास्क लगाएं',
          'दमा रोगी अपना इनहेलर सदैव जेब में रखें'
        ],
        immediateAction: 'Inhale rescue bronchodilator if prescribed, move to an enclosed filtered space, and rinse face and nasal passages with clean water.'
      }
    ]
  },
  {
    id: 'mathura_vrindavan_arterial_road',
    name: 'Mathura-Vrindavan Road (Pagal Baba Axis)',
    hindiName: 'मथुरा-वृन्दावन मुख्य मार्ग (पागल बाबा मंदिर अक्ष)',
    areaType: 'Corridor / Arterial',
    landmark: 'Pagal Baba Mandir, Birla Mandir, District Combined Hospital axis',
    hindiLandmark: 'पागल बाबा मंदिर, बिड़ला मंदिर, संयुक्त जिला अस्पताल अक्ष',
    latitude: 27.5542,
    longitude: 77.6891,
    description: 'Central connector road between Mathura city and Vrindavan harboring primary governmental and charitable hospitals.',
    hindiDescription: 'मथुरा नगर और वृन्दावन के बीच का मुख्य संपर्क मार्ग जहां प्रमुख सरकारी व चैरिटेबल अस्पताल स्थित हैं।',
    environmentalRiskNote: 'Seasonal vector-borne fever hotspots in surrounding settlements; intense summer sun exposure on open roads.',
    hindiEnvironmentalRiskNote: 'आस-पास के क्षेत्रों में मौसमी बुखार व जलजमाव; गर्मियों में सीधी धूप से लू (हीट स्ट्रोक) का खतरा।',
    recommendedFacilityIds: ['district_combined_vrindavan', 'ramakrishna_mission'],
    currentPrevalentConditions: [
      {
        name: 'Pyrexia of Unknown Origin (PUO) & Enteric Typhoid Fever',
        hindiName: 'टाइफाइड (मियादी बुखार) एवं अज्ञात मूल का संक्रमण',
        category: 'Vector-Borne / Fever',
        prevalenceLevel: 'Moderate',
        triggerFactor: 'Salmonella typhi transmission via contaminated beverages and street foods along arterial stops',
        hindiTriggerFactor: 'सड़क किनारे दूषित गन्ने का रस या अस्वच्छ खाद्य पदार्थों का सेवन',
        keySymptoms: ['Step-ladder high fever', 'Severe headache', 'Abdominal discomfort', 'Coated white tongue', 'Loss of appetite'],
        preventionTips: [
          'Avoid roadside sugarcane juice prepared with unhygienic ice blocks',
          'Ensure drinking water is boiled or RO filtered',
          'Maintain hand hygiene before eating'
        ],
        hindiPreventionTips: [
          'सड़क किनारे गंदे बर्फ वाले गन्ने के रस या शर्बत से बचें',
          'उबला या फिल्टर पानी ही पिएं',
          'खाना खाने से पहले हाथ साबुन से धोएं'
        ],
        immediateAction: 'Undergo Widal / Typhidot blood tests at District Combined Hospital or Ramakrishna Mission; do not self-medicate with half-dose antibiotics.'
      }
    ]
  },
  {
    id: 'govardhan_radhakund_circuit',
    name: 'Govardhan & Radhakund Parikrama Circuit',
    hindiName: 'गोवर्धन एवं राधाकुण्ड परिक्रमा क्षेत्र',
    areaType: 'Pilgrim Circuit',
    landmark: 'Govardhan Hill, Radhakund, Shyampund, Dan Ghati, Mansi Ganga',
    hindiLandmark: 'गोवर्धन पर्वत, राधाकुण्ड, श्यामकुण्ड, दानघाटी, मानसी गंगा',
    latitude: 27.4984,
    longitude: 77.4645,
    description: '21-km grand pilgrimage circuit demanding extensive physical endurance under varied weather conditions.',
    hindiDescription: '21 किलोमीटर का विस्तृत परिक्रमा क्षेत्र जहां अत्यधिक शारीरिक सहनशक्ति की आवश्यकता होती है।',
    environmentalRiskNote: 'Extreme solar radiation exposure, heat stroke / hyperthermia in summer months; sudden exhaustion and dehydration.',
    hindiEnvironmentalRiskNote: 'कड़ी धूप से लू (हीट स्ट्रोक) का गहरा खतरा; 21 किमी की दूरी से अत्यधिक डिहाइड्रेशन व बेहोशी।',
    recommendedFacilityIds: ['kd_medical_college', 'district_combined_vrindavan'],
    currentPrevalentConditions: [
      {
        name: 'Heat Stroke & Severe Hyperthermia',
        hindiName: 'लू लगना एवं अत्यधिक शारीरिक तापमान (हीट स्ट्रोक)',
        category: 'Heat & Exertion',
        prevalenceLevel: 'High',
        triggerFactor: 'Walking long distance under direct afternoon sunlight (>40°C) without protective headgear',
        hindiTriggerFactor: 'दोपहर की तेज धूप (40°C+) में बिना सिर ढके पैदल चलना',
        keySymptoms: ['Body temperature >103°F', 'Absence of sweating with hot dry skin', 'Confusion/Delirium', 'Stupor/Coma', 'Throbbing headache'],
        preventionTips: [
          'Never undertake Parikrama between 10:30 AM and 5:00 PM in summer',
          'Cover head with a wet white gamcha (cotton cloth) or wide-brim hat',
          'Drink lemon water with salt and sugar every 45 minutes'
        ],
        hindiPreventionTips: [
          'गर्मियों में सुबह 10:30 से शाम 5 बजे के बीच परिक्रमा कभी न करें',
          'सिर को गीले सूती गमछे या टोपी से ढककर रखें',
          'हर 45 मिनट पर नींबू-नमक-चीनी का पानी पिएं'
        ],
        immediateAction: 'Emergency condition: Move person into shade, apply ice/cold water packs to neck, armpits, and groin. Call 108 ambulance immediately.'
      }
    ]
  }
];

export const VRINDAVAN_FACILITIES: MedicalFacility[] = [
  {
    id: 'nscb_medical_college_jabalpur',
    name: 'Netaji Subhash Chandra Bose (NSCB) Medical College & Hospital',
    hindiName: 'नेताजी सुभाष चंद्र बोस मेडिकल कॉलेज एवं सुपर-स्पेशलिटी अस्पताल, जबलपुर',
    type: 'Medical College',
    zone: 'Jabalpur & Mahakoshal Region',
    address: 'Garha Road, Tilwara Ghat Road, Jabalpur, Madhya Pradesh 482003',
    hindiAddress: 'गढ़ा रोड, तिलवारा घाट मार्ग, जबलपुर, मध्य प्रदेश 482003',
    phone: '+91 761 237 0951',
    emergencyPhone: '+91 761 237 0954',
    timing: '24 Hours Emergency, Trauma & Super-Speciality',
    services: [
      'Premier 1200+ Bed Apex Govt Medical College & Research Hospital',
      '24x7 Level-1 Trauma Center & Advanced Emergency Resuscitation',
      'ICMR-NIRTH Associated Tropical & Vector-Borne Infectious Disease Center',
      'Advanced Multi-Bed ICUs (Medical, Surgical, Pediatric & Neonatal)',
      'State-of-the-Art Blood Bank & Component Separation Unit',
      'Super-Speciality Block (Cardiology, Neurology, Nephrology, Gastroenterology)'
    ],
    hasEmergency24x7: true,
    hasICU: true,
    verifiedGovtOrTrust: true,
    distanceNote: 'Garha, Jabalpur (Central tertiary hub for MP Mahakoshal)'
  },
  {
    id: 'victor_hospital_jabalpur',
    name: 'District Victoria Hospital (Seth Govind Das District Hospital)',
    hindiName: 'सेठ गोविंद दास विक्टोरिया जिला अस्पताल, जबलपुर',
    type: 'Hospital',
    zone: 'Jabalpur Central City',
    address: 'Civil Lines, Near High Court, Jabalpur, MP 482001',
    hindiAddress: 'सिविल लाइंस, हाईकोर्ट के पास, जबलपुर, मध्य प्रदेश 482001',
    phone: '+91 761 262 0524',
    emergencyPhone: '108 / +91 761 262 0524',
    timing: '24 Hours Emergency & Casualty / Free OPD',
    services: [
      '24x7 Casualty & Emergency Ward',
      'Free Diagnostic Lab, X-Ray & Ultrasound',
      'Dengue, Malaria & Scrub Typhus Testing & Isolation Wards',
      'Anti-Rabies (ARV) & Tetanus Prophylaxis Center',
      'Ayushman Bharat & Free Essential Medications'
    ],
    hasEmergency24x7: true,
    hasICU: true,
    verifiedGovtOrTrust: true,
    distanceNote: 'Civil Lines, Jabalpur City Center'
  },
  {
    id: 'city_hospital_jabalpur',
    name: 'Jabalpur Hospital and Research Centre (JHRC)',
    hindiName: 'जबलपुर हॉस्पिटल एवं रिसर्च सेंटर (JHRC)',
    type: 'Hospital',
    zone: 'Wright Town / Napier Town, Jabalpur',
    address: 'Russel Chowk, Napier Town / Wright Town, Jabalpur, MP 482002',
    hindiAddress: 'रसेल चौक, राइट टाउन, जबलपुर, मध्य प्रदेश 482002',
    phone: '+91 761 402 6000',
    emergencyPhone: '+91 761 402 6100',
    timing: '24 Hours Open',
    services: [
      '24x7 Critical Care & Emergency Department',
      'Cardiology, Cath Lab & Heart Surgeries',
      'Multi-Slice CT, MRI & Automated Pathology',
      'Dialysis Unit & Neuro-Trauma Care'
    ],
    hasEmergency24x7: true,
    hasICU: true,
    verifiedGovtOrTrust: false,
    distanceNote: 'Wright Town / Napier Town prime medical corridor'
  },
  {
    id: 'ramakrishna_mission',
    name: 'Ramakrishna Mission Sevashrama Hospital',
    hindiName: 'रामकृष्ण मिशन सेवाश्रम चैरिटेबल अस्पताल',
    type: 'Charitable Mission',
    zone: 'Raman Reti & Mathura-Vrindavan Road',
    address: 'Swami Vivekananda Marg, Mathura-Vrindavan Marg, Vrindavan, UP 281121',
    hindiAddress: 'स्वामी विवेकानंद मार्ग, वृन्दावन, उत्तर प्रदेश 281121',
    phone: '+91 565 244 2310',
    emergencyPhone: '+91 565 244 2400',
    timing: '24 Hours Open (Emergency & Trauma)',
    services: [
      '24x7 Emergency & Trauma Care',
      'Intensive Care Unit (ICU & CCU)',
      'Cardiology, Cath Lab & Dialysis Center',
      'Orthopedics, General Surgery & Medicine',
      'Pathology Laboratory & Blood Storage',
      'Subsidized / Charitable High-Quality Care'
    ],
    hasEmergency24x7: true,
    hasICU: true,
    verifiedGovtOrTrust: true,
    distanceNote: 'Centrally located in Vrindavan, near Prem Mandir / ISKCON corridor'
  },
  {
    id: 'district_combined_vrindavan',
    name: 'District Combined Hospital (100 Bedded Govt Hospital)',
    hindiName: 'संयुक्त जिला चिकित्सालय (100 शैय्या सरकारी अस्पताल), वृन्दावन',
    type: 'Hospital',
    zone: 'Mathura-Vrindavan Road & Banke Bihari Axis',
    address: 'Mathura-Vrindavan Road, Near Pagal Baba Mandir, Vrindavan, UP',
    hindiAddress: 'मथुरा-वृन्दावन रोड, पागल बाबा मंदिर के पास, वृन्दावन',
    phone: '+91 565 244 3220',
    timing: '24 Hours Emergency / OPD 8:00 AM - 2:00 PM',
    services: [
      'Govt Emergency & Casualty Ward',
      'Free Basic Medications & Diagnostics',
      'Maternity & Labor Room Services',
      'General Physician & Pediatrician OPD',
      'Anti-Rabies Vaccine & Tetanus Prophylaxis',
      'Ayushman Bharat Empanelled'
    ],
    hasEmergency24x7: true,
    hasICU: false,
    verifiedGovtOrTrust: true,
    distanceNote: 'Main arterial road between Mathura and Vrindavan'
  },
  {
    id: 'kd_medical_college',
    name: 'Kanti Devi (KD) Medical College, Hospital & Research Center',
    hindiName: 'के.डी. मेडिकल कॉलेज एवं मल्टीस्पेशलिटी हॉस्पिटल',
    type: 'Medical College',
    zone: 'Chhatikara & NH-2 Highway Corridor',
    address: 'NH-2, 24 Km Milestone, Mathura-Delhi Highway, Akbarpur (Near Vrindavan Cut)',
    hindiAddress: 'एनएच-2, मथुरा-दिल्ली हाईवे, वृन्दावन मोड़ के पास',
    phone: '+91 5662 250 000',
    emergencyPhone: '+91 5662 250 108',
    timing: '24 Hours Emergency & Super-Speciality',
    services: [
      '650+ Bed Multi-Super-Speciality Tertiary Care',
      'Advanced Cardiac Catheterization Lab & Neuro ICU',
      '24-Hour Advanced Life Support (ALS) Ambulances',
      'CT Scan, MRI, Ultrasound & Automated Labs',
      'Trauma & Joint Replacement Center'
    ],
    hasEmergency24x7: true,
    hasICU: true,
    verifiedGovtOrTrust: true,
    distanceNote: 'Approx 12 mins drive from Vrindavan town on Highway'
  },
  {
    id: 'brij_healthcare',
    name: 'Brij Healthcare Multispeciality Hospital',
    hindiName: 'बृज हेल्थकेयर मल्टीस्पेशलिटी अस्पताल',
    type: 'Hospital',
    zone: 'Chhatikara & NH-2 Highway Corridor',
    address: 'Near Chhatikara Road, Vrindavan, Mathura, UP 281121',
    hindiAddress: 'छटीकरा रोड के पास, वृन्दावन',
    phone: '+91 565 297 1010',
    timing: '24 Hours Open',
    services: [
      'Emergency Resuscitation & Observation',
      'Internal Medicine & Gastroenterology',
      'Fracture & Sprain Orthopedic Care',
      'Digital X-Ray & Ultrasound',
      'Daycare Admissions'
    ],
    hasEmergency24x7: true,
    hasICU: true,
    verifiedGovtOrTrust: true,
    distanceNote: 'Close to Chhatikara entrance gate'
  },
  {
    id: 'chc_vrindavan',
    name: 'Community Health Centre (CHC) Vrindavan',
    hindiName: 'सामुदायिक स्वास्थ्य केन्द्र (CHC) वृन्दावन',
    type: 'Community Health Center',
    zone: 'Raman Reti & ISKCON Area',
    address: 'Goras Nagar, Near Raman Reti, Vrindavan, UP',
    hindiAddress: 'गोरस नगर, रमण रेती के पास, वृन्दावन',
    phone: '+91 565 244 2125',
    timing: '24x7 Primary Emergency / Day OPD',
    services: [
      'Primary Health Screening & Immunization',
      'Fever & Infectious Disease Protocol (Dengue/Malaria Rapid Kits)',
      'Basic Wound Care, Dressing & Anti-Rabies/Tetanus',
      'Maternal Care & Essential Drugs'
    ],
    hasEmergency24x7: true,
    hasICU: false,
    verifiedGovtOrTrust: true,
    distanceNote: 'Near Raman Reti / ISKCON temple vicinity'
  },
  {
    id: 'shree_ji_pharmacy_24x7',
    name: 'Shree Ji 24x7 Medical & Chemist Store',
    hindiName: 'श्री जी 24x7 मेडिकल एवं केमिस्ट स्टोर',
    type: '24x7 Pharmacy',
    zone: 'Raman Reti & ISKCON Area',
    address: 'Bhakti Vedanta Swami Marg (Opp. ISKCON Gate), Vrindavan',
    hindiAddress: 'भक्तिवेदांत स्वामी मार्ग (इस्कॉन गेट के सामने), वृन्दावन',
    phone: '+91 94122 78901',
    timing: 'Open 24 Hours / 7 Days a Week',
    services: [
      'Allopathic Prescribed Medicines',
      'Emergency First Aid & ORS Supplies',
      'Blood Glucose & Blood Pressure Check',
      'Oxygen Canisters & Nebulizer Kits'
    ],
    hasEmergency24x7: true,
    hasICU: false,
    verifiedGovtOrTrust: false,
    distanceNote: 'Walking distance from ISKCON and Prem Mandir'
  }
];

