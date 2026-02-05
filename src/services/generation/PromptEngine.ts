import { GeminiAnalysisResult } from '../ai/GeminiAdapter';

export class PromptEngine {

    /**
     * Generates a high-fidelity image generation prompt based on verified product attributes.
     * Uses the 'Elite Creative Director' design suggestions.
     */
    public generatePrompt(analysis: GeminiAnalysisResult, concept: string = 'studio_luxury'): string {

        // 1. CONSTANT MODEL PERSONA (Brand Face)
        // Hardcoded detailed description to maintain character consistency across sessions.
        const modelPersona = `
            MODEL CHARACTERISTICS:
            Subject is a stunningly elegant 28-year-old female luxury model. 
            Features: Flawless glowing skin, high cheekbones, soft hazel eyes, natural brunette hair styled in a sophisticated low bun or soft waves.
            Attire: Wearing high-fashion minimalist luxury clothing (silk blouse, cashmere, or elegant evening wear) in neutral tones (cream, beige, or black) that complements the jewelry.
            Vibe: Ultra-wealthy, confident, timeless elegance.
        `;

        // 2. PRODUCT INTEGRATION & IDENTITY LOCK
        const identityLock = `
            CRITICAL INSTRUCTION: The model is WEARING the provided jewelry reference.
            The jewelry must be positioned naturally on her (e.g., ring on finger, necklace on neck, earrings on ears).
            IDENTITY LOCK: Ensure the jewelry looks EXACTLY like the reference image provided. Do not alter the product design.
        `;

        // 3. SCENE & LIGHTING (Dynamic from Gemini Analysis)
        // Use the detailed design suggestions provided by the Elite Director (Gemini)
        // But force the focus onto the model wearing it.
        const designPlan = analysis.design_suggestions || 'Professional luxury product photography, high end lighting, 8k resolution.';

        // 4. NEGATIVE PROMPTS
        const negativeInstructions = ' NEGATIVE PROMPT: deformed hands, extra fingers, missing limbs, bad anatomy, distorted face, ugly, messy hair, cheap clothes, cartoon, 3d render, plastic skin, floating jewelry, jewelry on table (must be worn by model).';

        // Construct final prompt
        return `${modelPersona} ${identityLock} SCENE DETAILS: ${designPlan} ${negativeInstructions}`;
    }
}
