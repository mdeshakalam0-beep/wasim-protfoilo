import React, { useEffect, useState } from 'react';
import { Instagram, Linkedin, Twitter, Facebook, Youtube, Briefcase, Link } from 'lucide-react'; // Import new icons

interface FooterProps {
  onAdminClick: () => void; // अब यह एक फ़ंक्शन है जो लॉगिन modal को दिखाता है
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    youtube: '', // New
    fiverr: '',  // New
    upwork: '',  // New
    other: ''    // New
  });

  useEffect(() => {
    const loadSocials = () => {
      const saved = localStorage.getItem('portfolio_social_links');
      if (saved) setSocialLinks(JSON.parse(saved));
    };
    loadSocials();
    window.addEventListener('storage', loadSocials);
    return () => window.removeEventListener('storage', loadSocials);
  }, []);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'instagram': return <Instagram className="w-4 h-4" />;
          case 'linkedin': return <Linkedin className="w-4 h-4" />;
          case 'twitter': return <Twitter className="w-4 h-4" />;
          case 'facebook': return <Facebook className="w-4 h-4" />;
          case 'youtube': return <Youtube className="w-4 h-4" />; // New icon
          case 'fiverr': return <Briefcase className="w-4 h-4" />; // Using Briefcase for freelancer platforms
          case 'upwork': return <Briefcase className="w-4 h-4" />; // Using Briefcase for freelancer platforms
          case 'other': return <Link className="w-4 h-4" />; // Generic link icon
          default: return null;
      }
  };

  return (
    <footer className="bg-slate-900 text-white py-24 relative overflow-hidden">
      {/* Abstract Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-slate-800 pb-16">
          
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-6 tracking-tight">MD. WASIM</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-8">
              A creative partner dedicated to building digital products that blend exceptional design with robust technology.
            </p>
            <div className="flex space-x-4">
               {/* Dynamic Socials */}
               {socialLinks.twitter && (
                 <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('twitter')}
                 </a>
               )}
               {socialLinks.linkedin && (
                 <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('linkedin')}
                 </a>
               )}
               {socialLinks.instagram && (
                 <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('instagram')}
                 </a>
               )}
               {socialLinks.facebook && (
                 <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('facebook')}
                 </a>
               )}
               {socialLinks.youtube && (
                 <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('youtube')}
                 </a>
               )}
               {socialLinks.fiverr && (
                 <a href={socialLinks.fiverr} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('fiverr')}
                 </a>
               )}
               {socialLinks.upwork && (
                 <a href={socialLinks.upwork} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('upwork')}
                 </a>
               )}
               {socialLinks.other && (
                 <a href={socialLinks.other} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
                   {getIcon('other')}
                 </a>
               )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Sitemap</h4>
            <ul className="space-y-4">
              <li><button onClick={() => scrollToSection('home')} className="text-slate-400 hover:text-indigo-400 transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="text-slate-400 hover:text-indigo-400 transition-colors">About</button></li>
              <li><button onClick={() => scrollToSection('services')} className="text-slate-400 hover:text-indigo-400 transition-colors">Services</button></li>
              <li><button onClick={() => scrollToSection('work')} className="text-slate-400 hover:text-indigo-400 transition-colors">Work</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="mailto:mdwasimalam372@gmail.com" className="hover:text-indigo-400 transition-colors">mdwasimalam372@gmail.com</a></li>
              <li><a href="https://wa.me/918873961545" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">+91 8873961545</a></li>
              <li className="text-xs uppercase tracking-widest pt-4 opacity-50">Available Mon-Sat</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
           <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Md. Wasim. All rights reserved.</p>
           <button 
              onClick={onAdminClick}
              className="mt-4 md:mt-0 text-xs font-bold text-slate-700 bg-slate-800 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
           >
              Admin Access
           </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;