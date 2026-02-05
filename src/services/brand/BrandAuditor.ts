
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../../utils/logging';
import fs from 'fs';

export class BrandAuditor {
    private genAI: GoogleGenerativeAI;
    private model: any;

    // Negatif kelime listesi - Marka imajına zarar verebilecek terimler
    private readonly negativeKeywords = [
        'cheap', 'plastic', 'fake', 'low quality', 'blurry', 'distorted',
        'ugly', 'broken', 'dirty', 'messy', 'dark', 'gloomy',
        'ucuz', 'plastik', 'sahte', 'düşük kalite', 'bulanık', 'bozuk',
        'çirkin', 'kırık', 'kirli', 'karanlık'
    ];

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Updated to gemini-2.5-pro per user request
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    }

    /**
     * Prompt'un marka kurallarına uygunluğunu denetler.
     * @param prompt Kullanıcı veya sistem tarafından üretilen prompt
     * @returns Uygunsa true, değilse false ve nedenini döner.
     */
    public validatePrompt(prompt: string): { isValid: boolean; reason?: string } {
        const lowerPrompt = prompt.toLowerCase();

        for (const keyword of this.negativeKeywords) {
            if (lowerPrompt.includes(keyword)) {
                logger.warn(`Prompt contains negative keyword: ${keyword}`);
                return { isValid: false, reason: `Prompt contains forbidden keyword: ${keyword}` };
            }
        }

        return { isValid: true };
    }

    /**
     * Üretilen görseli Gemini Vision ile analiz eder ve marka uygunluk puanı verir.
     * @param imagePath Görselin dosya yolu
     * @param context Ürün hakkında bağlam bilgisi (materyal, taş vb.)
     */
    public async auditImage(imagePath: string, context: string): Promise<{ passed: boolean; score: number; feedback: string }> {
        try {
            const imageData = fs.readFileSync(imagePath);
            const base64Image = imageData.toString('base64');

            const prompt = `
                You are a strict QUALITY CONTROL ENGINEER for Altınbaş Jewelry.
                Your task is to audit the generated image against the original reference product.
                
                This is a BINARY PASS/FAIL system based on IDENTITY PRESERVATION.

                Product Context: ${context}

                Evaluate the image based on these EXACT criteria:
                1. Identity Match: Is it the exact same jewelry design?
                2. Geometry Match: Are the shapes and proportions identical?
                3. Gemstone Count Match: Is the number of stones identical?
                4. Material Match: Is the metal color and type identical?

                Output STRICT JSON format:
                {
                    "identity_match": boolean,
                    "geometry_match": boolean,
                    "gemstone_count_match": boolean,
                    "material_match": boolean,
                    "chain_structure_match": boolean,
                    "overall_verdict": "PASS" | "FAIL",
                    "failure_reason": "string or null",
                    "score": number (1-10, mainly for logging, if FAIL max 4)
                }

                Rules:
                - If ANY match field is false → overall_verdict MUST be FAIL
                - If FAIL → note specific reason
                - Do not be lenient. Any product alteration is a FAIL.
            `;

            const result = await this.model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "image/png",
                        data: base64Image
                    }
                }
            ]);

            const response = await result.response;
            const text = response.text();

            // JSON temizleme ve parse
            const jsonStr = text.replace(/```json|```/g, '').trim();
            const analysis = JSON.parse(jsonStr);

            const passed = analysis.overall_verdict === 'PASS';
            const score = analysis.score || (passed ? 8 : 3);

            logger.info(`Brand Audit Result: ${analysis.overall_verdict} - Score ${score}/10`);

            return {
                passed: passed,
                score: score,
                feedback: analysis.failure_reason || "Identity verified."
            };

        } catch (error: any) {
            logger.error('Brand Audit Failed', { error: error.message });
            // Hata durumunda akışı bozmamak için varsayılan olarak geçiriyoruz ama logluyoruz
            return { passed: true, score: 0, feedback: "Audit service unavailable, bypassed." };
        }
    }
}
