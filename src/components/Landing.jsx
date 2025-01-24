import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Landing = () => {
  const navigate = useNavigate();
  const [dogeMoveX, setDogeMoveX] = useState(0);
  const [dogeMoveY, setDogeMoveY] = useState(0);
  const [selectedMeme, setSelectedMeme] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setDogeMoveX(x);
      setDogeMoveY(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sample meme data
  const memeGallery = [
    {
      title: "Diamond Hands",
      description: "HODL Forever! 💎🙌",
      emoji: "💎"
    },
    {
      title: "To The Moon",
      description: "Next stop: Luna! 🚀",
      emoji: "🚀"
    },
    {
      title: "Wen Lambo",
      description: "Soon™ 🏎️",
      emoji: "🏎️"
    },
    {
      title: "WAGMI",
      description: "We're All Gonna Make It! 🌟",
      emoji: "🌟"
    },
    {
      title: "Doge Life",
      description: "Much wow, very profit 🐕",
      emoji: "🐕"
    },
    {
      title: "Paper Hands",
      description: "Not welcome here! 📄",
      emoji: "📄"
    },
    {
      title: "Buy The Dip",
      description: "Tasty discounts! 📉",
      emoji: "📉"
    },
    {
      title: "GM/GN",
      description: "Crypto never sleeps! 🌞",
      emoji: "🌞"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-400 text-gray-800 overflow-hidden">
      {/* Fun background elements */}
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

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 transform hover:scale-110 transition-transform">
              <span className="text-4xl">🎭</span>
              <div className="text-2xl font-extrabold text-white">
                Sepolia.fun
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-white hover:text-yellow-200 transition-colors font-bold">Features</a>
              <a href="#memes" className="text-white hover:text-yellow-200 transition-colors font-bold">Memes</a>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-white rounded-full font-bold text-orange-500 hover:bg-yellow-200 transform hover:scale-110 transition-all hover:rotate-2"
              >
                Launch App 🚀
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center relative">
          <div 
            className="absolute -top-20 right-0 text-9xl transform hover:scale-125 transition-transform cursor-pointer select-none"
            style={{
              transform: `translate(${dogeMoveX}px, ${dogeMoveY}px) rotate(${dogeMoveX}deg)`
            }}
          >
            
          </div>
          <h1 className="text-8xl font-extrabold mb-8">
            <span className="block text-orange-500 animate-bounce">WOW!</span>
            <span className="block text-purple-600">Meme Token</span>
            <span className="block text-orange-500">Much Fun!</span>
          </h1>
          <p className="text-2xl mb-12 text-gray-700 font-bold">
            Create your own meme token faster than you can say "TO THE MOON!" 
            <span className="inline-block animate-pulse">🌙</span>
          </p>
          
          <button
            onClick={() => navigate('/home')}
            className="px-12 py-6 bg-purple-600 text-white rounded-full font-bold text-2xl transform hover:rotate-6 hover:scale-110 transition-all shadow-xl hover:shadow-2xl hover:bg-purple-500"
          >
            Start Your Meme Journey! 🚀
          </button>
        </div>
      </div>

      {/* Fun Stats */}
      <div className=" bg-amber-500 transform -skew-y-3">
        <div className="container mx-auto px-6 py-24 transform skew-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Memes Created", value: "1,337+", icon: "🎭" },
              { label: "Moon Missions", value: "420", icon: "🌙" },
              { label: "Diamond Hands", value: "69K+", icon: "💎" },
              { label: "Rocket Launches", value: "9001+", icon: "🚀" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 text-center transform hover:rotate-6 hover:scale-105 transition-all shadow-xl"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-extrabold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-32 bg-gradient-to-b from-yellow-300 to-yellow-400">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-extrabold text-center mb-20 text-purple-600">
            Such Features! 🎯
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "One-Click Moon Mission",
                description: "Launch your token faster than a SpaceX rocket! 🚀",
                icon: "🎯"
              },
              {
                title: "HODL Power",
                description: "Diamond hands activated! Paperhand protection included! 💎",
                icon: "💪"
              },
              {
                title: "Ape-tastic Liquidity",
                description: "So liquid, much wow! Auto-pool creation! 🦍",
                icon: "🌊"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 transform hover:-rotate-6 hover:scale-105 transition-all shadow-xl text-center"
              >
                <div className="text-7xl mb-6 animate-bounce">{feature.icon}</div>
                <h3 className="text-2xl font-extrabold mb-4 text-purple-600">{feature.title}</h3>
                <p className="text-gray-600 font-bold">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meme Gallery */}
      <section id="memes" className="py-32 bg-purple-600 transform -skew-y-3">
        <div className="container mx-auto px-6 transform skew-y-3">
          <h2 className="text-6xl font-extrabold text-center mb-20 text-white">
            Meme Hall of Fame 🏆
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {memeGallery.map((meme, index) => (
              <div
                key={index}
                className="group relative aspect-square bg-white rounded-3xl overflow-hidden transform hover:rotate-6 hover:scale-105 transition-all shadow-xl cursor-pointer"
                onClick={() => setSelectedMeme(meme)}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <span className="text-8xl">{meme.emoji}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{meme.title}</h3>
                    <p className="text-sm text-gray-200">{meme.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-b from-yellow-300 to-yellow-400">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-6xl font-extrabold mb-8 text-purple-600">
            Ready To Moon? 🚀
          </h2>
          <p className="text-2xl mb-12 text-gray-700 font-bold max-w-2xl mx-auto">
            Don't let your memes be dreams! Join the most entertaining token ecosystem in the galaxy!
          </p>
          <button
            onClick={() => navigate('/home')}
            className="px-12 py-6 bg-amber-500 text-white rounded-full font-bold text-2xl transform hover:rotate-6 hover:scale-110 transition-all shadow-xl hover:shadow-2xl"
          >
            Launch Your Meme! 🎭
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      {selectedMeme && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMeme(null)}
        >
          <div 
            className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedMeme.emoji}</div>
              <h3 className="font-bold text-2xl mb-2 text-purple-600">{selectedMeme.title}</h3>
              <p className="text-gray-600 text-lg">{selectedMeme.description}</p>
            </div>
            <button
              className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
              onClick={() => setSelectedMeme(null)}
            >
              ❌
            </button>
          </div>
        </div>
      )}

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

export default Landing;