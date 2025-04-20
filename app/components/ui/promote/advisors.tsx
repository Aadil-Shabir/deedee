import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Advisors() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAdvisor, setActiveAdvisor] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const element = document.getElementById('advisors-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  const advisors = [
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      role: "Partner at Alpha Ventures",
      image: "/images/advisors/advisor1.jpg",
      bio: "Former investment banker with 15+ years experience in tech investments. Advisor to multiple unicorn startups and board member of the Tech Founders Association.",
      expertise: ["Fundraising Strategy", "VC Relationships", "Growth"]
    },
    {
      id: "marcus-johnson",
      name: "Marcus Johnson",
      role: "Serial Entrepreneur",
      image: "/images/advisors/advisor2.jpg",
      bio: "Founded and exited 3 successful tech startups. Experience raising over $200M in venture capital. Passionate about helping first-time founders navigate the fundraising landscape.",
      expertise: ["Pitch Refinement", "Business Models", "Strategic Planning"]
    },
    {
      id: "elena-rodriguez",
      name: "Elena Rodriguez",
      role: "CEO of TechStars Europe",
      image: "/images/advisors/advisor3.jpg",
      bio: "Leading figure in the European startup ecosystem. Helped over 200 startups secure funding. Regular speaker at TechCrunch and Web Summit.",
      expertise: ["International Expansion", "Accelerator Programs", "Investor Relations"]
    },
    {
      id: "david-zhang",
      name: "David Zhang",
      role: "Former CFO at Cloudera",
      image: "/images/advisors/advisor4.jpg",
      bio: "Guided Cloudera through IPO and multiple funding rounds. Expertise in financial modeling and investor presentations. Angel investor in 20+ early-stage startups.",
      expertise: ["Financial Planning", "Term Sheets", "Exit Strategy"]
    }
  ];

  return (
    <div id="advisors-section" className="py-20 w-full relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 via-violet-900/10 to-zinc-900/0 pointer-events-none" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out'
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-pink-500">
            Our Expert Advisors
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Industry leaders helping shape our platform and supporting our community of founders
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-pink-500 mx-auto mt-8 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advisors.map((advisor, index) => (
            <div
              key={advisor.id}
              className="relative"
              onMouseEnter={() => setActiveAdvisor(advisor.id)}
              onMouseLeave={() => setActiveAdvisor(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease-out',
                transitionDelay: `${index * 150}ms`
              }}
            >
              <div 
                className={`
                  bg-zinc-800/40 backdrop-blur-lg rounded-xl overflow-hidden 
                  transition-all duration-300 h-full
                  ${activeAdvisor === advisor.id ? 'shadow-lg shadow-violet-500/20 scale-[1.02]' : ''}
                `}
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Placeholder for advisor image */}
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/0 to-zinc-800/80 z-10" />
                  <div className={`w-full h-full bg-gradient-to-tr from-violet-900 to-zinc-800 transition-all duration-500 
                    ${activeAdvisor === advisor.id ? 'scale-110' : 'scale-100'}`} />
                  
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1 bg-violet-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-violet-300">
                      Advisor
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{advisor.name}</h3>
                  <p className="text-violet-300 mb-4">{advisor.role}</p>
                  
                  <p className="text-zinc-400 text-sm mb-5">
                    {advisor.bio}
                  </p>
                  
                  <div className="pt-4 border-t border-zinc-700/50">
                    <h4 className="text-sm font-medium text-zinc-300 mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {advisor.expertise.map((skill) => (
                        <span 
                          key={skill} 
                          className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`
                  absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-600/20 to-transparent 
                  h-1 transition-all duration-300
                  ${activeAdvisor === advisor.id ? 'h-1.5' : 'h-0.5'}
                `} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="#meet-team" 
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg shadow-lg shadow-violet-700/20 hover:shadow-violet-700/40 transition-all duration-300"
          >
            <span>Meet our full team</span>
            <svg 
              className="ml-2 w-4 h-4 animate-bounce" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 