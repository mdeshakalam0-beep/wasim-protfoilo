
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'work', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Work', id: 'work' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-[100] transition-all duration-500 border-b ${
          isScrolled || isMenuOpen 
            ? 'bg-white/80 backdrop-blur-md border-white/20 py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button onClick={scrollToSection('home')} className="text-left cursor-pointer relative z-[110] outline-none group">
            <span className="text-2xl font-black tracking-tighter text-slate-900 block leading-none">
              MD<span className="text-indigo-600">.</span>WASIM
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={scrollToSection(link.id)}
                className={`text-sm font-bold transition-all hover:text-indigo-600 cursor-pointer relative group tracking-wide ${
                  activeSection === link.id ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-indigo-600 transition-all duration-300 ${activeSection === link.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
              </button>
            ))}
            <button 
              onClick={scrollToSection('contact')}
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              Hire Me
            </button>
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-[110] w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-900 focus:outline-none transition-all active:scale-90 hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Toggle Menu"
          >
            <div className="flex flex-col items-end space-y-1.5 w-5">
              <span className={`block h-0.5 bg-current transition-all duration-300 rounded-full ${isMenuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 rounded-full ${isMenuOpen ? 'opacity-0' : 'w-3'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 rounded-full ${isMenuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-2'}`}></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ${isMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
        <div 
            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setIsMenuOpen(false)}
        />
        
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col overflow-hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full p-8 pt-32 relative z-10">
                <div className="flex flex-col space-y-8 flex-grow">
                    {navLinks.map((link, index) => (
                        <button
                            key={link.name}
                            onClick={scrollToSection(link.id)}
                            className={`flex items-center space-x-4 text-4xl font-black text-left transition-all transform duration-500 ${
                                isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                            } ${activeSection === link.id ? 'text-indigo-600' : 'text-slate-900'}`}
                            style={{ transitionDelay: `${index * 80}ms` }}
                        >
                            <span className="text-sm font-bold text-slate-300 font-mono">0{index + 1}</span>
                            <span>{link.name}</span>
                        </button>
                    ))}
                </div>

                <div className={`pt-8 border-t border-slate-100 transition-all duration-700 delay-300 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <button 
                        onClick={scrollToSection('contact')}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-600 active:scale-95 transition-all mb-8"
                    >
                        Start a Project
                    </button>
                    
                    <div className="flex flex-col space-y-2 text-sm font-medium text-slate-500">
                        <a href="mailto:mdwasimalam372@gmail.com" className="hover:text-indigo-600 transition-colors">mdwasimalam372@gmail.com</a>
                        <a href="https://wa.me/918873961545" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">+91 8873961545</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Header;
