import axios from 'axios';
import assert from 'assert';

const API_URL = 'http://localhost:3000/api/v1';

async function testGeneration() {
    console.log('🧪 Starting Image Generation Test...');

    // Mock Analysis Data (as if coming from M3)
    const mockAnalysis = {
        material: '18k Gold',
        gemstone: 'Ruby',
        category: 'Necklace',
        color_palette: ['#FF0000', '#GOLD', '#BLACK'],
        design_style: 'Ottoman Traditional',
        marketing_hooks: ['Timeless Elegance']
    };

    try {
        console.log('📤 Requesting generation for concept: lifestyle_paris');

        const response = await axios.post(`${API_URL}/products/generate`, {
            analysis: mockAnalysis,
            concept: 'lifestyle_paris'
        }, {
            headers: { 'Authorization': 'Bearer test-token' }
        });

        console.log('✅ Response:', response.status);
        console.log('🖼️ Generated Image URL:', response.data.imageUrl);

        assert.strictEqual(response.status, 200);
        assert.ok(response.data.imageUrl.includes('gen_'), 'URL should look like a generated file');

        console.log('🎉 Generation Test Passed!');

    } catch (error: any) {
        console.error('❌ Generation Test Failed:', error.message);
        if (error.response) {
            console.log('Response:', error.response.data);
        }
    }
}

testGeneration();
