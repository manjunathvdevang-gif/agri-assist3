
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTIONS: Record<Language, string> = {
  en: "You are Agri-Sahayak, a friendly agricultural AI. Help farmers with crop advice, weather, and market listings. Always respond in English. When a user describes a crop to sell, extract details in JSON format.",
  hi: "आप कृषि-सहायक हैं, एक मित्रवत कृषि AI। किसानों की सहायता करें। हमेशा हिंदी में उत्तर दें।",
  kn: "ನೀವು ಅಗ್ರಿ-ಸಹಾಯಕ್, ಸ್ನೇಹಪರ ಕೃಷಿ AI. ಬೆಳೆ ಸಲಹೆ, ಹವಾಮಾನ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಪಟ್ಟಿಗಳೊಂದಿಗೆ ರೈತರಿಗೆ ಸಹಾಯ ಮಾಡಿ. ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
  te: "మీరు అగ్రి-సహాయక్, స్నేహపూర్వక వ్యవసాయ AI. పంటల సలహాలు, వాతావరణం మరియు మార్కెట్ జాబితాలతో రైతులకు సహాయం చేయండి. ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి.",
  ta: "நீங்கள் அக்ரி-சஹாயக், ஒரு நட்பு விவசாய AI. பயிர் ஆலோசனை, வானிலை மற்றும் சந்தை பட்டியல்களில் விவசாயிகளுக்கு உதவுங்கள். எப்போதும் தமிழில் பதிலளிக்கவும்.",
  mr: "तुम्ही कृषि-सहाय्यक आहात, एक अनुकूल कृषी AI. शेतकऱ्यांना पीक सल्ला, हवामान आणि बाजार सूचीमध्ये मदत करा. नेहमी मराठीत उत्तर द्या.",
  ml: "നിങ്ങൾ അഗ്രി-സഹായക് ആണ്, സൗഹൃദപരമായ കാർഷിക AI. കർഷകരെ സഹായിക്കുക. എപ്പോഴും മലയാളത്തിൽ മറുപടി നൽകുക.",
  gu: "તમે એગ્રી-સહાયક છો, એક મૈત્રીપૂર્ણ કૃષિ AI. ખેડૂતોને મદદ કરો. હંમેશા ગુજરાતીમાં જવાબ આપો.",
  bn: "আপনি এগ্রি-সহায়ক, একজন বন্ধুত্বপূর্ণ কৃষি এআই। কৃষকদের সাহায্য করুন। সর্বদা বাংলায় উত্তর দিন।",
  pa: "ਤੁਸੀਂ ਐਗਰੀ-ਸਹਾਇਕ ਹੋ, ਇੱਕ ਦੋਸਤਾਨਾ ਖੇਤੀਬਾੜੀ AI। ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ ਕਰੋ। ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।",
  or: "ଆପଣ ଏଗ୍ରି-ସହାୟକ, ଜଣେ ବନ୍ଧୁତ୍ୱପୂର୍ଣ୍ଣ କୃଷି AI | କୃଷକମାନଙ୍କୁ ସାହାଯ୍ୟ କରନ୍ତୁ | ସର୍ବଦା ଓଡିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ |",
  as: "আপুনি এগ্ৰি-সহায়ক, এজন বন্ধুত্বপূর্ণ কৃষি AI। কৃষকসকলক শস্যৰ পৰামৰ্শ, বতৰ আৰু বজাৰৰ তালিকাভুক্ত কৰাত সহায় কৰক। সদায় অসমীয়াত উত্তৰ দিব।",
  ur: "آپ ایگری سہائک ہیں، ایک دوستانہ زرعی AI۔ کسانوں کی فصل کے مشورے، موسم اور مارکیٹ کی فہرست سازی میں مدد کریں۔ ہمیشہ اردو میں جواب دیں۔"
};

export const getAssistantResponse = async (prompt: string, language: Language) => {
  try {
    const isListingRequest = prompt.toLowerCase().includes("list") || prompt.toLowerCase().includes("sell") || prompt.toLowerCase().includes("बेचना");
    
    const response = await ai.models.generateContent({
      model: isListingRequest ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTIONS[language]}. If the user wants to list or sell a crop, you MUST include a JSON object like {"action": "list", "crop": "Name", "qty": "Number", "unit": "Unit", "price": "Number"} in your response.`,
      },
    });

    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Assistant Error:", error);
    return { text: "Error connecting to Agri-Sahayak.", sources: [] };
  }
};

export const getWeatherDetails = async (location: string) => {
  try {
    const prompt = `Get the current live weather and a 3-day forecast for ${location}.
    Include current temperature (in Celsius), condition (e.g., Cloudy, Sunny), humidity %, wind speed (km/h), and UV index.
    CRITICAL: Identify any specific farming risks or proactive alerts for the next 3 days (e.g., "Heavy rain expected tomorrow - secure hay", "Frost risk on Tuesday - water crops").
    ALSO: Provide a short, actionable "Farming Advisory" for today based on the conditions (e.g., "Ideal conditions for fertilizer application" or "Avoid spraying pesticides due to high winds").
    Return strictly as JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            current: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.STRING },
                condition: { type: Type.STRING },
                humidity: { type: Type.STRING },
                wind: { type: Type.STRING },
                uv: { type: Type.STRING }
              }
            },
            alerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of severe weather alerts or warnings."
            },
            advisory: {
              type: Type.STRING,
              description: "Actionable farming advice based on weather."
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  temp: { type: Type.STRING },
                  condition: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
};

export const getPriceSuggestion = async (cropName: string, location: string, language: Language) => {
  try {
    const prompt = `Suggest a fair selling price for "${cropName}" in "${location}" per Quintal. Briefly explain based on current season. Respond only in ${language}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a market expert. Provide a realistic price suggestion in ${language}.`
      }
    });
    return response.text;
  } catch (error) {
    return "Could not fetch price suggestion.";
  }
};

export const generateSpeech = async (text: string, language: Language) => {
  try {
    // Clean text of any JSON before speaking
    const textToSpeak = text.replace(/\{.*\}/s, "").trim();
    const voiceInstruct = `Speak this clearly in ${language}: ${textToSpeak}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: voiceInstruct }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data; // Base64 PCM
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

export const analyzeSoilData = async (data: { ph: string, n: string, p: string, k: string, moisture: string }) => {
  const prompt = `Analyze this soil data: pH: ${data.ph}, Nitrogen (N): ${data.n}, Phosphorus (P): ${data.p}, Potassium (K): ${data.k}, Moisture: ${data.moisture}%. 
  Suggest the best 3 crops for this soil and explain why simply. Mention any treatment needed.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 5000 } }
  });
  return response.text;
};

export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          { inlineData: { mimeType: 'audio/pcm;rate=16000', data: base64Audio } }, 
          { text: "Transcribe the agricultural query accurately, even if it is in a regional Indian language like Kannada, Hindi, Telugu, Tamil, Marathi, Malayalam, Gujarati, Bengali, Punjabi, Odia, Assamese or Urdu." }
        ] 
      },
    });
    return response.text || "";
  } catch (e) {
    console.error("Transcription Error:", e);
    return "";
  }
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
