import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import logger from '../../utils/logging';

export class NanoBananaAdapter {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Verified availability in Milestone 3
        this.model = this.genAI.getGenerativeModel({ model: 'nano-banana-pro-preview' });
    }

    /**
     * Generates an image based on the prompt.
     * Note: Since this is using the standard SDK with a custom image model, 
     * we expect it might return a base64 string or a url in the text response 
     * or a specific blob part depending on the API contract.
     * 
     * For the 'preview' models, we assume a standard generateContent call 
     * that returns a structured string/json or media.
     */
    /**
     * Generates an image based on the prompt and an optional reference image.
     */
    public async generateImage(prompt: string, referenceImageBuffer?: Buffer): Promise<Buffer | null> {
        logger.info(`Sending prompt to Nano Banana: ${prompt.substring(0, 50)}...`);

        try {
            const requestParts: any[] = [prompt];

            if (referenceImageBuffer) {
                logger.info('Attaching reference image to generation request...');
                requestParts.push({
                    inlineData: {
                        data: referenceImageBuffer.toString('base64'),
                        mimeType: 'image/png'
                    }
                });
            }

            const result = await this.model.generateContent(requestParts);
            const response = await result.response;

            // DEEP DEBUG: Log full structure
            logger.info(`NANO BANANA JSON: ${JSON.stringify(response, null, 2)}`);

            // Inspecting candidates to find image data
            // API usually returns images in inlineData or as a text link if it's a mock/preview
            // We will try to handle both cases.

            // Case 0: Standard Google Generative AI inlineData (found in Nano Banana logs)
            // The model returns a specialized part with inlineData containing base64 image
            const candidates = response.candidates;
            if (candidates && candidates.length > 0) {
                const parts = candidates[0].content?.parts;
                if (parts && parts.length > 0) {
                    for (const part of parts) {
                        if (part.inlineData && part.inlineData.data) {
                            logger.info('Found inline image data in response');
                            return Buffer.from(part.inlineData.data, 'base64');
                        }
                    }
                }
            }

            // Case 1: The model returns a base64 string in the text (Common for text-to-image LLM wrappers)
            const text = response.text();

            // Heuristic: Check if text looks like a base64 string or JSON containing it
            if (text.includes('base64')) {
                // Try to parse if it's JSON
                try {
                    const json = JSON.parse(text.replace(/```json|```/g, '').trim());
                    if (json.image_data) {
                        return Buffer.from(json.image_data, 'base64');
                    }
                } catch (e) {
                    // Not JSON, analyze text content directly? 
                    // For now, let's assume if it's not the standard way, we log text
                    logger.warn('Nano Banana returned text, possibly containing image url:', text);
                }
            } else {
                // Log the raw text for debugging if no obvious image data found
                logger.info(`Nano Banana Raw Response: ${text.substring(0, 500)}...`);
            }

            // Case 2: Use standard parts if the SDK supports image output in future
            // Currently not standard in Node SDK for this specific model, so we stick to text parsing
            // or check if we got any binary parts (unlikely in this SDK version without specific config)

            // Fallback: This specific 'preview' might act like DALL-E and return a URL
            const urlMatch = text.match(/https?:\/\/[^\s"']+/);
            if (urlMatch) {
                // Fetch the image from URL
                const imgResponse = await fetch(urlMatch[0]);
                const arrayBuffer = await imgResponse.arrayBuffer();
                return Buffer.from(arrayBuffer);
            }

            // If we are here, we might just be getting a text description of an image (mock behavior of LLM)
            // or the model failed to generate.
            logger.error('No image data found in Nano Banana response');
            return null;

        } catch (error: any) {
            logger.error('Image Generation Failed', { error: error.message });
            throw error;
        }
    }
}
