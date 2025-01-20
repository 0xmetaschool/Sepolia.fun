import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from './Footer';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Sepolia.fun
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-7xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Create & Launch
            </span>
            <br />
            Your Meme Token
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            The most powerful and user-friendly platform for creating, launching, and managing your meme tokens on the blockchain
          </p>
          
          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              Get Started Now
            </button>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 backdrop-blur-sm"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-black/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" data-aos="fade-up">
            Why Choose Sepolia.fun?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Token Creation",
                description: "Create your own meme token in minutes with our intuitive interface",
                icon: "🚀",
                delay: 0
              },
              {
                title: "Bonding Curve Mechanism",
                description: "Automated price discovery with bonding curve, ensuring fair token distribution and price stability",
                icon: "📈",
                delay: 200
              },
              {
                title: "Uniswap Integration",
                description: "Automatic liquidity pool creation on Uniswap once funding target is reached",
                icon: "🦄",
                delay: 400
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all"
                data-aos="fade-up"
                data-aos-delay={feature.delay}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Launch Process */}
      <section id="how-it-works" className="relative py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16" data-aos="fade-up">
            Token Launch Process
          </h2>
          
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-8" data-aos="fade-up">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Initial Token Creation</h3>
                  <p className="text-gray-400">Configure your token's name, symbol, and initial parameters through our intuitive interface.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Funding Phase</h3>
                  <p className="text-gray-400">Token enters funding phase with a target of 24 ETH. Users can purchase tokens using the bonding curve mechanism.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Liquidity Pool Creation</h3>
                  <p className="text-gray-400">Once the funding target of 24 ETH is met, a liquidity pool will be automatically created on Uniswap, enabling seamless trading.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Active Trading</h3>
                  <p className="text-gray-400">Your token becomes available for trading on Uniswap, with initial liquidity secured through the funding phase.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-purple-900/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-purple-400 font-semibold">Note:</span> The Uniswap liquidity pool will be automatically created when the funding target of 24 ETH is reached. This ensures your token has sufficient liquidity for trading from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-8">Join Our Ecosystem</h2>
            <p className="text-xl text-gray-300 mb-12">
              Be part of the fastest-growing meme token ecosystem. Create, trade, and grow your tokens with our comprehensive suite of tools.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Launch App Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
