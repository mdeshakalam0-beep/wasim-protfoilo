import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { Code, Layout, Image, Share2, Brain, CheckCircle } from 'lucide-react'; // Import Lucide icons

interface Service {
  id: string; // Changed to string for UUID
  title: string;
  description: string; // Changed from 'desc' to 'description' to match Supabase schema
  icon_type: string; // Changed from 'iconType' to 'icon_type' to match Supabase schema
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-6 h-6" />;
      case 'design': return <Layout className="w-6 h-6" />;
      case 'graphics': return <Image className="w-6 h-6" />;
      case 'social': return <Share2 className="w-6 h-6" />;
      case 'ai': return <Brain className="w-6 h-6" />;
      default: return <CheckCircle className="w-6 h-6" />;
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
                {getIcon(service.icon_type)}
              </div>
              
              <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
              <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
              
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