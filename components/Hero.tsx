import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';

const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [heroImage, setHeroImage] = useState('');
  
  const words = ["Experiences.", "Interfaces.", "Brands.", "Products."];
  const typingSpeed = isDeleting ? 50 : 100;

  useEffect(() => {
    const fetchHeroImage = async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('image_url')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching hero image:', error);
      } else if (data) {
        setHeroImage(data.image_url);
      } else {
        setHeroImage('');
      }
    };

    fetchHeroImage();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentWord = words[wordIndex];
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, typingSpeed]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      {/* Background Ambient Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full relative z-10">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1 reveal">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 font-bold tracking-wide text-xs uppercase">Available for new projects</span>
          </div>

          <h1 className="text-5xl sm:text-6xl xl:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Designing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {text}
            </span>
            <span className="animate-pulse text-indigo-600">|</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
            I’m <span className="text-slate-900 font-bold">Md. Wasim</span>, a multidisciplinary creative developer turning abstract ideas into premium digital experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={scrollToSection('work')}
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm tracking-wide transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-95 flex items-center justify-center sm:justify-start"
            >
              See My Work
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button 
              onClick={scrollToSection('contact')}
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-sm tracking-wide transition-all hover:border-indigo-600 hover:text-indigo-600 hover:shadow-lg hover:-translate-y-1 active:scale-95 flex items-center justify-center sm:justify-start"
            >
              Contact Me
            </button>
          </div>

          <div className="mt-12 flex items-center space-x-8 text-slate-400 grayscale opacity-60">
             {/* Tech Stack Logos (Simulated) */}
             <div className="text-xs font-bold uppercase tracking-widest opacity-50">Stack</div>
             <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
             <div className="font-bold">React</div>
             <div className="font-bold">Tailwind</div>
             <div className="font-bold">Figma</div>
             <div className="font-bold">AI</div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end reveal delay-200 relative">
          <div className="relative w-full max-w-[500px] aspect-[4/5] animate-float">
             {/* Glass Card Backdrop */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/10 backdrop-blur-md rounded-[3rem] -rotate-6 scale-95 border border-white/50 shadow-2xl shadow-indigo-500/10 z-0"></div>
             
             {/* Main Image Container */}
             <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 border-[6px] border-white/50">
               {heroImage ? (
                 <img 
                   src={heroImage} 
                   alt="Md. Wasim" 
                   className="w-full h-full object-cover scale-105 transition-transform duration-1000 hover:scale-100"
                 />
               ) : (
                 <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                   {/* No image uploaded */}
                 </div>
               )}
               
               {/* Overlay Content - only show if image is present */}
               {heroImage && (
                 <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent">
                   <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Creative Developer</p>
                   <p className="text-white text-2xl font-black">Md. Wasim</p>
                 </div>
               )}
             </div>

             {/* Floating UI Elements */}
             <div className="absolute -top-10 -right-10 z-20 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Projects</p>
                      <p className="text-lg font-black text-slate-900">100% Success</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;