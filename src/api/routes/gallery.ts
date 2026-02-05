

import { Router } from 'express';
import logger from '../../utils/logging';
import { SupabaseService } from '../../services/db/SupabaseService';

const router = Router();
const db = SupabaseService.getInstance();

// GET /api/v1/gallery - List all generated images from Supabase
router.get('/', async (req, res) => {
    try {
        const images = await db.getGalleryData();
        res.status(200).json(images);
    } catch (error: any) {
        logger.error('Gallery list failed', { error: error.message });
        res.status(500).json({ error: 'Failed to list gallery items' });
    }
});

// POST /api/v1/gallery/approve - Placeholder for approval logic
router.post('/approve', async (req, res) => {
    try {
        const { filename } = req.body;
        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        // For MVP, approval might just mean logging it or moving it to a different folder
        logger.info(`Image approved: ${filename}`);

        // TODO: In real implementation, this would update Airtable or move file to 'approved' bucket

        res.status(200).json({ success: true, message: 'Image approved successfully' });
    } catch (error: any) {
        logger.error('Approval failed', { error: error.message });
        res.status(500).json({ error: 'Failed to approve image' });
    }
});

// DELETE /api/v1/gallery/:id - Delete a generated image
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const success = await db.deleteGeneration(id);
        if (success) {
            res.status(200).json({ success: true, message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found or could not be deleted' });
        }
    } catch (error: any) {
        logger.error('Deletion failed', { error: error.message });
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;
