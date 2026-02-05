import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function checkFlash() {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        console.log('Testing gemini-1.5-flash...');
        const result = await model.generateContent('Hello');
        console.log('Response:', result.response.text());
        console.log('✅ Success');
    } catch (error: any) {
        console.error('❌ Failed:', error.message);
    }
}

checkFlash();
