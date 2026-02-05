import { Router } from 'express';
import multer from 'multer';
import { AssetProcessor } from '../../services/asset/AssetProcessor';
import logger from '../../utils/logging';
import { LogoOverlay } from '../../services/brand/LogoOverlay';
import path from 'path';

const router = Router();
const upload = multer(); // Store in memory for processing
const assetProcessor = new AssetProcessor();
const logoOverlay = new LogoOverlay();

// POST /api/v1/products - Upload new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        logger.info(`Received upload request: ${req.file.originalname}`);

        const result = await assetProcessor.processUpload(req.file, req.body);

        res.status(201).json({
            message: 'Product asset processed successfully',
            data: result
        });
    } catch (error: any) {
        logger.error('Upload processing failed', { error: error.message });
        res.status(422).json({
            error: 'Processing failed',
            details: error.message
        });
    }
});


// Generate Concept Image
router.post('/generate', async (req, res, next) => {
    try {
        const { analysis, concept, cutoutUrl, aspectRatio, productId } = req.body;

        if (!analysis || !concept) {
            res.status(400).json({ error: 'Missing analysis data or concept' });
            return;
        }

        // 1. Prompt Validation (Skipped per user request)
        // const promptCheck = brandAuditor.validatePrompt(JSON.stringify(concept)); 

        const processor = new AssetProcessor();
        const imageUrl = await processor.generateConceptImage(analysis, concept, cutoutUrl, aspectRatio, productId);

        // Convert URL to Local Path (Hack for MVP)
        // URL: http://localhost:3000/uploads/filename.png
        // Path: C:\altinbas-v1\uploads\filename.png
        const filename = imageUrl.split('/').pop();
        if (!filename) throw new Error('Invalid image URL generated');

        let localPath = path.join(process.cwd(), 'uploads', filename);

        // 2. Logo Overlay
        localPath = await logoOverlay.addOverlay(localPath);

        // Update URL to point to branded image
        const brandedFilename = path.basename(localPath);
        const brandedUrl = imageUrl.replace(filename, brandedFilename);

        // 3. Post-Generation Audit (Skipped per user request)
        // const auditResult = await brandAuditor.auditImage(localPath, JSON.stringify(analysis));

        res.status(200).json({
            success: true,
            message: 'Concept image generated successfully',
            imageUrl: brandedUrl,
            audit: { passed: true, score: 10, feedback: 'Audit skipped.' }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
