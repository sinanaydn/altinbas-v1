import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../../utils/logging';

export class SupabaseService {
    private client: SupabaseClient | null = null;
    private static instance: SupabaseService;

    private constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;

        if (url && key) {
            this.client = createClient(url, key);
            logger.info('Supabase client initialized');
        } else {
            logger.warn('Supabase credentials missing. Database features will be disabled.');
        }
    }

    public static getInstance(): SupabaseService {
        if (!SupabaseService.instance) {
            SupabaseService.instance = new SupabaseService();
        }
        return SupabaseService.instance;
    }

    public async createProduct(data: {
        originalName: string;
        category: string;
        material: string;
        gemstone: string;
        imageUrl: string;
    }): Promise<string | null> {
        if (!this.client) return null;

        try {
            const { data: product, error } = await this.client
                .from('products')
                .insert({
                    original_name: data.originalName,
                    category: data.category,
                    material: data.material,
                    gemstone: data.gemstone,
                    image_url: data.imageUrl
                })
                .select()
                .single();

            if (error) throw error;
            logger.info(`Product created in Supabase: ${product.id}`);
            return product.id;
        } catch (error: any) {
            logger.error('Failed to create product in Supabase', { error: error.message });
            return null;
        }
    }

    public async logGeneration(data: {
        productId: string;
        prompt: string;
        imageUrl: string;
        aspectRatio?: string;
    }): Promise<string | null> {
        if (!this.client) return null;

        try {
            const { data: generation, error } = await this.client
                .from('generations')
                .insert({
                    product_id: data.productId,
                    prompt: data.prompt,
                    image_url: data.imageUrl,
                    aspect_ratio: data.aspectRatio
                })
                .select()
                .single();

            if (error) throw error;
            logger.info(`Generation logged in Supabase: ${generation.id}`);
            return generation.id;
        } catch (error: any) {
            logger.error('Failed to log generation in Supabase', { error: error.message });
            return null;
        }
    }

    public async getGalleryData(): Promise<any[]> {
        if (!this.client) return [];

        try {
            // Fetch generations with product details
            const { data, error } = await this.client
                .from('generations')
                .select(`
                    id,
                    image_url,
                    prompt,
                    aspect_ratio,
                    created_at,
                    status,
                    products (
                        original_name,
                        category,
                        material,
                        gemstone,
                        image_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            logger.error('Failed to fetch gallery data', { error: error.message });
            return [];
        }
    }

    public async uploadFile(fileBuffer: Buffer, filename: string, mimeType: string = 'image/jpeg'): Promise<string | null> {
        if (!this.client) return null;

        try {
            const { data, error } = await this.client
                .storage
                .from('assets')
                .upload(`${filename}`, fileBuffer, {
                    contentType: mimeType,
                    upsert: true
                });

            if (error) throw error;

            const { data: publicData } = this.client
                .storage
                .from('assets')
                .getPublicUrl(data.path);

            logger.info(`File uploaded to Supabase Storage: ${publicData.publicUrl}`);
            return publicData.publicUrl;
        } catch (error: any) {
            logger.error('Failed to upload file to Supabase', { error: error.message });
            return null;
        }
    }

    public async deleteGeneration(id: string): Promise<boolean> {
        if (!this.client) return false;

        try {
            // 1. Get the generation to find the file path
            const { data: generation, error: fetchError } = await this.client
                .from('generations')
                .select('image_url')
                .eq('id', id)
                .single();

            if (fetchError || !generation) {
                logger.error('Generation not found for deletion', { id });
                return false;
            }

            // 2. Extract filename from URL
            // URL format: .../storage/v1/object/public/assets/filename.png
            const urlParts = generation.image_url.split('/');
            const filename = urlParts[urlParts.length - 1];

            if (filename) {
                // 3. Delete file from Storage
                const { error: storageError } = await this.client
                    .storage
                    .from('assets')
                    .remove([filename]);

                if (storageError) {
                    logger.warn('Failed to delete file from storage', { filename, error: storageError.message });
                    // Continue to delete record anyway? Yes, to keep DB clean.
                } else {
                    logger.info(`Deleted file from storage: ${filename}`);
                }
            }

            // 4. Delete record from Database
            const { error: deleteError } = await this.client
                .from('generations')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            logger.info(`Deleted generation record: ${id}`);
            return true;
        } catch (error: any) {
            logger.error('Failed to delete generation', { error: error.message });
            return false;
        }
    }
}
