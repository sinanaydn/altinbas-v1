import 'dotenv/config';

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is missing from env');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log('📡 requesting:', `https://generativelanguage.googleapis.com/v1beta/models?key=***`);

    try {
        const response = await fetch(url);
        const data: any = await response.json();

        if (!response.ok) {
            console.error('❌ API Error:', data);
            return;
        }

        if (data.models) {
            console.log('✅ Available Models:');
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('⚠️ No models returned. Raw data:', data);
        }
    } catch (err: any) {
        console.error('❌ Network/Script Error:', err.message);
    }
}

listModels();
