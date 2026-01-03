
import React, { useState, useEffect } from 'react';

interface Service {
  id: number;
  title: string;
  desc: string;
  iconType: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  const getDefaults = () => [
    { id: 1, title: "Web Development", desc: "High-performance websites tailored to your brand's unique needs.", iconType: "code" },
    { id: 2, title: "UI/UX Design", desc: "Creating intuitive and engaging user experiences that drive conversions.", iconType: "design" },
    { id: 3, title: "Graphic Design", desc: "Premium visual assets including banners, posters, and thumbnails.", iconType: "graphics" },
    { id: 4, title: "Social Media", desc: "Growth-focused management and content strategy for modern brands.", iconType: "social" },
    { id: 5, title: "AI Integration", desc: "Implementing cutting-edge AI tools for automation and content generation.", iconType: "ai" }
  ];

  useEffect(() => {
    const loadServices = () => {
      const saved = localStorage.getItem('portfolio_services');
      setServices(saved ? JSON.parse(saved) : getDefaults());
    };
    loadServices();
    window.addEventListener('storage', loadServices);
    return () => window.removeEventListener('storage', loadServices);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'code': return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
      case 'design': return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
      case 'graphics': return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case 'social': return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'ai': return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      default: return <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
    }
  };

  return (
    <section id="services" className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-100 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20 reveal">
          <h2 className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4">My Expertise</h2>
          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">Services Designed for Growth</h3>
          <p className="text-slate-500 text-lg">Comprehensive digital solutions to help your business scale effectively.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-500 group reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                {getIcon(service.iconType)}
              </div>
              
              <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
              <p className="text-slate-500 leading-relaxed mb-6">{service.desc}</p>
              
              <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-in-out"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
