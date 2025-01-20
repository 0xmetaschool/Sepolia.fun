import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { abi } from './abi';
import { ethers } from 'ethers';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TokenCreate = () => {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
      anchorPlacement: 'top-bottom',
    });
  }, []);

  const handleCreate = async () => {
    if (!name || !ticker || !description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer);

      const transaction = await contract.createMemeToken(name, ticker, imageUrl, description, {
        value: ethers.parseUnits("0.0001", 'ether'),
      });
      await transaction.wait();

      alert('Token created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Error creating token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-4">
      <div className="px-6" data-aos="fade-right" data-aos-duration="800">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          ← Back
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6 mt-4" data-aos="fade-down" data-aos-duration="1200">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 text-center animate-gradient">
            Create Meme Token
          </h1>
        </div>

        <div className="max-w-xl mx-auto bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 transform transition-all duration-300 hover:shadow-2xl hover:border-purple-500" data-aos="zoom-in" data-aos-duration="1000">
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-3 space-y-1 transform transition-all duration-300 hover:scale-[1.02]" data-aos="fade-up" data-aos-delay="200">
              <p className="text-purple-400 font-semibold"> Important Information:</p>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>💰 MemeCoin creation fee: 0.0001 ETH</li>
                <li>🎯 Max supply: 1 million tokens</li>
                <li>🌱 Initial mint: 200k tokens</li>
                <li>🦄 Liquidity pool will be created on Uniswap if funding target of 24 ETH is met</li>
              </ul>
            </div>

            <div className="space-y-3" data-aos="fade-up" data-aos-delay="300">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Token Name *</label>
                <input
                  type="text"
                  placeholder="e.g., DogeCoin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Token Symbol *</label>
                <input
                  type="text"
                  placeholder="e.g., DOGE"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                <textarea
                  placeholder="Describe your token"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://gateway.pinata.cloud/ipfs/bafk......"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md"
                />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Token'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCreate;
