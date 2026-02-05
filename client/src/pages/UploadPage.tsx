
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, X, Loader2, Wand2, Info } from 'lucide-react';

interface UploadPageProps {
    onUploadSuccess: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [generatedResult, setGeneratedResult] = useState<any>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

    // Yedek (Fallback) Analiz Verisi
    const [analysis] = useState({
        material: '18k Gold',
        gemstone: 'Diamond',
        category: 'Ring',
        design_style: 'Modern',
        color_palette: ['Gold', 'White']
    });

    const [material, setMaterial] = useState('');
    const [gemstone, setGemstone] = useState('');
    const [category, setCategory] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadResult(null);
            setGeneratedResult(null);
            setGeneratedPrompt('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        abortControllerRef.current = new AbortController();
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', category);
        formData.append('material', material);
        formData.append('gemstone', gemstone);

        try {
            const response = await axios.post('http://localhost:3000/api/v1/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                signal: abortControllerRef.current.signal
            });
            setUploadResult(response.data.data);
            onUploadSuccess();
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Upload cancelled by user');
                return; // Do nothing, state will be reset in finally or manually
            }
            console.error('Upload failed', error);
            alert('Upload failed. Please try again.');
        } finally {
            // Only reset uploading false if it wasn't aborted manually (which handles its own state)
            // or just ensure consistent state
            if (!abortControllerRef.current?.signal.aborted) {
                setUploading(false);
                abortControllerRef.current = null;
            }
        }
    };

    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setUploading(false);
    };

    const handleGenerate = async () => {
        if (!uploadResult) return;

        setGenerating(true);
        try {
            // Gerçek analiz verisini kullan (yoksa yedeği kullan)
            const analysisData = uploadResult.analysis || analysis;
            const cutoutUrl = uploadResult.cutoutUrl;
            const productId = uploadResult.productId;

            const response = await axios.post('http://localhost:3000/api/v1/products/generate', {
                analysis: analysisData,
                concept: 'lifestyle_luxury',
                cutoutUrl: cutoutUrl,
                aspectRatio: aspectRatio,
                productId: productId
            });

            if (response.data && response.data.imageUrl) {
                setGeneratedResult(response.data.imageUrl);
                setGeneratedPrompt(`Generating for: ${analysisData.material} ${analysisData.category} with ${analysisData.gemstone} in Luxury Context.`);
                onUploadSuccess();
            }
        } catch (error: any) {
            console.error('Generation failed', error);
            alert(`Generation failed: ${error.response?.data?.error || error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `altinbas_gen_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed', error);
            window.open(url, '_blank');
        }
    };

    const reset = () => {
        setFile(null);
        setUploadResult(null);
        setGeneratedResult(null);
        setGeneratedPrompt('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {!uploadResult ? (
                <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload New Product</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Select a high-quality jewelry photo to start the analysis and generation process.</p>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*"
                    />

                    {!file ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-black transition-colors"
                        >
                            Select Image
                        </button>
                    ) : (
                        <div className="max-w-xs mx-auto">
                            <div className="relative mb-6">
                                <img src={URL.createObjectURL(file)} className="w-full h-64 object-contain rounded-lg bg-gray-50 border" />
                                <button onClick={() => setFile(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"><X size={16} /></button>
                            </div>

                            {/* User Guidance Fields */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option value="Set">Set</option>
                                        <option value="Ring">Ring</option>
                                        <option value="Necklace">Necklace</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Bracelet">Bracelet</option>
                                        <option value="Watch">Watch</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                    <select
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="" disabled>Select Material</option>
                                        <option value="18k Gold">18k Gold</option>
                                        <option value="14k Gold">14k Gold</option>
                                        <option value="White Gold">White Gold</option>
                                        <option value="Rose Gold">Rose Gold</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Platinum">Platinum</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Gemstone</label>
                                    <select
                                        value={gemstone}
                                        onChange={(e) => setGemstone(e.target.value)}
                                        className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="" disabled>Select Gemstone</option>
                                        <option value="Diamond">Diamond</option>
                                        <option value="Ruby">Ruby</option>
                                        <option value="Sapphire">Sapphire</option>
                                        <option value="Emerald">Emerald</option>
                                        <option value="Pearl">Pearl</option>
                                        <option value="None">No Gemstone</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading || !category || !material || !gemstone}
                                    className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${(uploading || !category || !material || !gemstone) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {/* Safe Rendering: No conditional mounting, just display toggling */}
                                    <div className={`flex items-center gap-2 ${!uploading ? 'hidden' : ''}`}>
                                        <Loader2 className="animate-spin" size={20} /> Uploading...
                                    </div>
                                    <div className={uploading ? 'hidden' : ''}>
                                        Start Analysis
                                    </div>
                                </button>

                                {uploading && (
                                    <button
                                        onClick={handleCancelUpload}
                                        className="bg-red-100 text-red-600 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors border border-red-200"
                                        title="Cancel Analysis"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">Pipeline Result</h2>
                        <button onClick={reset} className="text-gray-500 hover:text-gray-700 text-sm">Start Over</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Step 1: Analysis & Cutout */}
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800 flex items-center gap-2">
                                <span className="font-bold">✓ Adım 1:</span> Analiz ve Kesim Tamamlandı
                            </div>
                            {/* User requested strict no-background look. Removed bg-url style. */}
                            <img src={uploadResult.cutoutUrl} className="w-full h-64 object-contain rounded-lg border bg-white" />
                            {/* 
                                User requested removal of the explicit "Analysis" text block.
                                The inputs now guide the AI, so we don't need to show a potentially confusing list here.
                            */}
                        </div>

                        {/* Step 2: Generation */}
                        <div className="space-y-4">
                            {!generatedResult ? (
                                <div className="h-full flex flex-col justify-center items-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                    <Wand2 className="w-12 h-12 text-purple-400 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Generate</h3>

                                    {/* Format Selection */}
                                    <div className="w-full max-w-xs mb-6 text-left">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Format</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: '1:1', label: 'Square (Feed)', icon: '⬜' },
                                                { id: '9:16', label: 'Story (9:16)', icon: '📱' },
                                                { id: '4:5', label: 'Portrait (4:5)', icon: '🖼️' },
                                                { id: '16:9', label: 'Landscape', icon: '📺' }
                                            ].map((fmt) => (
                                                <button
                                                    key={fmt.id}
                                                    onClick={() => setAspectRatio(fmt.id)}
                                                    className={`p-2 rounded border text-sm flex items-center gap-2 transition-all ${aspectRatio === fmt.id
                                                        ? 'bg-purple-100 border-purple-400 text-purple-700 shadow-sm'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span>{fmt.icon}</span>
                                                    <span>{fmt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-6">Create a lifestyle concept based on the analysis.</p>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                                    >
                                        {/* Safe Rendering: No conditional mounting, just display toggling */}
                                        <div className={`flex items-center gap-2 ${!generating ? 'hidden' : ''}`}>
                                            <Loader2 className="animate-spin" size={20} /> Generating AI Concept...
                                        </div>
                                        <div className={`flex items-center gap-2 ${generating ? 'hidden' : ''}`}>
                                            <Wand2 size={18} /> Generate Concept
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-purple-800 flex items-center gap-2">
                                        <span className="font-bold">✓ Step 2:</span> AI Generation Complete
                                    </div>
                                    <img src={generatedResult} className="w-full h-auto rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />

                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleDownload(generatedResult)}
                                            className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black flex items-center gap-2 shadow-lg"
                                        >
                                            <Upload className="rotate-180" size={16} /> Download
                                        </button>
                                    </div>

                                    {generatedPrompt && (
                                        <div className="bg-gray-50 p-3 rounded text-xs text-gray-500 italic border">
                                            AI Context: {generatedPrompt}
                                        </div>
                                    )}

                                    <p className="text-center text-sm text-gray-500">Image saved to gallery.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
