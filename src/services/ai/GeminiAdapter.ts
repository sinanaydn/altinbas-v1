import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import logger from '../../utils/logging';
import { AnalysisPrompts } from './Prompts';

export interface GeminiAnalysisResult {
    headline?: string;
    subheadline?: string;
    description?: string;
    call_to_action?: string;
    design_suggestions: string;
    visual_description?: string;
    category?: string;
    color_palette?: string[];
    product_bounding_box?: number[]; // [ymin, xmin, ymax, xmax]
    // Deprecated but kept for compatibility until full cleanup
    gold_purity?: string;
    gemstone?: string;
    metal_color?: string;
    material?: string;
}

export class GeminiAdapter {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables.');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    }

    /**
     * Analyzes an image buffer to extract jewelry attributes and marketing concepts.
     */
    public async analyzeImage(imageBuffer: Buffer, mimeType: string, context?: any): Promise<GeminiAnalysisResult> {
        logger.info('Sending image to Gemini for analysis...');

        try {
            const contextString = context ?
                `Category: ${context.category}, Material: ${context.material}, Gemstone: ${context.gemstone}` : '';

            const prompt = AnalysisPrompts.PRODUCT_ANALYSIS(contextString);

            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType
                },
            };

            const result = await this.model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            logger.info('Gemini analysis complete.');

            // Clean up markdown code blocks if present (e.g. ```json ... ```)
            const cleanJson = text.replace(/```json|```/g, '').trim();

            return JSON.parse(cleanJson) as GeminiAnalysisResult;
        } catch (error: any) {
            logger.error('Gemini analysis failed', { error: error.message });
            throw new Error(`Gemini Analysis Failed: ${error.message}`);
        }
    }
}
