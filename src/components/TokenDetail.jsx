import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import '../App.css';
import { abi } from './abi';
import { tokenAbi } from './tokenAbi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Footer from './Footer';

ChartJS.register(ArcElement, Tooltip, Legend);

const TokenDetail = () => {
  const { tokenAddress } = useParams();
  const location = useLocation();
  const { card } = location.state || {};

  const [owners, setOwners] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSupply, setTotalSupply] = useState('0');
  const [remainingTokens, setRemainingTokens] = useState('0');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [cost, setCost] = useState('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const tokenDetails = card || {
    name: 'Unknown',
    symbol: 'Unknown',
    description: 'No description available',
    tokenImageUrl: 'https://via.placeholder.com/200',
    fundingRaised: '0 ETH',
    creatorAddress: '0x0000000000000000000000000000000000000000',
  };

  const fundingRaised = parseFloat(tokenDetails.fundingRaised.replace(' ETH', ''));
  const fundingGoal = 24;
  const maxSupply = 800000;

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(130, 94, 255, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(130, 94, 255, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownersResponse = await fetch(
          `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/owners?chain=sepolia&order=DESC`,
          {
            headers: {
              accept: 'application/json',
              'X-API-Key': process.env.REACT_APP_X_API_KEY,
            },
          }
        );
        const ownersData = await ownersResponse.json();
        setOwners(ownersData.result || []);

        const transfersResponse = await fetch(
          `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/transfers?chain=sepolia&order=DESC`,
          {
            headers: {
              accept: 'application/json',
              'X-API-Key': process.env.REACT_APP_X_API_KEY,
            },
          }
        );
        const transfersData = await transfersResponse.json();
        setTransfers(transfersData.result || []);

        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const totalSupplyResponse = await contract.totalSupply();
        const totalSupplyFormatted = parseInt(ethers.formatUnits(totalSupplyResponse, 'ether')) - 200000;
        
        setTotalSupply(totalSupplyFormatted);
        setRemainingTokens(maxSupply - totalSupplyFormatted);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress]);

  useEffect(() => {
    if (owners.length > 0) {
      setChartData({
        labels: owners.map(owner => `${owner.owner_address.slice(0, 6)}...${owner.owner_address.slice(-4)}`),
        datasets: [{
          data: owners.map(owner => parseFloat(owner.percentage_relative_to_total_supply)),
          backgroundColor: chartData.datasets[0].backgroundColor,
          borderColor: chartData.datasets[0].borderColor,
          borderWidth: 1,
        }]
      });
    }
  }, [owners]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgb(255, 255, 255)',
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.toFixed(2)}%`
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const fundingRaisedPercentage = (fundingRaised / fundingGoal) * 100;
  const totalSupplyPercentage = ((totalSupply - 200000) / (maxSupply - 200000)) * 100;

  const getCost = async () => {
    if (!purchaseAmount) return;

    try {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider);
      const costInWei = await contract.calculateCost(totalSupply, purchaseAmount);
      setCost(ethers.formatUnits(costInWei, 'ether'));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer);

      const transaction = await contract.buyMemeToken(tokenAddress, purchaseAmount, {
        value: ethers.parseUnits(cost, 'ether'),
      });
      const receipt = await transaction.wait();

      alert(`Transaction successful! Hash: ${receipt.hash}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error during purchase:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-400 text-gray-800 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,#FFD700,#FFD700_10px,#FFA500_10px,#FFA500_20px)] opacity-20" />
        {[...Array(20)].map((_, i) => (
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

      <div className="px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-orange-400 text-white rounded-full font-bold hover:bg-orange-500 transform hover:scale-110 hover:rotate-2 transition-all shadow-lg"
        >
          ← Back to Memes
        </button>
      </div>

      <div className="text-center mb-12 pt-8">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500 animate-pulse">
          Token Details
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-orange-400 transform hover:rotate-1 transition-all">
            <h2 className="text-4xl font-bold text-purple-600 mb-6">
              {tokenDetails.name}
              <span className="text-orange-500 ml-4">${tokenDetails.symbol}</span>
            </h2>
            
            {tokenDetails.tokenImageUrl && (
              <div className="mb-6 rounded-3xl overflow-hidden bg-white p-4 shadow-inner">
                <img 
                  src={tokenDetails.tokenImageUrl} 
                  alt={tokenDetails.name} 
                  className="w-full h-64 object-contain mx-auto transform hover:scale-105 transition-transform"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-orange-100 rounded-xl p-4">
                <p className="text-sm font-bold text-purple-600 mb-2">Creator Address:</p>
                <p className="font-mono text-base break-all bg-white/50 p-2 rounded-lg">
                  {tokenDetails.creatorAddress}
                </p>
              </div>

              <div className="bg-orange-100 rounded-xl p-4">
                <p className="text-sm font-bold text-purple-600 mb-2">Token Address:</p>
                <p className="font-mono text-base break-all bg-white/50 p-2 rounded-lg">
                  {tokenAddress}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-600 text-white rounded-xl p-4 text-center">
                  <p className="text-sm font-bold mb-2">Funding Raised</p>
                  <p className="text-2xl font-black">{tokenDetails.fundingRaised}</p>
                </div>
                <div className="bg-orange-500 text-white rounded-xl p-4 text-center">
                  <p className="text-sm font-bold mb-2">Total Supply</p>
                  <p className="text-2xl font-black">{remainingTokens} / 800K</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-inner">
                <p className="text-sm font-bold text-purple-600 mb-2">Description</p>
                <p className="text-base text-gray-700 italic">{tokenDetails.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Progress Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-purple-500 transform hover:-rotate-1 transition-all">
              <h3 className="text-3xl font-bold text-orange-500 mb-6">Moon Progress 🌕</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-purple-600">Bonding Curve Progress</span>
                    <span className="font-bold text-orange-500">{fundingRaised} / {fundingGoal} ETH</span>
                  </div>
                  <div className="h-4 bg-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${fundingRaisedPercentage}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    When we reach {fundingGoal} ETH, liquidity rockets to 🦄 Uniswap and LP tokens get burned! 🔥
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <span className="font-bold text-purple-600">Remaining Tokens</span>
                    <span className="font-bold text-orange-500">{remainingTokens} / 800K</span>
                  </div>
                  <div className="h-4 bg-orange-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${totalSupplyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buy Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-orange-400 transform hover:rotate-1 transition-all">
              <h3 className="text-3xl font-bold text-purple-600 mb-6">Buy Tokens 🚀</h3>
              <div className="space-y-6">
                <input
                  type="number"
                  placeholder="Amount of tokens to moon with..."
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-2xl bg-white border-4 border-purple-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 placeholder-gray-400 transition-all"
                />
                <button 
                  onClick={getCost}
                  className="w-full py-4 text-xl font-black bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-2xl hover:scale-105 hover:shadow-xl transition-all"
                >
                  Calculate Moon Cost 🚀
                </button>
              </div>
            </div>

            {/* Top Astronauts */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-purple-500 transform hover:-rotate-1 transition-all">
              <h3 className="text-3xl font-bold text-orange-500 mb-6">Top Astronauts 👩🚀</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-orange-200">
                      <th className="pb-3 text-left text-purple-600">Rank</th>
                      <th className="pb-3 text-left text-purple-600">Address</th>
                      <th className="pb-3 text-right text-purple-600">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.slice(0, 10).map((owner, index) => (
                      <tr key={index} className="hover:bg-orange-50">
                        <td className="py-3 font-bold text-orange-500">#{index + 1}</td>
                        <td className="py-3 font-mono">
                          <a
                            href={`https://sepolia.etherscan.io/address/${owner.owner_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-orange-500 transition-colors"
                          >
                            {owner.owner_address.slice(0, 6)}...{owner.owner_address.slice(-4)}
                          </a>
                        </td>
                        <td className="py-3 text-right font-bold text-purple-600">
                          {parseFloat(owner.percentage_relative_to_total_supply).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-purple-100 rounded-xl">
                <div className="flex justify-between text-purple-700 font-bold">
                  <span>Total Holders:</span>
                  <span>{owners.length}</span>
                </div>
                <div className="flex justify-between text-purple-700 font-bold">
                  <span>Top 10 Control:</span>
                  <span>
                    {owners.slice(0, 10).reduce((acc, owner) => 
                      acc + parseFloat(owner.percentage_relative_to_total_supply), 0
                    ).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Transfers Section */}
        <div className="mt-12 bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-orange-400 transform hover:rotate-1 transition-all">
          <h3 className="text-4xl font-bold text-purple-600 mb-8">Token Transfers 📤</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-200">
                  <th className="pb-3 text-left text-purple-600">From</th>
                  <th className="pb-3 text-left text-purple-600">To</th>
                  <th className="pb-3 text-right text-purple-600">Value</th>
                  <th className="pb-3 text-right text-purple-600">TX Hash</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => (
                  <tr key={index} className="hover:bg-orange-50">
                    <td className="py-3 font-mono text-purple-600">
                      {transfer.from_address.slice(0, 6)}...{transfer.from_address.slice(-4)}
                    </td>
                    <td className="py-3 font-mono text-purple-600">
                      {transfer.to_address.slice(0, 6)}...{transfer.to_address.slice(-4)}
                    </td>
                    <td className="py-3 text-right font-bold text-orange-500">
                      {ethers.formatUnits(transfer.value, 'ether')}
                    </td>
                    <td className="py-3 font-mono text-right">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transfer.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-orange-500 transition-colors"
                      >
                        {transfer.transaction_hash.slice(0, 6)}...{transfer.transaction_hash.slice(-4)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-500 max-w-md w-full animate-pop-in">
            <h4 className="text-3xl font-bold text-orange-500 mb-6">Confirm Launch 🚀</h4>
            <div className="text-center mb-8">
              <p className="text-2xl font-bold text-purple-600">
                {purchaseAmount} Tokens
              </p>
              <p className="text-4xl font-black text-orange-500 my-4">
                {cost} ETH
              </p>
              <p className="text-sm text-gray-600">This transaction will be recorded on-chain forever! 🌐</p>
            </div>
            <div className="grid gap-4">
              <button
                onClick={handlePurchase}
                className="py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-transform"
              >
                Confirm Purchase 🚀
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-4 bg-gray-100 text-purple-600 rounded-2xl font-bold text-xl hover:bg-gray-200 transition-colors"
              >
                Cancel Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer/>

      <style jsx>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default TokenDetail;