'use client';

import { useState, Suspense } from 'react';
import DragDropZone from './components/DragDropZone';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url) as unknown as GLTF;
  return <primitive object={gltf.scene} />;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(true);

  const handleImageSelect = async (file: File) => {
    // Create a temporary URL for preview
    setSelectedImage(URL.createObjectURL(file));
    setModelUrl(null);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      
      setLoading(true);
      try {
        const response = await fetch('/api/generate3d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imageUrl: base64data,
            removeBackground 
          }),
        });

        const result = await response.json();
        if (result.data?.model_mesh?.url) {
          setModelUrl(result.data.model_mesh.url);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-black">Image to 3D Converter</h1>
          <p className="text-gray-600">Transform your images into 3D models instantly</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Upload Image</h2>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={removeBackground}
                onChange={(e) => setRemoveBackground(e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Remove Background</span>
            </label>
          </div>

          <DragDropZone
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
          />

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generating 3D model...</p>
            </div>
          )}

          {modelUrl && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Generated 3D Model</h2>
              <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <Model url={modelUrl} />
                    <OrbitControls />
                  </Suspense>
                </Canvas>
              </div>
              <div className="flex justify-center">
                <a
                  href={modelUrl}
                  download
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Download 3D Model
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
