
import React, { useState } from 'react';
import Gallery from './pages/Gallery';
import UploadPage from './pages/UploadPage';
import ReviewModal from './components/ReviewModal';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'gallery' | 'upload'>('gallery');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // When upload is successful, wait for user to finish generation flow
    const handleUploadSuccess = () => {
        // User stays on UploadPage to see the result
        // But we can trigger a silent gallery refresh if needed
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Altınbaş AI Engine</h1>
                        </div>
                        <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setCurrentView('upload')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'upload' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Upload & Create
                            </button>
                            <button
                                onClick={() => setCurrentView('gallery')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'gallery' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Asset Gallery
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 container mx-auto py-8 px-4">
                    {currentView === 'upload' ? (
                        <UploadPage onUploadSuccess={handleUploadSuccess} />
                    ) : (
                        <Gallery onReview={(img) => setSelectedImage(img)} />
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-100 p-4 text-center text-xs text-gray-400 mt-auto">
                    v1.0.0 • Altınbaş AI Engine • Antigravity System
                </footer>

                {/* Modals */}
                <ReviewModal
                    isOpen={!!selectedImage}
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    onApprove={(filename) => {
                        console.log('Approved:', filename);
                        setSelectedImage(null);
                        alert('Image Approved!');
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

export default App;
