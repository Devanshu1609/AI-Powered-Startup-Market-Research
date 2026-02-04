import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LandingPageProps {
  onValidate: (idea: string) => void;
}

interface AnimationState {
  [key: string]: boolean;
}

export default function LandingPage({ onValidate }: LandingPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [ideaInput, setIdeaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState<AnimationState>({});
  const refs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute('data-animate');
            if (key) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(refs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      Object.values(refs.current).forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaInput.trim()) return;

    setIsLoading(true);
    try {
      onValidate(ideaInput);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 rounded-3xl mx-4 mt-4 mb-8">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="squares" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="60" height="60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#squares)" />
        </svg>

        <div className="max-w-6xl mx-auto px-8 py-24 text-center relative z-10">
          <h1
            ref={(el) => {
              if (el) refs.current['hero-title'] = el;
            }}
            data-animate="hero-title"
            className={`text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-1000 ${
              isVisible['hero-title']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Our AI Powered Startup Idea Generator!
          </h1>
          <p
            ref={(el) => {
              if (el) refs.current['hero-subtitle'] = el;
            }}
            data-animate="hero-subtitle"
            className={`text-xl text-gray-700 mb-4 max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible['hero-subtitle']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Generate business and startup ideas with our free AI tool in 5 seconds!
          </p>
          <p
            ref={(el) => {
              if (el) refs.current['hero-description'] = el;
            }}
            data-animate="hero-description"
            className={`text-lg text-gray-600 mb-10 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible['hero-description']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Answer three questions and our AI will create 10 business ideas you can launch. Once you land on an idea you like, talk to Val about it and she will score it.
          </p>
          <button
            ref={(el) => {
              if (el) refs.current['hero-button'] = el;
            }}
            data-animate="hero-button"
            onClick={() => setShowForm(true)}
            className={`bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-all duration-1000 delay-400 inline-block ${
              isVisible['hero-button']
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            Validate Your Idea Here!
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Validate Your Startup Idea</h2>
            <p className="text-gray-600 mb-6">Enter your startup idea and our AI will analyze it for viability, market potential, and competitive advantages.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Startup Idea
                </label>
                <textarea
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  placeholder="e.g., An AI-powered platform that helps entrepreneurs validate their startup ideas through comprehensive market analysis..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  rows={5}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIdeaInput('');
                  }}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !ideaInput.trim()}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Validate Idea'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-20 py-16">
        <div
          ref={(el) => {
            if (el) refs.current['section-tag'] = el;
          }}
          data-animate="section-tag"
          className={`mb-4 transition-all duration-1000 ${
            isVisible['section-tag']
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-10'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            How Do I Launch a Startup?
          </span>
        </div>

        <h2
          ref={(el) => {
            if (el) refs.current['section-title'] = el;
          }}
          data-animate="section-title"
          className={`text-5xl font-bold text-gray-900 mb-8 transition-all duration-1000 ${
            isVisible['section-title']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          Is My Idea Any Good?
        </h2>

        <p
          ref={(el) => {
            if (el) refs.current['section-description'] = el;
          }}
          data-animate="section-description"
          className={`text-lg text-gray-700 leading-relaxed mb-16 transition-all duration-1000 delay-100 ${
            isVisible['section-description']
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          We all want to know if our business ides is worth pursuing, and how to get it moving. Val helps you figure it out in just a few minutes. Val is trained on real market data and startup launch patterns. She'll perform AI based competitive analysis, customer analysis and she will find your unique value proposition. You'll get clarity, personalized feedback, and suggestions to make your idea more "market ready." Val even gives you assets to move forward - if you want to launch. It's fast, focused, and free.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div
            ref={(el) => {
              if (el) refs.current['card-market'] = el;
            }}
            data-animate="card-market"
            className={`transition-all duration-1000 ${
              isVisible['card-market']
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <TrendingUp className="w-8 h-8 text-gray-900 flex-shrink-0 mt-1" />
              <h3 className="text-2xl font-bold text-gray-900">Market Analysis with AI</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Val is the startup advisor we all wish we had at the beginning: fast, honest, and grounded in real market data. While you chat, Val researches your space in real time: identifying competitors, your customer profile, and how your idea fits into the market. Then she gives you a clear <span className="font-semibold">value proposition</span> to consider, and useful assets like next steps, launch advice, and helpful tools... all personalized to your idea.
            </p>
          </div>

          <div
            ref={(el) => {
              if (el) refs.current['card-community'] = el;
            }}
            data-animate="card-community"
            className={`transition-all duration-1000 delay-100 ${
              isVisible['card-community']
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-8 h-8 text-gray-900 flex-shrink-0 mt-1" />
              <h3 className="text-2xl font-bold text-gray-900">Join 200,000+ startup explorers!</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              All 200,000 members are part of our startup newsletter: the world's largest group of people exploring ideas, testing what's possible, and thinking about what to build next. Each week, we share insights from Val, startup trends, and real conversations about business and life at the earliest stages. <span className="font-semibold">You can even share your idea with the group if you want feedback or early traction.</span> No pressure, just exploration.
            </p>
          </div>
        </div>

        <div
          ref={(el) => {
            if (el) refs.current['section-tag-2'] = el;
          }}
          data-animate="section-tag-2"
          className={`mb-4 transition-all duration-1000 ${
            isVisible['section-tag-2']
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-10'
          }`}
        >
          <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            How Do I Come Up With a Business Idea?
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start mb-24">
          <div
            ref={(el) => {
              if (el) refs.current['image-section'] = el;
            }}
            data-animate="image-section"
            className={`md:w-1/3 transition-all duration-1000 ${
              isVisible['image-section']
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Young entrepreneur"
              className="rounded-2xl w-full object-cover"
            />
          </div>

          <div
            ref={(el) => {
              if (el) refs.current['text-section'] = el;
            }}
            data-animate="text-section"
            className={`md:w-2/3 transition-all duration-1000 delay-100 ${
              isVisible['text-section']
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Our AI Helps Refine and Iterate Your Idea
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Val helps you pressure-test your startup idea, fast. She's trained to ask the right questions, surface blind spots, and analyze your idea against real market patterns. <span className="font-semibold">Our AI will run a simulation of what your startup launch might look like, including customer feedback and conversation rates.</span> See below for more info.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div
                ref={(el) => {
                  if (el) refs.current['detail-1'] = el;
                }}
                data-animate="detail-1"
                className={`transition-all duration-1000 delay-200 ${
                  isVisible['detail-1']
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Simulate Customer Discussions and a Launch
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Val will run a quick simulation of what your startup launch might look like. She will surface potential concerns, objections and feedback from your target customer. Our AI tool will identify phrases on Google you can rank for, what smart pricing might look like and what your website conversion rate could be.
                </p>
              </div>

              <div
                ref={(el) => {
                  if (el) refs.current['detail-2'] = el;
                }}
                data-animate="detail-2"
                className={`transition-all duration-1000 delay-300 ${
                  isVisible['detail-2']
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Move Your Startup Idea and Entrepreneurship Journey Forward
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  After your chat, Val sends you a personalized guide with suggestions for how to improve your concept and explore it further. You'll also get helpful resources like an AI-generated landing page if you want momentum! She will analyze and score your idea against market data and the competition in your space. It's the best first step you can take when proving out your idea.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={(el) => {
            if (el) refs.current['cta-section'] = el;
          }}
          data-animate="cta-section"
          className={`text-center py-16 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 rounded-3xl transition-all duration-1000 ${
            isVisible['cta-section']
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-gray-900" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Validate Your Idea?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Get instant AI-powered insights into your startup idea's potential
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Validation Now
          </button>
        </div>
      </div>
    </div>
  );
}
