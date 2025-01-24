import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';
const { ethers } = require('ethers');
const { abi } = require("./abi");

const App = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);

        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount('');
            setIsConnected(false);
          }
        });
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    const fetchMemeTokens = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider);
        const memeTokens = await contract.getAllMemeTokens();
        
        const formattedTokens = memeTokens.map(token => {
          try {
            return {
              id: token.id ? token.id.toString() : '0',
              name: token.name || 'Unnamed Token',
              symbol: token.symbol || 'N/A',
              description: token.description || 'No description available',
              tokenImageUrl: token.tokenImageUrl || '',
              fundingRaised: token.fundingRaised ? ethers.formatUnits(token.fundingRaised, 'ether') : '0',
              tokenAddress: token.tokenAddress || '',
              creatorAddress: token.creatorAddress || 'Unknown Creator'
            };
          } catch (err) {
            console.error('Error formatting token:', err);
            return null;
          }
        }).filter(token => token !== null);

        setCards(formattedTokens);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meme tokens:', error);
        setLoading(false);
      }
    };

    fetchMemeTokens();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToTokenDetail = (card) => {
    navigate(`/token-detail/${card.tokenAddress}`, { state: { card } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-500 text-gray-800">
      {/* Background elements from landing page */}
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

      <div className="container mx-auto px-4 py-8 relative">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-8 bg-gradient-to-r from-yellow-400 to-yellow-400 p-4 rounded-xl shadow-lg">
          <div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white text-orange-500 hover:bg-yellow-200 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              ← Back to Landing
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/token-create')}
              className="px-6 py-2 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Create New Token
            </button>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="px-6 py-2 rounded-lg font-semibold bg-white text-purple-600 hover:bg-yellow-200 transition-all duration-300 transform hover:scale-105"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
              >
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </button>
            )}
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            Sepolia.fun Explorer
          </h1>
          <p className="text-gray-700">Discover and explore the most entertaining tokens in the crypto universe! 🚀</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8" data-aos="fade-up">
          <input
            type="text"
            placeholder="Search tokens by name or symbol..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/2 px-6 py-3 rounded-lg bg-white border-2 border-orange-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          // Token Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => navigateToTokenDetail(card)}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="bg-white rounded-xl p-4 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 border-2 border-orange-400 hover:border-purple-500"
              >
                {card.tokenImageUrl && (
                  <div className="mb-3 overflow-hidden rounded-lg aspect-square">
                    <img
                      src={card.tokenImageUrl}
                      alt={card.name}
                      className="w-full h-full object-contain bg-gray-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-purple-600 line-clamp-1">{card.name}</h2>
                      <p className="text-sm text-gray-600">{card.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600 font-semibold">{card.fundingRaised} ETH</p>
                      <p className="text-xs text-gray-500">Raised</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{card.description}</p>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Created by</p>
                    <p className="text-xs text-purple-600 font-mono truncate">
                      {card.creatorAddress && `${card.creatorAddress.slice(0, 6)}...${card.creatorAddress.slice(-4)}`}
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-orange-400 hover:text-orange-500 flex items-center gap-1">
                      View Details
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />

      {/* Animation styles */}
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

export default App;