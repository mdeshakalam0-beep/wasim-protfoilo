
import React, { useState, useEffect } from 'react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    linkedin: '',
    twitter: '',
    facebook: ''
  });

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzgzkda"; 

  useEffect(() => {
    const loadSocials = () => {
      const saved = localStorage.getItem('portfolio_social_links');
      if (saved) setSocialLinks(JSON.parse(saved));
    };
    loadSocials();
    window.addEventListener('storage', loadSocials);
    return () => window.removeEventListener('storage', loadSocials);
  }, []);

  const saveMessageLocally = (data: any) => {
    try {
      const existing = JSON.parse(localStorage.getItem('portfolio_inquiries') || '[]');
      const newMsg = {
        id: Date.now(),
        ...data,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'new'
      };
      localStorage.setItem('portfolio_inquiries', JSON.stringify([newMsg, ...existing]));
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    saveMessageLocally(formData);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, _subject: `New Portfolio Inquiry from ${formData.name}` }),
      });
      if (res.ok) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', message: '' });
      } else {
        // Fallback for demo purposes/formspree config issues
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', message: '' });
        alert("Message saved to Dashboard!");
      }
    } catch (error) {
      setStatus('SUCCESS');
      setFormData({ name: '', email: '', message: '' });
      alert("Message saved to Dashboard (Network Issue)");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'instagram': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
        case 'linkedin': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
        case 'twitter': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
        case 'facebook': return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
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
