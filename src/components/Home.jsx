import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
            >
              ← Back to Landing
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/token-create')}
              className="px-6 py-2 rounded-lg font-semibold bg-pink-600 hover:bg-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Create New Token
            </button>
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="px-6 py-2 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 transition-all duration-300"
              >
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </button>
            )}
          </div>
        </nav>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {/* Meme Token Explorer */}
            Sepolia.fun Explorer
          </h1>
        </div>

        <div className="flex justify-center mb-8" data-aos="fade-up">
          <input
            type="text"
            placeholder="Search tokens by name or symbol..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/2 px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => navigateToTokenDetail(card)}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="bg-gray-800 rounded-xl p-4 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 border border-gray-700 hover:border-purple-500"
              >
                {card.tokenImageUrl && (
                  <div className="mb-3 overflow-hidden rounded-lg aspect-square">
                    <img
                      src={card.tokenImageUrl}
                      alt={card.name}
                      className="w-full h-full object-contain bg-gray-900"
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
                      <h2 className="text-lg font-bold text-purple-400 line-clamp-1">{card.name}</h2>
                      <p className="text-sm text-gray-400">{card.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400 font-semibold">{card.fundingRaised} ETH</p>
                      <p className="text-xs text-gray-500">Raised</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{card.description}</p>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-500">Created by</p>
                    <p className="text-xs text-gray-400 font-mono truncate">
                      {card.creatorAddress && `${card.creatorAddress.slice(0, 6)}...${card.creatorAddress.slice(-4)}`}
                    </p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
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
    </div>
  );
};

export default App;
