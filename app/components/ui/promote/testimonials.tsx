import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const element = document.getElementById('testimonials-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto advance testimonials every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      id: "1",
      name: "Mia Chen",
      role: "Founder, Quantum AI",
      image: "/images/testimonials/founder1.jpg",
      quote: "This platform transformed our fundraising journey. We secured a $2M seed round in just 6 weeks, compared to the 6 months we spent struggling on our own.",
      company_logo: "/images/testimonials/company1.svg",
      raised: "$2M Seed",
      time: "6 weeks"
    },
    {
      id: "2",
      name: "Jason Park",
      role: "CEO, EcoScale",
      image: "/images/testimonials/founder2.jpg",
      quote: "The investor matching was spot-on. We connected with VCs who truly understood our vision for sustainable technology. Our Series A closed 40% faster than the industry average.",
      company_logo: "/images/testimonials/company2.svg",
      raised: "$8M Series A",
      time: "3 months"
    },
    {
      id: "3",
      name: "Sophia Rodriguez",
      role: "Co-founder, HealthStream",
      image: "/images/testimonials/founder3.jpg",
      quote: "As first-time founders in healthcare tech, we were struggling with investor pitches. The guidance we received helped us refine our story and connect with the right investors who believed in our mission.",
      company_logo: "/images/testimonials/company3.svg",
      raised: "$3.5M Seed",
      time: "8 weeks"
    },
    {
      id: "4",
      name: "Alex Johnson",
      role: "Founder, Skyward Robotics",
      image: "/images/testimonials/founder4.jpg",
      quote: "The database of investors interested in deep tech saved us countless hours of research. We found partners who not only provided capital but also opened doors to key industry partnerships.",
      company_logo: "/images/testimonials/company4.svg",
      raised: "$12M Series A",
      time: "4 months"
    }
  ];

  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div id="testimonials-section" className="py-24 w-full relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-900 pointer-events-none" />
      <div className="absolute top-40 left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-600/5 rounded-full blur-3xl" />
      
      {/* Animated dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-violet-500/10"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              opacity: isVisible ? 0.6 : 0,
              transition: 'opacity 1s ease-out',
              transitionDelay: `${i * 50}ms`
            }}
          />
        ))}
      </div>

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
            Founder Success Stories
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            Hear from founders who transformed their fundraising journey with our platform
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-pink-500 mx-auto mt-8 rounded-full" />
        </div>

        <div 
          className="relative mx-auto max-w-4xl"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
            transitionDelay: '0.3s'
          }}
        >
          <div className="relative bg-zinc-800/30 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500" />
            
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    {/* Placeholder for founder image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 p-1">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-zinc-800 to-zinc-700" />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-white">{testimonials[activeIndex].name}</h3>
                      <p className="text-violet-300">{testimonials[activeIndex].role}</p>
                      
                      <div className="mt-4 px-4 py-2 bg-zinc-800/50 rounded-lg inline-flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-green-400">Raised {testimonials[activeIndex].raised}</span>
                      </div>
                      
                      <div className="mt-2 px-4 py-2 bg-zinc-800/50 rounded-lg inline-flex items-center space-x-2">
                        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-violet-300">In {testimonials[activeIndex].time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="relative">
                    <svg className="text-violet-500/20 w-16 h-16 absolute -top-6 -left-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    
                    <div className="pl-6">
                      <p className="text-lg md:text-xl text-zinc-300 italic leading-relaxed">
                        &ldquo;{testimonials[activeIndex].quote}&rdquo;
                      </p>
                      
                      <div className="mt-8 flex items-center justify-between">
                        <div className="h-12 w-32 bg-zinc-800/70 rounded-md flex items-center justify-center">
                          {/* Company logo placeholder */}
                          <div className="text-sm font-medium text-zinc-400">Company Logo</div>
                        </div>
                        
                        <a 
                          href="#case-study" 
                          className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center"
                        >
                          Read case study
                          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === activeIndex 
                    ? 'bg-violet-500 w-8' 
                    : 'bg-zinc-600 hover:bg-zinc-500'}
                `}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Mobile navigation arrows */}
          <div className="flex justify-between mt-6 md:hidden">
            <button 
              onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          className="text-center mt-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out',
            transitionDelay: '0.6s'
          }}
        >
          <a 
            href="#success-stories" 
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg shadow-lg shadow-violet-700/20 hover:shadow-violet-700/40 transition-all duration-300"
          >
            <span>View all success stories</span>
            <svg 
              className="ml-2 w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          
          <div className="mt-8 text-sm text-zinc-500">
            Join 500+ founders who have successfully raised funding with our platform
          </div>
        </div>
      </div>
    </div>
  );
} 