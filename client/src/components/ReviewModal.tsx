
import React, { useState } from 'react';

// Zoomable Image Component
const ZoomableImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ backgroundImage: 'none', backgroundPosition: '0% 0%' });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomStyle({
            backgroundImage: `url(${src})`,
            backgroundPosition: `${x}% ${y}%`,
            backgroundSize: '250%' // Zoom level
        });
    };

    return (
        <div
            className={`relative overflow-hidden cursor-crosshair ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-contain pointer-events-none transition-opacity duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
            />
            {isHovering && (
                <div
                    className="absolute inset-0 z-10 pointer-events-none bg-no-repeat bg-white"
                    style={zoomStyle}
                />
            )}
        </div>
    );
};

interface ReviewModalProps {
    isOpen: boolean;
    image: {
        id: string;
        image_url: string;
        prompt: string;
        products: {
            category: string;
            material: string;
            gemstone: string;
            image_url: string;
        }
    } | null;
    onClose: () => void;
    onClose: () => void;
    onApprove: (id: string) => void;
    onDelete: (id: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, image, onClose, onApprove, onDelete }) => {
    if (!isOpen || !image) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Review Asset</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-gray-50 flex gap-6">
                    {/* Left: Original Image & Context */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Original Upload</h3>

                        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white mb-4 relative group">
                            {/* Show original product image if available */}
                            {image.products?.image_url ? (
                                <ZoomableImage
                                    src={image.products.image_url}
                                    alt="Original Product"
                                    className="w-full h-80 bg-gray-50 rounded"
                                />
                            ) : (
                                <div className="h-64 flex items-center justify-center bg-gray-50 text-gray-400">
                                    No Original Image
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.products?.category} - {image.products?.material}
                            </div>
                        </div>

                        <div className="mt-auto bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-h-32 overflow-y-auto">
                            <h4 className="font-semibold text-gray-700 mb-1 text-xs uppercase">Used Prompt</h4>
                            <p className="text-xs text-gray-600 leading-relaxed italic">
                                "{image.prompt}"
                            </p>
                        </div>
                    </div>

                    {/* Right: Generated Result */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-semibold text-blue-500 mb-3 uppercase tracking-wider">Generated Concept</h3>
                        <div className="rounded-lg overflow-hidden shadow-md bg-white relative">
                            <ZoomableImage
                                src={image.image_url}
                                alt="Generated Result"
                                className="w-full h-96"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-40 text-white text-[10px] px-2 py-1 rounded pointer-events-none">
                                Hover to Zoom
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => onApprove(image.id)}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Approve & Publish
                            </button>
                            <button
                                onClick={() => onDelete(image.id)}
                                className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
