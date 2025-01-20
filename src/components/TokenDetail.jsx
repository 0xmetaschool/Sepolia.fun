import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import '../App.css'; 
import { abi } from './abi'; 
import { tokenAbi } from './tokenAbi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

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

  // Constants
  const fundingGoal = 24; 
  const maxSupply = parseInt(800000); 

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

        // Fetch total supply
        const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
        const contract = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const totalSupplyResponse = await contract.totalSupply();
        var totalSupplyFormatted = parseInt(ethers.formatUnits(totalSupplyResponse, 'ether')) - 200000;
        setTotalSupply(parseInt(totalSupplyFormatted));

        // Calculate remaining tokens
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
    }
  }, [owners]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgb(255, 255, 255)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(2)}%`;
          }
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

  // Calculate percentages for progress bars
  const fundingRaisedPercentage = (fundingRaised / fundingGoal) * 100;
  const totalSupplyPercentage =
    ((parseFloat(totalSupply) - 200000) / ethers.formatUnits(maxSupply - 200000, 'ether')) * 100;

  // Function to get cost of purchasing tokens
  const getCost = async () => {
    if (!purchaseAmount) return;

    try {
      const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider);
      const costInWei = await contract.calculateCost(totalSupply, purchaseAmount); // Replace with actual function
      setCost(ethers.formatUnits(costInWei, 'ether'));
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error calculating cost:', error);
    }
  };

  // Function to handle purchase
  const handlePurchase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer)
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer);

      const transaction = await contract.buyMemeToken(tokenAddress, purchaseAmount,{
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-4">
      <div className="px-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
        >
          ← Back
        </button>
      </div>
      <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
           Token Details
          </h1>
        </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-gray-800 rounded-xl p-5 shadow-xl border border-gray-700" data-aos="fade-right">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              {tokenDetails.name}
            </h2>
            
            {tokenDetails.tokenImageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden bg-gray-900 p-2">
                <img 
                  src={tokenDetails.tokenImageUrl} 
                  alt={tokenDetails.name} 
                  className="w-full max-w-[200px] h-[200px] object-contain mx-auto rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3 text-gray-300">
              <div className="bg-gray-900 rounded-lg p-3">
                <p className="mb-1"><span className="text-purple-400 font-semibold">Creator Address:</span></p>
                <p className="font-mono text-sm break-all">{tokenDetails.creatorAddress}</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-3">
                <p className="mb-1"><span className="text-purple-400 font-semibold">Token Address:</span></p>
                <p className="font-mono text-sm break-all">{tokenAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-purple-400 font-semibold mb-1">Funding Raised</p>
                  <p className="text-xl font-bold">{tokenDetails.fundingRaised}</p>
                </div>

                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-purple-400 font-semibold mb-1">Token Symbol</p>
                  <p className="text-xl font-bold">{tokenDetails.symbol}</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-3">
                <p className="text-purple-400 font-semibold mb-1">Description</p>
                <p className="text-sm">{tokenDetails.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6" data-aos="fade-left">
            {/* Progress Bars */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-purple-400 font-semibold">Bonding Curve Progress</span>
                    <span className="text-gray-300">{fundingRaised} / {fundingGoal} ETH</span>
                  </div>
                  <div className="h-4 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${fundingRaisedPercentage}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    When the market cap reaches {fundingGoal} ETH, all the liquidity from the bonding curve will be deposited into 🦄 Uniswap, and the LP tokens will be burned.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-purple-400 font-semibold">Remaining Tokens</span>
                    <span className="text-gray-300">{remainingTokens} / 800,000</span>
                  </div>
                  <div className="h-4 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${totalSupplyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buy Tokens Section */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Buy Tokens</h3>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Enter amount of tokens to buy"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                />
                <button 
                  onClick={getCost}
                  className="w-full py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Owners Section */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700" data-aos="fade-up">
          <h3 className="text-xl font-bold text-purple-400 mb-6">Token Owners</h3>
          
          {/* Add Pie Chart with Enhanced Details */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Pie Chart */}
              <div className="bg-gray-900 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">Ownership Distribution</h4>
                <div className="h-[400px] flex items-center justify-center">
                  {!loading && owners.length > 0 && (
                    <Pie data={chartData} options={chartOptions} />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">Total Holders: {owners.length}</p>
                  <p className="text-sm text-gray-400">Total Supply: {tokenDetails.totalSupply} Tokens</p>
                </div>
              </div>

              {/* Right side - Top Holders List */}
              <div className="bg-gray-900 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">Top 10 Token Holders</h4>
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Rank</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Address</th>
                         
                          <th className="px-4 py-2 text-right text-sm font-semibold text-gray-300">Percentage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {owners.slice(0, 10).map((owner, index) => (
                          <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-2 text-sm text-gray-400">#{index + 1}</td>
                            <td className="px-4 py-2 text-sm">
                              <a 
                                href={`https://sepolia.etherscan.io/address/${owner.owner_address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 font-mono"
                              >
                                {owner.owner_address.slice(0, 6)}...{owner.owner_address.slice(-4)}
                              </a>
                            </td>
                            <td className="px-4 py-2 text-right text-sm text-gray-300">
                              {parseFloat(owner.percentage_relative_to_total_supply).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400">
                    <div className="flex justify-between mb-2">
                      <span>Total Unique Holders:</span>
                      <span className="text-purple-400 font-semibold">{owners.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top 10 Holders Control:</span>
                      <span className="text-purple-400 font-semibold">
                        {owners.slice(0, 10).reduce((acc, owner) => 
                          acc + parseFloat(owner.percentage_relative_to_total_supply), 0
                        ).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Original Owners Table */}
          {/* {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Owner Address</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Percentage of Total Supply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {owners.map((owner, index) => (
                    <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-sm text-gray-300">{owner.owner_address}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{owner.percentage_relative_to_total_supply}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )} */}
        </div>

        {/* Transfers Section */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700" data-aos="fade-up">
          <h3 className="text-xl font-bold text-purple-400 mb-6">Token Transfers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">From Address</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">To Address</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Value (ETH)</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Transaction Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transfers.map((transfer, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-gray-300">{transfer.from_address.slice(0, 8)}...{transfer.from_address.slice(-6)}</td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-300">{transfer.to_address.slice(0, 8)}...{transfer.to_address.slice(-6)}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{ethers.formatUnits(transfer.value, 'ether')}</td>
                    <td className="px-4 py-3 font-mono text-sm text-right text-purple-400">
                      <a href={`https://sepolia.etherscan.io/tx/${transfer.transaction_hash}`} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300">
                        {transfer.transaction_hash.slice(0, 8)}...{transfer.transaction_hash.slice(-6)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 max-w-md w-full" data-aos="zoom-in">
            <h4 className="text-xl font-bold text-purple-400 mb-4">Confirm Purchase</h4>
            <p className="text-gray-300 mb-6">Cost of {purchaseAmount} tokens: <span className="font-bold">{cost} ETH</span></p>
            <div className="flex gap-4">
              <button 
                onClick={handlePurchase}
                className="flex-1 py-2 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                Confirm
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenDetail;
