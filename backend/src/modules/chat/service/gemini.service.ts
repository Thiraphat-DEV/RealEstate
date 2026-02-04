import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { ChatTurnDto } from '../dto';

const REAL_ESTATE_SYSTEM_PROMPT = `You are a friendly Real Estate assistant for a property listing website. You help users:
- Find properties (condos, houses, land) by location, price, bedrooms, etc.
- Understand the buying/renting process in Thailand.
- Get general advice about areas, neighborhoods, and property types.

Keep answers concise, helpful, and in the same language the user writes in (Thai or English).
If you don't have access to live listings, suggest they use the website search or contact an agent for specific properties.
Do not make up property listings or prices.`;

const SUPPORTED_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-flash-002',
  'gemini-1.5-pro-002',
];

@Injectable()
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  private modelName: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const envModel = (this.configService.get<string>('GEMINI_MODEL') || '').trim();
    const useModel =
      envModel !== '' && SUPPORTED_MODELS.includes(envModel)
        ? envModel
        : 'gemini-1.5-flash';
    this.modelName = useModel;
    if (apiKey) {
      try {
        this.genAI = new GoogleGenAI({ apiKey });
      } catch (error) {
        // Failed to initialize
      }
    }
  }

  isAvailable(): boolean {
    return this.genAI !== null;
  }

  async chat(message: string, history?: ChatTurnDto[]): Promise<string> {
    if (!this.genAI) {
      return 'Chat is not configured. Please set GEMINI_API_KEY in the server environment.';
    }

    try {
      const prompt =
        REAL_ESTATE_SYSTEM_PROMPT +
        '\n\n---\n\n' +
        (history && history.length > 0
          ? history.map((t) => `${t.role}: ${t.text}`).join('\n') + '\nuser: ' + message
          : 'user: ' + message);

      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      const resp = response as { text?: string } & {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text =
        resp?.text ??
        resp?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '';

      return text || 'I could not generate a response. Please try again.';
    } catch (error) {
      const err = error as Error;
      return `Sorry, something went wrong: ${err.message || 'Unknown error'}. Please try again.`;
    }
  }
}
