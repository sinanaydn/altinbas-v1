import { ImageValidator } from './ImageValidator';
import { FileStorageService } from '../storage/FileStorageService';
import { GeminiAdapter } from '../ai/GeminiAdapter';
import { PromptEngine } from '../generation/PromptEngine';
import { NanoBananaAdapter } from '../generation/NanoBananaAdapter';
import logger from '../../utils/logging';
import sharp from 'sharp';

import { SupabaseService } from '../db/SupabaseService';

export class AssetProcessor {
    private validator: ImageValidator;
    private storage: FileStorageService;
    private aiAdapter: GeminiAdapter;
    private promptEngine: PromptEngine;
    private generator: NanoBananaAdapter;
    private db: SupabaseService;

    constructor() {
        this.validator = new ImageValidator();
        this.storage = new FileStorageService();
        this.aiAdapter = new GeminiAdapter();
        this.promptEngine = new PromptEngine();
        this.generator = new NanoBananaAdapter();
        this.db = SupabaseService.getInstance();
    }

    /**
     * Process an uploaded product image:
     * 1. Validate
     * 2. Remove Background
     * 3. Analyze with AI (Gemini)
     * 4. Store Assets
     */
    public async processUpload(file: Express.Multer.File, metadata: any) {
        logger.info(`Processing upload for ${file.originalname}`);

        // 1. Validate
        const validation = await this.validator.validate(file);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.error}`);
        }

        // 2. Parallel Processing: AI Analysis Only
        const analysisResult = await this.aiAdapter.analyzeImage(file.buffer, file.mimetype, metadata);

        // 3. Store Assets
        // Store Original
        const originalUrl = await this.storage.upload(file.buffer, `original_${file.originalname}`);

        // Per User Request: No cropping or cutting. Original image is preserved exactly as is.
        // The "cutout" is identical to the original.
        const cutoutUrl = originalUrl;

        // 4. Save to Database
        const productId = await this.db.createProduct({
            originalName: file.originalname,
            category: metadata.category,
            material: metadata.material,
            gemstone: metadata.gemstone,
            imageUrl: cutoutUrl
        });

        return {
            success: true,
            productId, // Return ID for linking generations
            originalUrl,
            cutoutUrl,
            analysis: analysisResult,
            metadata
        };
    }

    /**
     * Generates a lifestyle image for a product based on its analysis.
     */
    public async generateConceptImage(analysis: any, concept: string, cutoutUrl?: string, aspectRatio?: string, productId?: string): Promise<string> {
        logger.info(`Generating concept image for style: ${concept} with Ratio: ${aspectRatio || 'Default'}`);

        // 1. Create Prompt
        let prompt = this.promptEngine.generatePrompt(analysis, concept);

        // Append Aspect Ratio instruction
        if (aspectRatio) {
            const ratioMap: { [key: string]: string } = {
                '1:1': 'Square 1:1 Aspect Ratio.',
                '9:16': 'vertical 9:16 Aspect Ratio (Story Format). Full height.',
                '4:5': 'vertical 4:5 Aspect Ratio (Portrait Format).',
                '16:9': 'wide 16:9 Aspect Ratio (Cinematic Format).'
            };
            const ratioInstruction = ratioMap[aspectRatio] || `Aspect Ratio ${aspectRatio}`;
            prompt += ` IMAGE FORMAT: ${ratioInstruction}`;
        }

        logger.debug(`Generated Prompt: ${prompt}`);

        // 2. Prepare Reference Image (if available)
        let referenceImageBuffer: Buffer | undefined;
        if (cutoutUrl) {
            try {
                // cutoutUrl is now a remote URL from Supabase Storage
                logger.info(`Fetching reference image from URL: ${cutoutUrl}`);

                const response = await fetch(cutoutUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch reference image: ${response.statusText}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                referenceImageBuffer = Buffer.from(arrayBuffer);
                logger.info(`Reference image loaded successfully from URL (Size: ${referenceImageBuffer.length} bytes)`);

            } catch (err: any) {
                logger.warn('Failed to load reference image for generation', { error: err.message });
                // Fallback: If fetch fails, maybe try local if it still exists (rare case)
            }
        }

        // 3. Call Generator
        const imageBuffer = await this.generator.generateImage(prompt, referenceImageBuffer);

        if (!imageBuffer) {
            throw new Error('Image generation failed to produce a valid buffer');
        }

        // 4. Store Result
        const filename = `gen_${Date.now()}_${concept}.png`;
        const url = await this.storage.upload(imageBuffer, filename);

        // 5. Log to Database
        if (productId) {
            await this.db.logGeneration({
                productId: productId,
                prompt: prompt,
                imageUrl: url,
                aspectRatio: aspectRatio
            });
        }

        return url;
    }
}
