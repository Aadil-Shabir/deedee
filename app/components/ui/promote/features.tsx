import { ChartLineUp, Users, PresentationChart, LightbulbFilament, Handshake, ChartBar } from "phosphor-react";

export function Features() {
  const features = [
    {
      id: 1,
      title: "Investor Matching",
      description: "Get matched with the right investors who have a history of funding startups in your industry.",
      icon: Users,
      delay: "0ms"
    },
    {
      id: 2,
      title: "Pitch Optimization",
      description: "Receive data-driven feedback on your pitch deck to maximize investor engagement.",
      icon: PresentationChart,
      delay: "100ms"
    },
    {
      id: 3,
      title: "Fundraising Analytics",
      description: "Track your fundraising progress with real-time metrics and conversion analytics.",
      icon: ChartLineUp,
      delay: "200ms"
    },
    {
      id: 4,
      title: "AI Insights",
      description: "Leverage AI-powered insights to improve your fundraising strategy and approach.",
      icon: LightbulbFilament,
      delay: "300ms"
    },
    {
      id: 5,
      title: "Deal Room",
      description: "Manage investor relationships and deal flow in one secure, centralized platform.",
      icon: Handshake,
      delay: "400ms"
    },
    {
      id: 6,
      title: "Benchmarking",
      description: "Compare your fundraising metrics against industry benchmarks to identify opportunities.",
      icon: ChartBar,
      delay: "500ms"
    }
  ];

  return (
    <div className="w-full py-24 bg-zinc-900/50 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/10 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-pink-400 text-transparent bg-clip-text">
            Everything You Need to Raise Capital
          </h2>
          <p className="text-zinc-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and insights founders need to successfully navigate the fundraising process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-zinc-900/70 backdrop-blur-sm border border-violet-900/20 rounded-xl p-6 shadow-lg shadow-violet-900/10 hover:shadow-violet-800/20 transition-all duration-300 hover:translate-y-[-5px] hover:bg-zinc-800/70"
              style={{ 
                animation: "slideIn 0.6s ease-out forwards",
                animationDelay: feature.delay,
                opacity: 0
              }}
            >
              <div className="bg-gradient-to-br from-violet-700 to-violet-900 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 shadow-lg shadow-violet-900/20">
                <feature.icon size={24} weight="bold" className="text-white animate-float" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-zinc-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 