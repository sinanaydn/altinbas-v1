import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('🔍 Fetching available models...');

    try {
        // There isn't a direct "listModels" on the instance in the node SDK easily exposed 
        // without using the model manager or similar, but let's try a simple generation 
        // on a known legacy model to test auth at least, or try to use the admin API if available.
        // Actually, the SDK doesn't expose ListModels easily in the high-level client.
        // So instead, we will try to probe common models.

        const candidates = [
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-pro-vision',
            'gemini-1.0-pro-vision-latest',
            'gemini-pro'
        ];

        for (const modelName of candidates) {
            process.stdout.write(`Testing ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                // minimal test
                const result = await model.generateContent("Hello");
                await result.response;
                console.log('✅ OK');
            } catch (e: any) {
                console.log('❌ Failed:', e.message.split('\n')[0]);
            }
        }

    } catch (error: any) {
        console.error('Fatal error:', error);
    }
}

listModels();
