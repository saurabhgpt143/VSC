import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client server-side
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient model caller with multi-model fallback and backoff retry for 503/429 spikes
const CANDIDATE_MODELS = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-3.1-pro-preview"];

async function generateContentWithFallback(ai: GoogleGenAI, config: any) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...config,
          model,
        });
        return { response, modelUsed: model };
      } catch (err: any) {
        lastError = err;
        const is503Or429 = err?.status === 503 || err?.status === 429 || err?.message?.includes("503") || err?.message?.includes("high demand") || err?.message?.includes("RESOURCE_EXHAUSTED");
        
        if (is503Or429 && attempt === 0) {
          // Short delay before retrying same model once
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }
        // If not recoverable on this model, break inner loop to try next candidate model
        break;
      }
    }
  }

  throw lastError || new Error("All AI models unavailable");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    timestamp: new Date().toISOString(),
  });
});

// Clinical assessment endpoint
app.post("/api/assess-symptoms", async (req, res) => {
  try {
    const { symptoms, patientProfile, language = "en" } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: "At least one symptom is required" });
    }

    const ai = getGeminiClient();

    // Check for critical emergency red flags deterministically
    const hasEmergencyKeywords = symptoms.some((s: any) => 
      s.isRedFlag || 
      /crushing|radiating to arm|severe chest pain|stroke|slurred speech|facial droop|sudden paralysis|loss of consciousness|vomiting blood|coughing blood|thunderclap|anaphylaxis|unable to breathe/i.test(s.name || "")
    );

    const promptText = `
You are an expert clinical triage physician for the Vrindavan Symptom Checker (a clinical decision-support tool serving residents and pilgrims in Vrindavan and Mathura region, Uttar Pradesh, India).
Language requested for output: ${language === "hi" ? "Hindi (Devanagari script)" : "English"}.

Patient Data:
- Symptoms reported: ${JSON.stringify(symptoms.map((s: any) => ({ name: s.name, region: s.bodyRegion, severity: s.severity || "moderate" })))}
- Age: ${patientProfile?.age || "Adult"} (${patientProfile?.ageGroup || "Adult"})
- Biological Sex: ${patientProfile?.biologicalSex || "unspecified"}
- Pregnancy Status: ${patientProfile?.isPregnant ? "Pregnant" : "Not pregnant/Not applicable"}
- Duration: ${patientProfile?.symptomsDuration || "Few days"}
- Severity Rating (1-10): ${patientProfile?.severityScale || 5}/10
- Onset: ${patientProfile?.onset || "Gradual"}
- Fever / Body Temp: ${patientProfile?.fever ? (patientProfile?.temperature ? `${patientProfile.temperature}°F` : "Fever present") : "No fever"}
- Pre-existing conditions: ${patientProfile?.preExistingConditions?.join(", ") || "None reported"}
- Additional Notes: ${patientProfile?.notes || "None"}

Perform a comprehensive medical triage evaluation and return a structured JSON response matching the schema.
Provide actionable dietary recommendations (recommended foods, items/irritants to avoid, hydration guidelines, and nutritional rationale) tailored to the patient's symptoms and conditions.
Also provide safe, non-pharmacological evidence-based home remedies (with title, preparation/usage instructions, and safety notes).
Ensure your response is compassionate, medically sound, and provides actionable guidance.
Classify urgency strictly into one of: "EMERGENCY" (Immediate ER/108 ambulance), "URGENT" (Clinic visit within 12-24 hours), "ROUTINE" (Consult doctor within a few days), "SELF_CARE" (Monitor at home with conservative measures).
`;

    if (ai) {
      try {
        const { response, modelUsed } = await generateContentWithFallback(ai, {
          contents: promptText,
          config: {
            systemInstruction: `You are an AI Clinical Triage System for Vrindavan Medical Assessment. Provide objective, evidence-based triage evaluations. Always include tailored dietary recommendations (what to eat, what to avoid, hydration) and safe supportive home remedies suited to the local context. Always include appropriate medical disclaimers that this is for informational triage and not a definitive diagnosis. Output must strictly follow the JSON schema.`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                urgency: {
                  type: Type.STRING,
                  description: "One of: EMERGENCY, URGENT, ROUTINE, SELF_CARE",
                },
                urgencyLabel: {
                  type: Type.STRING,
                  description: "User friendly title for urgency (e.g. Immediate Emergency Care Required)",
                },
                summary: {
                  type: Type.STRING,
                  description: "A 2-3 sentence clear clinical summary of the patient situation",
                },
                primaryConcerns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of key physiological or clinical concerns",
                },
                differentialDiagnoses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      conditionName: { type: Type.STRING },
                      likelihood: { type: Type.STRING, description: "High, Moderate, or Low" },
                      explanation: { type: Type.STRING },
                      matchedSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                      recommendedSpecialist: { type: Type.STRING },
                    },
                    required: ["conditionName", "likelihood", "explanation", "matchedSymptoms"],
                  },
                  description: "Top 2 to 4 potential conditions to consider",
                },
                immediateActions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Actionable steps to take right now",
                },
                dietaryRecommendations: {
                  type: Type.OBJECT,
                  properties: {
                    foodsToEat: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific soothing, healing, nutrient-rich foods to consume" },
                    foodsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific irritating, heavy, spicy, or symptom-aggravating foods to strictly avoid" },
                    hydrationTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable fluid intake & hydration guidelines (e.g. ORS, coconut water, warm infusions)" },
                    rationale: { type: Type.STRING, description: "Clinical rationale behind these dietary modifications" },
                  },
                  required: ["foodsToEat", "foodsToAvoid", "hydrationTips", "rationale"],
                  description: "Dietary adjustments tailored to the diagnosis",
                },
                homeRemedies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Name of the home remedy" },
                      instructions: { type: Type.STRING, description: "Clear step-by-step instructions on preparation and usage" },
                      safetyNote: { type: Type.STRING, description: "Important safety precautions or contraindications" },
                    },
                    required: ["title", "instructions"],
                  },
                  description: "Safe, evidence-based home remedies and supportive comfort measures",
                },
                redFlagsToWatch: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Critical symptoms that would warrant immediate escalation if they appear",
                },
                doctorQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-5 insightful questions the patient should ask their doctor during consultation",
                },
                homeCareTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Safe, non-pharmacological comfort/supportive care tips (e.g. hydration, rest)",
                },
                disclaimer: {
                  type: Type.STRING,
                  description: "Standard medical liability disclaimer",
                },
              },
              required: [
                "urgency",
                "urgencyLabel",
                "summary",
                "differentialDiagnoses",
                "immediateActions",
                "dietaryRecommendations",
                "homeRemedies",
                "redFlagsToWatch",
                "doctorQuestions",
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        return res.json({
          source: "gemini",
          model: modelUsed,
          assessment: parsed,
          timestamp: new Date().toISOString(),
        });
      } catch (geminiError: any) {
        console.warn("AI generation failed across candidates, seamlessly engaging verified clinical rules engine:", geminiError?.message || geminiError);
        // Fall back to rule-based engine below
      }
    }

    // Fallback Rule-Based Medical Engine (Ensures 100% operational reliability offline or if API key is not configured)
    const fallbackAssessment = generateRuleBasedAssessment(symptoms, patientProfile, language, hasEmergencyKeywords);
    return res.json({
      source: "clinical-rules-engine",
      assessment: fallbackAssessment,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in assess-symptoms:", error);
    res.status(500).json({ error: "Failed to generate medical symptom assessment", details: error.message });
  }
});

// Interactive AI Follow-up Q&A endpoint
app.post("/api/chat-followup", async (req, res) => {
  try {
    const { message, assessmentContext, conversationHistory = [], language = "en" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const historyFormatted = conversationHistory.map((item: any) => `${item.role === "user" ? "User" : "Assistant"}: ${item.text}`).join("\n");
        const prompt = `
You are the Vrindavan Medical Assistant answering a user's follow-up question regarding their recent symptom assessment.
Language requested: ${language === "hi" ? "Hindi (Devanagari)" : "English"}.

Assessment Context:
- Urgency: ${assessmentContext?.urgency || "Standard"}
- Reported Symptoms: ${JSON.stringify(assessmentContext?.symptoms || [])}
- Primary Conditions Considered: ${JSON.stringify(assessmentContext?.differentialDiagnoses?.map((d: any) => d.conditionName) || [])}

Conversation history:
${historyFormatted}

User Question: "${message}"

Provide a clear, reassuring, medically responsible answer. Mention safe supportive care, practical precautions, when to seek direct medical evaluation, and remind them that you are an AI assistant and not a replacement for a doctor's examination.
`;

        const { response } = await generateContentWithFallback(ai, {
          contents: prompt,
          config: {
            systemInstruction: "You are a warm, knowledgeable medical information assistant for Vrindavan Symptom Checker. Provide empathetic, accurate medical education and safety advice.",
          },
        });

        return res.json({
          reply: response.text,
        });
      } catch (chatErr: any) {
        console.warn("Chat AI generation error, using localized assistant guidance:", chatErr?.message || chatErr);
      }
    }

    // Rule-based fallback response
    let defaultReply = language === "hi"
      ? `आपके प्रश्न के लिए धन्यवाद। आपके द्वारा बताए गए लक्षणों के आधार पर, पर्याप्त आराम करना, पानी/ओआरएस का सेवन बनाए रखना और लक्षणों में किसी भी तरह की वृद्धि होने पर नजदीकी चिकित्सक (जैसे रामकृष्ण मिशन सेवाश्रम अस्पताल, वृन्दावन) से परामर्श लेना सबसे सुरक्षित रहेगा।`
      : `Thank you for your question. Based on the symptoms and assessment provided, the safest course of action is to rest, stay well-hydrated, monitor for any worsening signs (such as high fever or breathing difficulty), and consult a qualified healthcare provider (such as Ramakrishna Mission Hospital in Vrindavan) for a definitive clinical exam.`;

    return res.json({
      reply: defaultReply,
    });
  } catch (error: any) {
    console.error("Error in chat-followup:", error);
    res.status(500).json({ error: "Chat service unavailable", details: error.message });
  }
});

// Clinical Rule-Based Triage Generator
function generateRuleBasedAssessment(symptoms: any[], profile: any, language: string, hasEmergencyKeywords: boolean) {
  const isHindi = language === "hi";
  const names = symptoms.map((s) => s.name.toLowerCase());
  const severity = Number(profile?.severityScale) || 5;
  const isFever = Boolean(profile?.fever);

  let urgency = "ROUTINE";
  let urgencyLabel = isHindi ? "चिकित्सक से सामान्य परामर्श की सलाह" : "Routine Medical Consultation Recommended";

  if (hasEmergencyKeywords || severity >= 9 || names.some(n => n.includes("chest") && (n.includes("pain") || n.includes("tightness")))) {
    urgency = "EMERGENCY";
    urgencyLabel = isHindi ? "आपातकालीन चिकित्सा सहायता आवश्यक (Emergency 108)" : "Immediate Emergency Evaluation Required (Call 108 / 112)";
  } else if (severity >= 7 || isFever && severity >= 6 || names.some(n => n.includes("breath") || n.includes("stomach pain") || n.includes("high fever"))) {
    urgency = "URGENT";
    urgencyLabel = isHindi ? "शीघ्र क्लिनिक या अस्पताल जाएं (24 घंटे के भीतर)" : "Urgent Care Recommended (Within 12-24 Hours)";
  } else if (severity <= 3 && !isFever) {
    urgency = "SELF_CARE";
    urgencyLabel = isHindi ? "घर पर देखभाल एवं निगरानी" : "Home Care & Symptom Monitoring";
  }

  const differentials: any[] = [];
  
  if (names.some(n => n.includes("cough") || n.includes("cold") || n.includes("throat") || n.includes("fever") || n.includes("runny nose"))) {
    differentials.push({
      conditionName: isHindi ? "ऊपरी श्वसन पथ संक्रमण / मौसमी वायरल बुखार" : "Upper Respiratory Tract Infection / Viral Fever",
      likelihood: "High",
      explanation: isHindi ? "लक्षण मौसमी वायरल संक्रमण या ब्रोंकाइटिस से काफी मिलते-जुलते हैं।" : "Common cluster of symptoms typical of acute viral rhinovirus, influenza, or seasonal pharyngitis.",
      matchedSymptoms: symptoms.filter(s => /cough|fever|throat|nose|cold/i.test(s.name)).map(s => s.name),
      recommendedSpecialist: isHindi ? "सामान्य चिकित्सक (General Physician)" : "General Physician / ENT Specialist"
    });
  }

  if (names.some(n => n.includes("headache") || n.includes("migraine") || n.includes("dizziness"))) {
    differentials.push({
      conditionName: isHindi ? "तनाव या माइग्रेन सिरदर्द" : "Tension Headache / Migraine Cephalea",
      likelihood: "Moderate",
      explanation: isHindi ? "तनाव, निर्जलीकरण, नींद की कमी या साइनस दबाव के कारण सिरदर्द की संभावना।" : "Often triggered by muscular strain, dehydration, prolonged eye-strain, or vascular migraine patterns.",
      matchedSymptoms: symptoms.filter(s => /headache|dizziness|scalp|migraine/i.test(s.name)).map(s => s.name),
      recommendedSpecialist: isHindi ? "न्यूरोलॉजिस्ट / सामान्य चिकित्सक" : "General Physician / Neurologist"
    });
  }

  if (names.some(n => n.includes("stomach") || n.includes("abdomen") || n.includes("nausea") || n.includes("diarrhea") || n.includes("vomiting") || n.includes("acidity"))) {
    differentials.push({
      conditionName: isHindi ? "तीव्र आंत्रशोथ / अपच (Gastroenteritis / Dyspepsia)" : "Acute Gastroenteritis / Dyspepsia",
      likelihood: "High",
      explanation: isHindi ? "खान-पान में बदलाव, जीवाणु/विषाणु संक्रमण या हाइपर-एसिडिटी से संबंधित।" : "Gastrointestinal irritation commonly secondary to foodborne pathogens, osmotic imbalance, or acid reflux.",
      matchedSymptoms: symptoms.filter(s => /stomach|abdomen|nausea|vomiting|diarrhea|acidity/i.test(s.name)).map(s => s.name),
      recommendedSpecialist: isHindi ? "गैस्ट्रोएंटेरोलॉजिस्ट / चिकित्सक" : "Gastroenterologist / General Physician"
    });
  }

  if (names.some(n => n.includes("joint") || n.includes("back") || n.includes("muscle") || n.includes("neck") || n.includes("knee") || n.includes("pain"))) {
    differentials.push({
      conditionName: isHindi ? "मस्कुलोस्केलेटल खिंचाव / स्पॉन्डिलाइटिस" : "Musculoskeletal Strain / Lumbago / Spondylosis",
      likelihood: "Moderate",
      explanation: isHindi ? "शारीरिक थकान, गलत मुद्रा या जोड़ों की सूजन से मांसपेशियों में दर्द।" : "Mechanical back/joint discomfort caused by posture, physical exertion, or localized soft tissue inflammation.",
      matchedSymptoms: symptoms.filter(s => /joint|back|muscle|knee|neck|pain/i.test(s.name)).map(s => s.name),
      recommendedSpecialist: isHindi ? "ऑर्थोपेडिक सर्जन / फिजियोथेरेपिस्ट" : "Orthopedic Specialist / Physical Therapist"
    });
  }

  if (differentials.length === 0) {
    differentials.push({
      conditionName: isHindi ? "सामान्य शारीरिक अस्वस्थता / लक्षण संकुल" : "General Symptom Cluster / Clinical Malaise",
      likelihood: "Moderate",
      explanation: isHindi ? "लक्षणों के सटीक कारण का पता लगाने के लिए डॉक्टर द्वारा प्रत्यक्ष परीक्षण आवश्यक है।" : "A combination of reported localized discomfort requiring standard physical examination and evaluation.",
      matchedSymptoms: symptoms.map(s => s.name),
      recommendedSpecialist: isHindi ? "सामान्य चिकित्सक" : "General Physician"
    });
  }

  // Symptom-specific dietary adjustments
  let dietaryRecommendations;
  let homeRemedies;

  if (names.some(n => n.includes("stomach") || n.includes("abdomen") || n.includes("nausea") || n.includes("diarrhea") || n.includes("vomiting") || n.includes("acidity"))) {
    dietaryRecommendations = {
      foodsToEat: isHindi
        ? [
            "हल्की मूंग दाल की खिचड़ी, दलिया और उबले चावल",
            "ताजा छाछ (जीरा-सेंधा नमक युक्त) और ताजा दही",
            "उबला हुआ सेब (Stewed Apple) और केला (BRAT डाइट)",
            "हल्का नारियल पानी और उबला ठंडा किया हुआ पानी"
          ]
        : [
            "Light Moong Dal Khichdi, plain oatmeal, and boiled white rice",
            "Fresh buttermilk (chhaas) tempered with cumin & rock salt, probiotic curd",
            "Bananas, applesauce, boiled potatoes, and plain toast (BRAT diet)",
            "Tender coconut water, clear vegetable broth, and electrolyte water"
          ],
      foodsToAvoid: isHindi
        ? [
            "तले-भुने और अत्यधिक मसालेदार या मिर्च वाले भोजन",
            "दूध से बनी भारी मिठाइयां (खोया, पेड़ा) और जंक फूड",
            "कैफीन, चाय, कॉफी और कार्बोनेटेड शीतल पेय",
            "कच्चे सलाद और बिना धुले कटे हुए फल"
          ]
        : [
            "Deep-fried, oily, and intensely spicy street food or rich gravies",
            "Heavy condensed dairy sweets (Mithai/Khoya) and refined sugars",
            "Caffeine, dark coffee, acidic sodas, and carbonated beverages",
            "Raw unpeeled vegetables, street salads, and heavily fermented foods"
          ],
      hydrationTips: isHindi
        ? [
            "हर 20-30 मिनट में घूंट-घूंट करके ओआरएस (ORS) या इलेक्ट्रोलाइट युक्त पानी पिएं",
            "दिन भर में कम से कम 2.5 से 3 लीटर उबला या शुद्ध पानी पिएं",
            "भोजन के तुरंत बाद ढेर सारा पानी पीने से बचें; भोजन के 30 मिनट बाद पिएं"
          ]
        : [
            "Sip WHO-formula Oral Rehydration Solution (ORS) or coconut water in small, frequent amounts",
            "Consume 2.5 to 3.0 liters of boiled and cooled water throughout the day",
            "Avoid chugging large volumes at once to prevent provoking nausea or gastric distension"
          ],
      rationale: isHindi
        ? "पाचन तंत्र की सूजन कम करने, आंतों को आराम देने और निर्जलीकरण व इलेक्ट्रोलाइट्स की कमी को रोकने के लिए सुपाच्य और शांत करने वाला आहार आवश्यक है।"
        : "Supports gut mucosal barrier recovery, prevents dehydration/electrolyte depletion, and minimizes gastric motility stress."
    };

    homeRemedies = [
      {
        title: isHindi ? "अदरक और पुदीना का काढ़ा / अर्क" : "Warm Ginger-Mint Infusion",
        instructions: isHindi
          ? "एक कप पानी में थोड़ा ताजा अदरक और 4-5 पुदीने की पत्तियां उबालें। छानकर गुनगुना पिएं।"
          : "Boil 1 cup of water with a thin slice of fresh ginger and 4-5 crushed mint leaves. Strain and sip warm after meals.",
        safetyNote: isHindi ? "यदि गंभीर एसिडिटी या पेट में छाले हों तो अदरक की मात्रा कम रखें।" : "Use mild concentration if experiencing severe hyperacidity or active peptic ulcers."
      },
      {
        title: isHindi ? "भुना जीरा और सेंधा नमक छाछ" : "Cumin & Rock Salt Buttermilk",
        instructions: isHindi
          ? "एक ग्लास ताजी छाछ में 1/4 चम्मच भुना हुआ जीरा पाउडर और चुटकी भर सेंधा नमक मिलाकर दोपहर के भोजन के साथ लें।"
          : "Mix 1/4 tsp roasted cumin powder and a pinch of pink rock salt into 1 glass of fresh, light buttermilk.",
        safetyNote: isHindi ? "रात के समय ठंडी छाछ पीने से बचें।" : "Consume during daytime; avoid chilled dairy late at night."
      },
      {
        title: isHindi ? "पेट पर गर्म सिकाई (Hot Water Compress)" : "Gentle Abdominal Warm Compress",
        instructions: isHindi
          ? "हल्के पेट दर्द या ऐंठन में गर्म पानी की थैली से पेट पर 10-15 मिनट धीरे-धीरे सिकाई करें।"
          : "Apply a warm water heating pad over the lower abdomen for 10-15 minutes to relax smooth muscle spasms.",
        safetyNote: isHindi ? "अत्यधिक तेज या दाहिने निचले हिस्से में अचानक उठे दर्द (एपेंडिसाइटिस का संकेत) में सिकाई न करें।" : "Do not apply heat if acute appendicitis (sharp right lower quadrant pain) is suspected."
      }
    ];
  } else if (names.some(n => n.includes("cough") || n.includes("cold") || n.includes("throat") || n.includes("fever") || n.includes("runny nose"))) {
    dietaryRecommendations = {
      foodsToEat: isHindi
        ? [
            "गरमा-गरम वेज सूप, दाल का पानी और पतली मूंग दाल खिचड़ी",
            "तुलसी-अदरक युक्त गुनगुनी हर्बल चाय और गर्म पानी",
            "विटामिन सी युक्त ताजे पके फल (जैसे पपीता, चीकू, संतरा)",
            "हल्दी वाला गुनगुना दूध (गोल्डन मिल्क) रात को सोने से पहले"
          ]
        : [
            "Warm vegetable broths, clear lentil soups, and light steamed rice porridge",
            "Tulsi (Holy Basil) & ginger herbal infusions with a dash of raw honey",
            "Vitamin C and antioxidant-rich soft fruits (papaya, citrus, cooked apples)",
            "Warm turmeric golden milk (Haldi Doodh) before bedtime"
          ],
      foodsToAvoid: isHindi
        ? [
            "फ्रिज का ठंडा पानी, आइसक्रीम और कोल्ड ड्रिंक्स",
            "अत्यधिक खट्टे, भारी तले हुए पकवान और कचौड़ी/समोसा",
            "शाम या रात के समय ठंडा दही या भारी चावल",
            "सिगरेट का धुआं और धूल-प्रदूषण वाले वातावरण में बिना मास्क रहना"
          ]
        : [
            "Refrigerated iced water, frozen desserts, and chilled carbonated drinks",
            "Greasy, deep-fried street savories (kachoris, pakoras) that irritate throat mucosa",
            "Cold curd/yogurt or heavy cream late in the evening",
            "Exposure to tobacco smoke, unventilated woodsmoke, or excessive dust"
          ],
      hydrationTips: isHindi
        ? [
            "दिन भर में हर 1 घंटे में थोड़ा-थोड़ा गुनगुना पानी पिएं",
            "गले की नमी और कफ को पतला करने के लिए दिन में 3-4 बार गर्म पेय लें"
          ]
        : [
            "Sip warm water consistently throughout the day (at least 2.5L/day)",
            "Consume warm herbal infusions to soothe pharyngeal irritation and thin bronchial secretions"
          ],
      rationale: isHindi
        ? "शरीर की प्रतिरक्षा प्रणाली (इम्यूनिटी) को ऊर्जा प्रदान करने, बलगम को पतला करने और गले की जलन को शांत करने में सहायक।"
        : "Hydrates mucosal membranes, accelerates viral clearance, and reduces pharyngeal tissue inflammation."
    };

    homeRemedies = [
      {
        title: isHindi ? "गुनगुने नमक पानी के गरारे (Warm Saline Gargle)" : "Warm Saline Throat Gargles",
        instructions: isHindi
          ? "एक ग्लास गुनगुने पानी में 1/2 चम्मच सादा नमक मिलाएं। दिन में 2-3 बार 2 मिनट तक गरारे करें।"
          : "Dissolve 1/2 tsp of non-iodized/regular salt in 1 cup of warm water. Gargle for 30-60 seconds, 3 times daily.",
        safetyNote: isHindi ? "पानी को निगलने से बचें; पानी बहुत गर्म नहीं होना चाहिए।" : "Do not swallow the saline solution. Ensure water temperature is comfortable."
      },
      {
        title: isHindi ? "तुलसी-अदरक-शहद का अर्क" : "Tulsi-Ginger Honey Soother",
        instructions: isHindi
          ? "ताजा अदरक का रस और 4-5 तुलसी की पत्तियों का रस निकालें, 1 चम्मच शुद्ध शहद मिलाकर दिन में 2 बार लें।"
          : "Extract 1 tsp fresh ginger juice, add 4 crushed tulsi leaves and 1 tsp pure honey. Consume twice daily for throat soothing.",
        safetyNote: isHindi ? "1 वर्ष से कम उम्र के बच्चों को शहद कभी न दें।" : "Never administer raw honey to infants under 12 months of age."
      },
      {
        title: isHindi ? "भाप लेना (Steam Inhalation)" : "Steam Inhalation Therapy",
        instructions: isHindi
          ? "एक बर्तन में गर्म पानी लेकर तौलिए से सिर ढककर 5-10 मिनट गहरी सांस लें। (चाहें तो अजवाइन या पुदीना अर्क मिला सकते हैं)।"
          : "Inhale steam from a bowl of hot water with a towel draped over your head for 8-10 minutes twice daily.",
        safetyNote: isHindi ? "गर्म पानी के गिरने से बचें और सुरक्षित दूरी बनाकर रखें।" : "Maintain a safe distance of at least 20cm to avoid facial steam scalds."
      }
    ];
  } else if (names.some(n => n.includes("joint") || n.includes("back") || n.includes("muscle") || n.includes("neck") || n.includes("knee") || n.includes("pain"))) {
    dietaryRecommendations = {
      foodsToEat: isHindi
        ? [
            "एंटी-इंफ्लेमेटरी खाद्य पदार्थ: हल्दी, अदरक, लहसुन और मेथी दाना",
            "कैल्शियम और मैग्नीशियम युक्त आहार: तिल, बादाम, हरी पत्तेदार सब्जियां",
            "हल्की मूंग दाल, उबली सब्जियां और अखरोट",
            "रात में 1 चुटकी सोंठ और हल्दी के साथ गुनगुना दूध"
          ]
        : [
            "Anti-inflammatory whole foods: Turmeric, ginger, garlic, and soaked fenugreek seeds",
            "Magnesium and calcium-rich foods: Sesame seeds, almonds, steamed dark leafy greens",
            "Omega-3 sources: Walnuts, chia seeds, and light vegetable broths",
            "Warm golden milk infused with a pinch of dry ginger powder before sleep"
          ],
      foodsToAvoid: isHindi
        ? [
            "अत्यधिक प्रोसेस्ड भोजन, रिफाइंड चीनी और बासी खाना",
            "बहुत अधिक खट्टे या बादी करने वाले खाद्य पदार्थ (जैसे उड़द दाल, बैंगन)",
            "ठंडे व वात वर्धक पेय पदार्थ"
          ]
        : [
            "Ultra-processed snack foods, refined sugars, and trans-fats",
            "Excessive nightshades or heavy fermentables if sensitive",
            "Ice-cold beverages and prolonged fasting that destabilizes metabolic energy"
          ],
      hydrationTips: isHindi
        ? [
            "मांसपेशियों के लचीलेपन और जोड़ों के स्नेहन (Lubrication) के लिए दिन भर पर्याप्त पानी पिएं",
            "सुबह खाली पेट गुनगुना पानी पीने की आदत डालें"
          ]
        : [
            "Maintain optimal cellular hydration (2.5L-3L daily) to support disc and synovial joint lubrication",
            "Drink warm water upon waking to stimulate metabolic circulation"
          ],
      rationale: isHindi
        ? "जोड़ों और मांसपेशियों की सूजन (Inflammation) को प्राकृतिक रूप से कम करने और ऊतक मरम्मत में सहायता करने के लिए।"
        : "Minimizes systemic inflammatory cytokines and promotes musculoskeletal soft-tissue recovery."
    };

    homeRemedies = [
      {
        title: isHindi ? "गर्म व ठंडी सिकाई (Hot / Cold Therapy)" : "Contrast Hot/Cold Therapy",
        instructions: isHindi
          ? "तीव्र दर्द/सूजन में पहले 48 घंटे बर्फ की थैली से 10-15 मिनट सिकाई करें; पुरानी जकड़न में गर्म तौलिया या हीटिंग पैड लगाएं।"
          : "Use an ice pack for 10-15 min during acute flare-ups; use moist heat for chronic stiffness and muscular spasms.",
        safetyNote: isHindi ? "बर्फ को सीधे त्वचा पर न लगाएं; कपड़े में लपेटकर इस्तेमाल करें।" : "Never apply ice directly to bare skin; wrap in a protective cloth barrier."
      },
      {
        title: isHindi ? "हल्का तिल तेल या महानारायण तेल मालिश" : "Warm Herbal Oil Gentle Massage",
        instructions: isHindi
          ? "गुनगुने तिल के तेल से दर्द वाले हिस्से पर हल्के हाथों से गोलाकार मालिश करें, फिर गुनगुने पानी से नहाएं।"
          : "Gently massage affected joints or lower back with warm sesame oil using gentle circular strokes.",
        safetyNote: isHindi ? "तीव्र चोट या सूजन वाले स्थान पर जोर से दबाव न डालें।" : "Avoid deep pressure over acute fractures, open lesions, or severely swollen joints."
      }
    ];
  } else {
    // General restorative supportive diet & remedies
    dietaryRecommendations = {
      foodsToEat: isHindi
        ? [
            "हल्का, ताजा और पौष्टिक घर का बना भोजन (दाल, हरी सब्जियां, रोटी/चावल)",
            "मौसमी फल, नारियल पानी और ताजे फलों का रस",
            "सुपाच्य सूप और प्रोटीन युक्त हल्की दालें"
          ]
        : [
            "Light, balanced, home-cooked whole meals (lentils, fresh greens, whole grains)",
            "Fresh seasonal fruits, tender coconut water, and antioxidant-rich berries",
            "Clear nourishing vegetable broths and easily digestible proteins"
          ],
      foodsToAvoid: isHindi
        ? [
            "बासी खाना, अत्यधिक तला-भुना और पैकेज्ड जंक फूड",
            "अत्यधिक कैफीन, तंबाकू और अतिरिक्त चीनी"
          ]
        : [
            "Stale, deep-fried fast foods and highly processed snacks",
            "Excessive caffeine, refined sugars, and late-night heavy meals"
          ],
      hydrationTips: isHindi
        ? [
            "दिन भर में 8 से 10 ग्लास (2.5 - 3 लीटर) शुद्ध पानी पिएं",
            "नींबू पानी या नारियल पानी से इलेक्ट्रोलाइट संतुलन बनाए रखें"
          ]
        : [
            "Drink 8-10 glasses (2.5 - 3.0 liters) of clean water daily",
            "Incorporate fresh lemon water or coconut water for balanced electrolytes"
          ],
      rationale: isHindi
        ? "शरीर की प्राकृतिक रोग प्रतिरोधक क्षमता को बनाए रखने और ऊर्जा का स्तर सुधारने के लिए।"
        : "Enhances baseline metabolic recovery, cellular repair, and physiological resilience."
    };

    homeRemedies = [
      {
        title: isHindi ? "पर्याप्त विश्राम और 7-8 घंटे की गहरी नींद" : "Restorative Rest & Sleep Optimization",
        instructions: isHindi
          ? "शांत और हवादार कमरे में कम से कम 7-8 घंटे की निर्बाध नींद लें।"
          : "Rest in a quiet, well-ventilated room and ensure 7-8 hours of continuous sleep.",
        safetyNote: isHindi ? "सोने से 1 घंटे पहले मोबाइल या स्क्रीन का उपयोग बंद करें।" : "Avoid digital blue-light screens 1 hour prior to sleep."
      },
      {
        title: isHindi ? "प्राणायाम एवं गहरी सांस लेने का अभ्यास" : "Gentle Deep Breathing (Pranayama)",
        instructions: isHindi
          ? "सुखासन में बैठकर 5-10 मिनट धीमी और गहरी सांस लें और छोड़ें।"
          : "Sit comfortably and practice 5-10 minutes of slow, diaphragmatic breathing to lower physical stress.",
        safetyNote: isHindi ? "यदि चक्कर आए तो सामान्य रूप से सांस लें।" : "Cease practice if feeling dizzy or lightheaded."
      }
    ];
  }

  return {
    urgency,
    urgencyLabel,
    summary: isHindi 
      ? `दर्ज किए गए ${symptoms.length} लक्षणों और स्वास्थ्य इतिहास के आधार पर, स्थिति को '${urgencyLabel}' के रूप में वर्गीकृत किया गया है।`
      : `Based on the ${symptoms.length} reported symptoms and clinical profile, your assessment is categorized as '${urgencyLabel}'.`,
    primaryConcerns: isHindi
      ? ["लक्षणों की तीव्रता की निगरानी", "पर्याप्त जलयोजन और विश्राम", "आवश्यकतानुसार विशेषज्ञ से परामर्श"]
      : ["Symptom progression and intensity monitoring", "Proper hydration and physiological rest", "Medical evaluation to rule out acute pathology"],
    differentialDiagnoses: differentials,
    immediateActions: isHindi
      ? [
          "वर्तमान लक्षणों का समय और तीव्रता नोट करें",
          "भरपूर पानी और हल्का सुपाच्य भोजन लें",
          "यदि लक्षण बढ़ें तो तुरंत नजदीकी चिकित्सा केंद्र से संपर्क करें"
        ]
      : [
          "Record when symptoms flare or change in character",
          "Stay hydrated and avoid strenuous physical exertion",
          "Consult with a licensed medical professional for formal clinical testing"
        ],
    dietaryRecommendations,
    homeRemedies,
    redFlagsToWatch: isHindi
      ? [
          "सांस लेने में अत्यधिक कठिनाई या छाती में दबाव",
          "तेज बुखार (103°F से अधिक) जो दवा से कम न हो",
          "अचानक बोलने में लड़खड़ाहट या अंगों में कमजोरी",
          "लगातार उल्टी या रक्तस्त्राव"
        ]
      : [
          "Sudden onset severe chest tightness or radiation to jaw/left arm",
          "High fever exceeding 103°F (39.4°C) with neck stiffness",
          "Sudden neurological weakness, speech difficulty, or visual blackout",
          "Persistent inability to keep liquids down or blood in vomit/stool"
        ],
    doctorQuestions: isHindi
      ? [
          "क्या इन लक्षणों के लिए कोई विशिष्ट रक्त जांच या इमेजिंग आवश्यक है?",
          "मुझे कौन सी सावधानियां बरतनी चाहिए?",
          "लक्षण कितने दिनों में ठीक होने की उम्मीद है?",
          "क्या यह मेरी पिछली स्वास्थ्य समस्याओं से संबंधित है?"
        ]
      : [
          "What diagnostic tests (blood panel, imaging, cultures) do you recommend?",
          "Are there specific activity or dietary restrictions I should observe?",
          "What is the expected timeframe for full resolution?",
          "Could any of my current medications or medical history be contributing?"
        ],
    homeCareTips: isHindi
      ? [
          "पर्याप्त आराम करें (कम से कम 7-8 घंटे की नींद)",
          "गुनगुना पानी और इलेक्ट्रोलाइट्स लें",
          "धूम्रपान या भारी भोजन से परहेज करें"
        ]
      : [
          "Ensure adequate rest and restorative sleep",
          "Drink warm fluids and electrolyte-rich broths or ORS",
          "Avoid heavy, greasy meals and tobacco exposure"
        ],
    disclaimer: isHindi
      ? "यह सारांश केवल प्राथमिक जानकारी एवं मार्गदर्शन के लिए है। यह किसी पेशेवर चिकित्सा निदान या उपचार का विकल्प नहीं है।"
      : "This assessment is generated for preliminary triage and educational purposes only. It is not a substitute for clinical diagnosis or emergency medical care."
  };
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vrindavan Symptom Checker server running on http://localhost:${PORT}`);
  });
}

startServer();
