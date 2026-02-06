import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    const resp = await fetch('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({
        prompt
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })

    if (!resp.ok) {
      setIsLoading(false)
      return;
    }

    const data = await resp.json()
    setIsLoading(false)
    
    // 1. Set the main display image
    setImageUrl(data?.message);
    
    // 2. Append the new image to our history array
    setGeneratedImages((prev) => [...prev, { imageUrl: data?.message, prompt }])
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Image Generation App</h1>
        <p className="text-lg text-gray-700 mb-4">
          Generate stunning images based on your prompts!
        </p>

        <div className="w-full max-w-md">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleGenerateImage}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {
              isLoading ? "Loading..." : "Generate Image"
            }
          </button>
        </div>

        {/* Main Result Display */}
        {imageUrl && <ImageCard action={() => setImageUrl(imageUrl)} imageUrl={imageUrl} prompt={prompt} />}
      </div>

      {/* History Gallery Section */}
      {
        generatedImages.length > 0 ? (
          <div className="mt-10 w-full max-w-5xl">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Generated History</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 border p-4 rounded-lg bg-white shadow-sm overflow-y-auto max-h-96">
              {generatedImages.map(
                ({ imageUrl, prompt }: ImageProps, index) => (
                  <ImageCard
                    action={() => setImageUrl(imageUrl)}
                    imageUrl={imageUrl}
                    prompt={prompt}
                    key={index}
                    width="w-full"
                    height="h-40"
                  />
                )
              )}
            </div>
          </div>
        ) : null
      }
    </div>
  );
};

export default Home;