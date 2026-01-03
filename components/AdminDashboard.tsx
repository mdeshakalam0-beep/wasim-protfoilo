import React, { useState, useEffect } from 'react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  status: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

interface Service {
  id: number;
  title: string;
  desc: string;
  iconType: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'services'>('dashboard');
  
  // Data States
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [heroImage, setHeroImage] = useState('photo1.png');
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
  
  // UI States
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', category: 'Web Design', image: '' });
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    // Load Data
    const savedInquiries = localStorage.getItem('portfolio_inquiries');
    setInquiries(savedInquiries ? JSON.parse(savedInquiries) : []);

    const savedProjects = localStorage.getItem('portfolio_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    else {
      const defaults = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1, title: `Project ${i + 1}`, category: i % 2 === 0 ? "Web Design" : "Graphic Design", image: `work${i + 1}.png`
      }));
      setProjects(defaults);
      localStorage.setItem('portfolio_projects', JSON.stringify(defaults));
    }

    const savedServices = localStorage.getItem('portfolio_services');
    if (savedServices) setServices(JSON.parse(savedServices));
    else {
      const defaults = [
        { id: 1, title: "Website Development", desc: "Fast, responsive websites.", iconType: "code" },
        { id: 2, title: "UI/UX Design", desc: "User-centric designs.", iconType: "design" },
        { id: 3, title: "Graphic Design", desc: "Eye-catching visuals.", iconType: "graphics" },
        { id: 4, title: "Social Media", desc: "Engagement growth.", iconType: "social" },
        { id: 5, title: "AI Prompting", desc: "Hyper-realistic visuals.", iconType: "ai" }
      ];
      setServices(defaults);
      localStorage.setItem('portfolio_services', JSON.stringify(defaults));
    }

    const savedHeroImage = localStorage.getItem('portfolio_hero_image');
    if (savedHeroImage) setHeroImage(savedHeroImage);

    const savedSocials = localStorage.getItem('portfolio_social_links');
    if (savedSocials) {
        setSocialLinks(JSON.parse(savedSocials));
    } else {
        // Initialize with empty strings if not found
        setSocialLinks({
            instagram: '',
            linkedin: '',
            twitter: '',
            facebook: '',
            youtube: '',
            fiverr: '',
            upwork: '',
            other: ''
        });
    }
  }, []);

  // Handlers
  const deleteInquiry = (id: number) => {
    const updated = inquiries.filter(item => item.id !== id);
    setInquiries(updated);
    localStorage.setItem('portfolio_inquiries', JSON.stringify(updated));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  };

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project = { ...newProject, id: Date.now() };
    const updated = [project, ...projects];
    setProjects(updated);
    localStorage.setItem('portfolio_projects', JSON.stringify(updated));
    setNewProject({ title: '', category: 'Web Design', image: '' });
    setShowProjectForm(false);
  };

  const deleteProject = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling
    if(window.confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('portfolio_projects', JSON.stringify(updated));
    }
  };

  const saveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = services.map(s => s.id === editingService.id ? editingService : s);
    setServices(updated);
    localStorage.setItem('portfolio_services', JSON.stringify(updated));
    setEditingService(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2500000) { // Limit to ~2.5MB for localStorage safety
          alert("The image is too large (over 2.5MB). Please compress it or choose a smaller image.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setHeroImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveHeroImage = (e: React.FormEvent) => {
      e.preventDefault();
      try {
        localStorage.setItem('portfolio_hero_image', heroImage);
        window.dispatchEvent(new Event('storage'));
        alert("Image Updated Successfully!");
      } catch (error) {
        alert("Storage full! Try a smaller image.");
      }
  };

  const saveSocialLinks = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('portfolio_social_links', JSON.stringify(socialLinks));
    window.dispatchEvent(new Event('storage'));
    alert("Social Links Updated!");
  };

  const NavItem = ({ id, label, icon }: { id: any, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6 fixed h-full z-20">
        <div className="mb-10 flex items-center space-x-2 px-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">M</div>
           <span className="font-black text-slate-900 tracking-tight text-lg">ADMIN</span>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <NavItem id="dashboard" label="Dashboard" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
          <NavItem id="projects" label="Projects" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
          <NavItem id="services" label="Services" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        </nav>

        <button onClick={onLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Log Out</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
           <span className="text-[10px] font-bold mt-1">Dash</span>
        </button>
        <button onClick={() => setActiveTab('projects')} className={`flex flex-col items-center ${activeTab === 'projects' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           <span className="text-[10px] font-bold mt-1">Work</span>
        </button>
        <button onClick={() => setActiveTab('services')} className={`flex flex-col items-center ${activeTab === 'services' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           <span className="text-[10px] font-bold mt-1">Services</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 mb-20 md:mb-0">
        <header className="flex justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h2>
          <div className="flex items-center space-x-4">
             {/* Logout Button (Visible on Mobile) */}
             <button 
                onClick={onLogout} 
                className="md:hidden flex items-center justify-center p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors" 
                aria-label="Log Out"
             >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>

             <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-900">Md. Wasim</p>
                 <p className="text-xs text-slate-400">Administrator</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-md">
                 <img src={heroImage} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=Md+Wasim"} />
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inquiries</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{inquiries.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Projects</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{projects.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-2xl shadow-xl shadow-indigo-500/20 text-white">
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">System Status</p>
                        <div className="flex items-center mt-2 space-x-2">
                           <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                           <p className="text-xl font-bold">Online</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Main Image Update */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-6">Hero Image Config</h3>
                        <form onSubmit={saveHeroImage} className="space-y-6">
                             {/* Preview & File Upload */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                    <img src={heroImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src='https://ui-avatars.com/api/?name=Md+Wasim'}/>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Photo</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-100" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-300">OR enter URL</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input 
                                    value={heroImage.startsWith('data:image') ? 'Image Uploaded (Base64)' : heroImage} 
                                    onChange={e => setHeroImage(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Image Filename or URL"
                                    disabled={heroImage.startsWith('data:image')}
                                />
                                {heroImage.startsWith('data:image') && (
                                    <button type="button" onClick={() => setHeroImage('photo1.png')} className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg">Clear</button>
                                )}
                            </div>
                            
                            <button className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-500/20">Update Image</button>
                        </form>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-6">Social & Freelancer Links</h3>
                        <form onSubmit={saveSocialLinks} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input 
                                    value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Instagram URL"
                                />
                                <input 
                                    value={socialLinks.linkedin} onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="LinkedIn URL"
                                />
                                <input 
                                    value={socialLinks.twitter} onChange={e => setSocialLinks({...socialLinks, twitter: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="X (Twitter) URL"
                                />
                                <input 
                                    value={socialLinks.facebook} onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Facebook URL"
                                />
                                <input 
                                    value={socialLinks.youtube} onChange={e => setSocialLinks({...socialLinks, youtube: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="YouTube URL"
                                />
                                <input 
                                    value={socialLinks.fiverr} onChange={e => setSocialLinks({...socialLinks, fiverr: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Fiverr URL"
                                />
                                <input 
                                    value={socialLinks.upwork} onChange={e => setSocialLinks({...socialLinks, upwork: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Upwork URL"
                                />
                                <input 
                                    value={socialLinks.other} onChange={e => setSocialLinks({...socialLinks, other: e.target.value})}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Other Link (e.g., Behance)"
                                />
                            </div>
                            <button className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-500/20">Save Social Links</button>
                        </form>
                    </div>
                </div>

                {/* Messages List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Recent Inquiries</h3>
                    </div>
                    {inquiries.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">No new messages.</div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {inquiries.map(msg => (
                                <div key={msg.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer" onClick={() => setSelectedInquiry(msg)}>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{msg.name}</h4>
                                        <p className="text-sm text-slate-500">{msg.email} • {msg.date}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={(e) => {e.stopPropagation(); deleteInquiry(msg.id)}} className="text-red-400 hover:text-red-600 text-sm font-bold px-3 py-1 bg-red-50 rounded-lg">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Inquiry Modal */}
                {selectedInquiry && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in">
                            <h3 className="text-2xl font-bold mb-2">{selectedInquiry.name}</h3>
                            <p className="text-slate-400 text-sm mb-6">{selectedInquiry.email}</p>
                            <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-slate-700 italic">
                                "{selectedInquiry.message}"
                            </div>
                            <button onClick={() => setSelectedInquiry(null)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600">Close</button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl">Manage Portfolio</h3>
                    <button onClick={() => setShowProjectForm(!showProjectForm)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
                        {showProjectForm ? 'Close Form' : '+ Add Project'}
                    </button>
                </div>

                {showProjectForm && (
                    <form onSubmit={addProject} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid md:grid-cols-3 gap-4">
                         <input placeholder="Title" required className="p-3 bg-slate-50 rounded-xl border" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                         <select className="p-3 bg-slate-50 rounded-xl border" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}>
                            <option>Web Design</option><option>UI/UX</option><option>Graphic Design</option>
                         </select>
                         <input placeholder="Image Filename" required className="p-3 bg-slate-50 rounded-xl border" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} />
                         <button className="md:col-span-3 bg-slate-900 text-white py-3 rounded-xl font-bold">Save Project</button>
                    </form>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map(p => (
                        <div key={p.id} className="group relative bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                                <img src={p.image} className="w-full h-full object-cover" onError={e => e.currentTarget.src='https://picsum.photos/400/400?blur=2'} />
                            </div>
                            <h4 className="font-bold text-sm truncate">{p.title}</h4>
                            <p className="text-xs text-slate-400">{p.category}</p>
                            <button 
                                onClick={(e) => deleteProject(p.id, e)} 
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 hover:bg-red-600"
                                title="Delete Project"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'services' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map(s => (
                        <div key={s.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors flex justify-between group">
                            <div>
                                <h4 className="font-bold text-slate-900">{s.title}</h4>
                                <p className="text-sm text-slate-400 mt-1">{s.desc}</p>
                            </div>
                            <button onClick={() => setEditingService(s)} className="text-indigo-600 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity h-fit">Edit</button>
                        </div>
                    ))}
                </div>
                
                {editingService && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <form onSubmit={saveService} className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-4">
                            <h3 className="text-xl font-bold">Edit Service</h3>
                            <input className="w-full p-3 bg-slate-50 rounded-xl border" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} />
                            <textarea className="w-full p-3 bg-slate-50 rounded-xl border" rows={3} value={editingService.desc} onChange={e => setEditingService({...editingService, desc: e.target.value})} />
                            <div className="flex space-x-3">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Save</button>
                                <button type="button" onClick={() => setEditingService(null)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;