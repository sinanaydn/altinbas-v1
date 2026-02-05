
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import logger from '../../utils/logging';

export class LogoOverlay {
    private logoPath: string;

    constructor() {
        // Logo dosyasının yolu - Proje kök dizininde assets/logo.png olmalı
        this.logoPath = path.join(process.cwd(), 'assets', 'logo.png');
    }

    /**
     * Verilen görsele Altınbaş logosunu yerleştirir.
     * @param imagePath Kaynak görselin yolu
     * @returns İşlenmiş görselin yeni yolu veya hata durumunda orijinal yol
     */
    public async addOverlay(imagePath: string): Promise<string> {
        try {
            if (!fs.existsSync(this.logoPath)) {
                logger.warn('Logo file not found, skipping overlay.');
                return imagePath;
            }

            const image = sharp(imagePath);
            const metadata = await image.metadata();

            if (!metadata.width || !metadata.height) {
                throw new Error('Could not determine image dimensions');
            }

            // Logonun boyutunu görselin genişliğine göre ayarla (%20 genişlik)
            const logoWidth = Math.round(metadata.width * 0.20);

            const resizedLogo = await sharp(this.logoPath)
                .resize({ width: logoWidth })
                .toBuffer();

            // Logoyu sağ alt köşeye yerleştir (biraz padding ile)
            const padding = Math.round(metadata.width * 0.05);
            const top = metadata.height - logoWidth - padding; // Basit hesap, logo boyutu kare varsayıldı
            const left = metadata.width - logoWidth - padding;

            // Çıktı dosya adı
            const dir = path.dirname(imagePath);
            const ext = path.extname(imagePath);
            const name = path.basename(imagePath, ext);
            const outputPath = path.join(dir, `${name}_branded${ext}`);

            await image
                .composite([{
                    input: resizedLogo,
                    gravity: 'southeast', // Sağ alt köşe
                    blend: 'over'
                }])
                .toFile(outputPath);

            logger.info(`Logo overlay applied: ${outputPath}`);
            return outputPath;

        } catch (error: any) {
            logger.error('Logo Overlay Failed', { error: error.message });
            return imagePath; // Hata olursa orijinal görseli dön
        }
    }
}
