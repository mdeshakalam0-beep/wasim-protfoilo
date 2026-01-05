import React, { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter, Facebook, Youtube, Briefcase, Link } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';

interface SocialLink {
  platform: string;
  url: string;
}

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('platform, url');

      if (error) {
        console.error('Error fetching social links:', error);
      } else {
        const linksMap: Record<string, string> = {};
        data.forEach((link: SocialLink) => {
          linksMap[link.platform] = link.url;
        });
        setSocialLinks(linksMap);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');

    const { error } = await supabase
      .from('inquiries')
      .insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: 'new'
      });

    if (error) {
      console.error('Error submitting inquiry:', error);
      setStatus('ERROR');
      alert('Error submitting inquiry: ' + error.message);
    } else {
      setStatus('SUCCESS');
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'instagram': return <Instagram className="w-5 h-5" />;
        case 'linkedin': return <Linkedin className="w-5 h-5" />;
        case 'twitter': return <Twitter className="w-5 h-5" />;
        case 'facebook': return <Facebook className="w-5 h-5" />;
        case 'youtube': return <Youtube className="w-5 h-5" />;
        case 'fiverr': return <Briefcase className="w-5 h-5" />;
        case 'upwork': return <Briefcase className="w-5 h-5" />;
        case 'other': return <Link className="w-5 h-5" />;
        default: return null;
    }
  };

  return (
    <section id="contact" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden reveal border border-slate-100">
          <div className="grid lg:grid-cols-2">
            
            {/* Sidebar */}
            <div className="bg-slate-900 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-between">
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-16 -mb-16"></div>

              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-6">Let’s start a project together</h3>
                <p className="text-slate-300 leading-relaxed mb-12">
                  Have an idea? I'd love to hear about it. I typically reply within 24 hours.
                </p>

                <div className="space-y-8">
                  <a href="mailto:mdwasimalam372@gmail.com" className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">mdwasimalam372@gmail.com</span>
                  </a>
                  <a href="https://wa.me/918873961545" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">+91 8873961545</span>
                  </a>
                </div>
              </div>

              {/* Dynamic Social Media Links */}
              <div className="relative z-10 mt-12 pt-12 border-t border-white/10">
                 <div className="flex space-x-4">
                    {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="X (Twitter)">
                            {getIcon('twitter')}
                        </a>
                    )}
                    {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="LinkedIn">
                            {getIcon('linkedin')}
                        </a>
                    )}
                    {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="Instagram">
                            {getIcon('instagram')}
                        </a>
                    )}
                    {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="Facebook">
                            {getIcon('facebook')}
                        </a>
                    )}
                    {socialLinks.youtube && (
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="YouTube">
                            {getIcon('youtube')}
                        </a>
                    )}
                    {socialLinks.fiverr && (
                        <a href={socialLinks.fiverr} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="Fiverr">
                            {getIcon('fiverr')}
                        </a>
                    )}
                    {socialLinks.upwork && (
                        <a href={socialLinks.upwork} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="Upwork">
                            {getIcon('upwork')}
                        </a>
                    )}
                    {socialLinks.other && (
                        <a href={socialLinks.other} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white" title="Other Link">
                            {getIcon('other')}
                        </a>
                    )}
                 </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-12 lg:p-16 bg-white flex flex-col justify-center">
              {status === 'SUCCESS' ? (
                 <div className="text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                    <p className="text-slate-500 mt-2 mb-8">Thanks for reaching out. I'll get back to you shortly.</p>
                    <button onClick={() => setStatus('IDLE')} className="text-indigo-600 font-bold hover:underline">Send another</button>
                 </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Message</label>
                    <textarea 
                      name="message" 
                      rows={4} 
                      required 
                      value={formData.message} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 resize-none"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={status === 'SUBMITTING'}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'SUBMITTING' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;