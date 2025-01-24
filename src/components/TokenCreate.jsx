import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { abi } from './abi';
import { ethers } from 'ethers';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';

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
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-400 text-gray-800">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,#FFD700,#FFD700_10px,#FFA500_10px,#FFA500_20px)] opacity-20" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {['🚀', '💎', '🌕', '🦍', '🎮'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="px-6 py-4 relative" data-aos="fade-right" data-aos-duration="800">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-orange-400 text-white hover:bg-orange-500 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          ← Back
        </button>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 relative">
        <div className="mb-6 mt-4" data-aos="fade-down" data-aos-duration="1200">
          <h1 className="text-4xl font-bold text-purple-600 text-center">
            Create Your Meme Token!
          </h1>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-xl border-2 border-orange-400 transform transition-all duration-300 hover:shadow-2xl hover:border-purple-500" data-aos="zoom-in" data-aos-duration="1000">
          <div className="space-y-4">
            <div className="bg-orange-100 rounded-lg p-4 space-y-2 transform transition-all duration-300 hover:scale-[1.02]" data-aos="fade-up" data-aos-delay="200">
              <p className="text-purple-600 font-semibold">Important Information:</p>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>💰 MemeCoin creation fee: 0.0001 ETH</li>
                <li>🎯 Max supply: 1 million tokens</li>
                <li>🌱 Initial mint: 200k tokens</li>
                <li>🦄 Liquidity pool will be created on Uniswap if funding target of 24 ETH is met</li>
              </ul>
            </div>

            <div className="space-y-4" data-aos="fade-up" data-aos-delay="300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Name *</label>
                <input
                  type="text"
                  placeholder="e.g., DogeCoin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white border-2 border-orange-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token Symbol *</label>
                <input
                  type="text"
                  placeholder="e.g., DOGE"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white border-2 border-orange-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  placeholder="Describe your token"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white border-2 border-orange-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md resize-none h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://gateway.pinata.cloud/ipfs/bafk......"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white border-2 border-orange-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 transform hover:shadow-md"
                />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Token 🚀'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer/>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TokenCreate;