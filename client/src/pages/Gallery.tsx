
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface GalleryItem {
    id: string;
    image_url: string;
    prompt: string;
    aspect_ratio: string;
    created_at: string;
    status: string;
    products: {
        original_name: string;
        category: string;
        material: string;
        gemstone: string;
        image_url: string;
    };
}

interface GalleryProps {
    onReview?: (image: GalleryItem) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onReview }) => {
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                // In development, we need to point to the backend port 3000
                const response = await axios.get('http://localhost:3000/api/v1/gallery');
                setImages(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch gallery', err);
                setError('Failed to load gallery images');
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading gallery...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Asset Gallery</h1>

            {images.length === 0 ? (
                <div className="text-center p-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No images found. Upload a product to generate assets.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-64 overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                                <img
                                    src={img.image_url}
                                    alt={img.products?.category || 'Generated'}
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    {img.aspect_ratio || '1:1'}
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {img.products?.category} - {img.products?.material}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={img.prompt}>
                                    {img.prompt}
                                </p>
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                                    <span>{new Date(img.created_at).toLocaleDateString()}</span>
                                    <span className={`px-2 py-0.5 rounded-full ${img.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {img.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => onReview && onReview(img)}
                                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;
