/**
 * Integration test for Product Upload Endpoint with Gemini Analysis
 * 
 * Usage: npx ts-node tests/integration/upload.test.ts
 */
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const API_URL = 'http://localhost:3000/api/v1';
// Use the real image uploaded by the user for a meaningful AI test
const TEST_IMAGE_PATH = 'C:/Users/sinan/.gemini/antigravity/brain/d6039e48-6b6e-46f0-bb90-17965d7dc840/uploaded_media_1770148961818.png';

async function testUpload() {
    console.log('🧪 Starting Upload & Gemini Integration Test...');

    if (!fs.existsSync(TEST_IMAGE_PATH)) {
        console.error(`❌ Test image not found at: ${TEST_IMAGE_PATH}`);
        process.exit(1);
    }

    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(TEST_IMAGE_PATH));
        formData.append('category', 'ring');
        formData.append('goldPurity', '18k');

        console.log('📤 Sending POST request to /products...');
        console.log('⏳ This may take a few seconds for AI analysis...');

        const response = await axios.post(`${API_URL}/products`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': 'Bearer test-token'
            },
            timeout: 30000 // Increase timeout for AI processing
        });

        console.log('✅ Response received:', response.status);
        console.log('📦 Data:', JSON.stringify(response.data, null, 2));

        assert.strictEqual(response.status, 201, 'Status code should be 201');

        const data = response.data.data;
        assert.ok(data.originalUrl, 'Should return originalUrl');
        assert.ok(data.cutoutUrl, 'Should return cutoutUrl');

        // Validate Gemini Analysis
        assert.ok(data.analysis, 'Should return analysis object');
        console.log('💎 Detected Material:', data.analysis.material);
        console.log('💎 Detected Gemstone:', data.analysis.gemstone);
        console.log('🎨 Marketing Hooks:', data.analysis.marketing_hooks);

        assert.ok(data.analysis.material, 'Analysis should have material');
        assert.ok(data.analysis.marketing_hooks.length > 0, 'Should have marketing hooks');

        console.log('🎉 Test Passed! AI Integration is working.');
    } catch (error: any) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
        process.exit(1);
    }
}

testUpload();
