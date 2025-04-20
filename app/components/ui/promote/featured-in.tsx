import { useEffect, useState } from "react";

export function FeaturedIn() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const element = document.getElementById('featured-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  const publications = [
    {
      id: "techcrunch",
      name: "TechCrunch",
      logo: "/images/logos/techcrunch.svg",
      quote: "Disrupting the traditional fundraising landscape"
    },
    {
      id: "forbes",
      name: "Forbes",
      logo: "/images/logos/forbes.svg",
      quote: "One of the top 10 startups to watch"
    },
    {
      id: "wired",
      name: "Wired",
      logo: "/images/logos/wired.svg",
      quote: "Revolutionizing how startups connect with investors"
    },
    {
      id: "venturebeat",
      name: "VentureBeat",
      logo: "/images/logos/venturebeat.svg",
      quote: "The AI-powered platform changing startup fundraising"
    },
    {
      id: "bloomberg",
      name: "Bloomberg",
      logo: "/images/logos/bloomberg.svg",
      quote: "Making fundraising more efficient and data-driven"
    }
  ];

  return (
    <div id="featured-section" className="py-16 w-full relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-violet-900/10 to-zinc-900/0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl font-medium text-zinc-400 uppercase tracking-wider">
            Featured In
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-violet-500 to-pink-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 items-center">
          {publications.map((pub, index) => (
            <div
              key={pub.id}
              className="flex flex-col items-center transition-all duration-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="w-full h-12 relative flex items-center justify-center group">
                {/* Placeholder logo - you would use actual SVG logos */}
                <div className="w-full h-full flex items-center justify-center bg-zinc-800/50 rounded-md backdrop-blur-sm p-3 group-hover:bg-zinc-800 transition-all duration-300">
                  <div className="text-lg font-bold text-zinc-300 tracking-tighter">
                    {pub.name}
                  </div>
                </div>
                
                {/* Quote tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 -bottom-16 left-1/2 transform -translate-x-1/2 bg-zinc-800 p-3 rounded-md text-sm text-zinc-300 w-48 shadow-xl transition-all duration-300 pointer-events-none z-10">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-zinc-800 rotate-45" />
                  <p className="relative z-10 italic">{pub.quote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated dots */}
        <div className="mt-16 text-center relative">
          <div 
            className="absolute w-3 h-3 rounded-full bg-violet-500/50 animate-ping" 
            style={{ top: '50%', left: '10%', animationDelay: '0s', animationDuration: '3s' }} 
          />
          <div 
            className="absolute w-2 h-2 rounded-full bg-pink-500/50 animate-ping" 
            style={{ top: '30%', right: '15%', animationDelay: '1s', animationDuration: '2.5s' }} 
          />
          <div 
            className="absolute w-4 h-4 rounded-full bg-indigo-500/50 animate-ping" 
            style={{ bottom: '10%', left: '20%', animationDelay: '1.5s', animationDuration: '3.5s' }} 
          />
          
          <a 
            href="#press" 
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-zinc-300 bg-zinc-800/60 backdrop-blur-sm rounded-lg hover:bg-zinc-800 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <span>View press coverage</span>
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 