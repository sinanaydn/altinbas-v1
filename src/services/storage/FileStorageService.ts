import logger from '../../utils/logging';
import { SupabaseService } from '../db/SupabaseService';

export class FileStorageService {
    private db: SupabaseService;

    constructor() {
        this.db = SupabaseService.getInstance();
    }

    public async upload(buffer: Buffer, filename: string): Promise<string> {
        const uniqueName = `${Date.now()}-${filename}`;

        // Try uploading to Supabase
        // Guess mime type roughly or default
        const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const publicUrl = await this.db.uploadFile(buffer, uniqueName, mimeType);

        if (publicUrl) {
            return publicUrl;
        }

        throw new Error('Failed to upload file to Supabase Storage');
    }
}
