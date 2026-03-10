
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { PackageDetails, CarrierQuote, Language } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    // Check both process.env (Node/Vite define) and import.meta.env (Vite client)
    const apiKey = (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : null) || 
                   (import.meta.env?.VITE_GEMINI_API_KEY);
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please set it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getShippingQuotes = async (details: PackageDetails): Promise<CarrierQuote[]> => {
  const ai = getAI();
  const prompt = `Generate realistic shipping quotes for a package with the following details:
    Weight: ${details.weight} lbs
    Dimensions: ${details.length}x${details.width}x${details.height} inches
    From Address:
      Street: ${details.from.street || 'N/A'}
      City: ${details.from.city}
      State: ${details.from.state}
      Zip: ${details.from.zip}
      Country: ${details.from.country}
    To Address:
      Street: ${details.to.street || 'N/A'}
      City: ${details.to.city}
      State: ${details.to.state}
      Zip: ${details.to.zip}
      Country: ${details.to.country}
    International: ${details.isInternational}

    Provide quotes for FedEx, UPS, DHL, and USPS. 
    Return only a JSON array of quotes.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            carrier: { type: Type.STRING, description: 'One of: FedEx, UPS, DHL, USPS' },
            serviceName: { type: Type.STRING, description: 'Name of the shipping service tier' },
            basePrice: { type: Type.NUMBER, description: 'The raw shipping cost in USD' },
            estimatedDays: { type: Type.NUMBER, description: 'Delivery duration in business days' }
          },
          required: ['carrier', 'serviceName', 'basePrice', 'estimatedDays']
        }
      }
    }
  });

  try {
    const text = response.text?.trim() || "[]";
    return JSON.parse(text) as CarrierQuote[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to calculate quotes. Please try again.");
  }
};

export const createSupportChat = (language: Language = 'en'): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3.1-pro-preview',
    config: {
      systemInstruction: `You are the Mail World Office Support AI. 
      Your goal is to help users navigate the shipping hub.
      Current User Language: ${language === 'es' ? 'Spanish' : 'English'}. 
      Always respond in the user's preferred language (${language === 'es' ? 'Spanish' : 'English'}).
      
      Key Facts:
      - App: Mail World Office Ship Quote.
      - Carriers: FedEx, UPS, DHL, USPS.
      - Elite Membership: Costs $9.99 (one-time). Benefits: 5% discount on all quotes, unlimited quotes (free tier has 3), and 5% off in-store items at physical locations.
      - Local Pickup: Free within a 15-mile radius of Tulsa, OK. Outside that radius, it's a $7.00 fee.
      - Labels: Once purchased, labels are sent to email and available for download in the "Billing" tab.
      - Tracking: Tracking numbers are generated immediately upon label purchase.
      - iPostal1: Mention we are affiliated with iPostal1 for virtual mailboxes.
      Keep responses professional, helpful, and under 3 sentences unless asked for detail.`,
    }
  });
};
