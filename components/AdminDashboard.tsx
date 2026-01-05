import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Code, Layout, Image, Share2, Brain, CheckCircle, Instagram, Linkedin, Twitter, Facebook, Youtube, Briefcase, Link, Grid, Settings, FolderOpen, Tag } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string; // Changed to match Supabase schema
  status: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon_type: string;
  created_at: string;
}

interface ProjectCategory {
  id: string;
  name: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'services' | 'categories'>('dashboard');
  
  // Data States
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [heroImage, setHeroImage] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    youtube: '',
    fiverr: '',
    upwork: '',
    other: ''
  });
  
  // UI States
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', category: '', image_url: '' });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingProject, setUploadingProject] = useState(false);

  // Category Management States
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null);

  // Fetch Functions
  const fetchInquiries = useCallback(async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching inquiries:', error);
    else setInquiries(data);
  }, []);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data);
  }, []);

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error('Error fetching services:', error);
    else setServices(data);
  }, []);

  const fetchProjectCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) console.error('Error fetching project categories:', error);
    else {
      setProjectCategories(data);
      if (data.length > 0 && !newProject.category) {
        setNewProject(prev => ({ ...prev, category: data[0].name }));
      }
    }
  }, [newProject.category]);

  const fetchHeroImage = useCallback(async () => {
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
  }, []);

  const fetchSocialLinks = useCallback(async () => {
    const { data, error } = await supabase
      .from('social_links')
      .select('platform, url');
    if (error) {
      console.error('Error fetching social links:', error);
    } else {
      const linksMap: Record<string, string> = {};
      data.forEach((link) => {
        linksMap[link.platform] = link.url;
      });
      setSocialLinks({
        instagram: linksMap.instagram || '',
        linkedin: linksMap.linkedin || '',
        twitter: linksMap.twitter || '',
        facebook: linksMap.facebook || '',
        youtube: linksMap.youtube || '',
        fiverr: linksMap.fiverr || '',
        upwork: linksMap.upwork || '',
        other: linksMap.other || ''
      });
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
    fetchProjects();
    fetchServices();
    fetchProjectCategories();
    fetchHeroImage();
    fetchSocialLinks();
  }, [fetchInquiries, fetchProjects, fetchServices, fetchProjectCategories, fetchHeroImage, fetchSocialLinks]);

  // Helper to upload image to Supabase Storage
  const uploadImageToSupabase = async (file: File, folder: string) => {
    setUploadingHero(true); // Use this for both hero and project for now, can refine later
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    setUploadingHero(false);
    if (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
      return null;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  // Helper to delete image from Supabase Storage
  const deleteImageFromSupabase = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes('supabase.co')) return;

    const pathSegments = imageUrl.split('/');
    const fileNameWithFolder = pathSegments.slice(pathSegments.indexOf('portfolio-images') + 1).join('/');

    const { error } = await supabase.storage
      .from('portfolio-images')
      .remove([fileNameWithFolder]);

    if (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Handlers
  const deleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inquiry:', error);
      alert('Error deleting inquiry: ' + error.message);
    } else {
      fetchInquiries();
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProject(true);
    const imageUrl = await uploadImageToSupabase(file, 'projects');
    if (imageUrl) {
      setNewProject(prev => ({ ...prev, image_url: imageUrl }));
    }
    setUploadingProject(false);
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.image_url) {
      alert("Please upload an image for the project.");
      return;
    }
    if (!newProject.category) {
      alert("Please select a category for the project.");
      return;
    }
    const { error } = await supabase
      .from('projects')
      .insert({
        title: newProject.title,
        category: newProject.category,
        image_url: newProject.image_url
      });

    if (error) {
      console.error('Error adding project:', error);
      alert('Error adding project: ' + error.message);
    } else {
      fetchProjects();
      setNewProject({ title: '', category: projectCategories[0]?.name || '', image_url: '' });
      setShowProjectForm(false);
    }
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      const projectToDelete = projects.find(p => p.id === id);
      if (projectToDelete) {
        await deleteImageFromSupabase(projectToDelete.image_url);
      }
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project: ' + error.message);
      } else {
        fetchProjects();
      }
    }
  };

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const { error } = await supabase
      .from('services')
      .update({
        title: editingService.title,
        description: editingService.description,
        icon_type: editingService.icon_type
      })
      .eq('id', editingService.id);

    if (error) {
      console.error('Error updating service:', error);
      alert('Error updating service: ' + error.message);
    } else {
      fetchServices();
      setEditingService(null);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImageToSupabase(file, 'hero');
    if (imageUrl) {
      setHeroImage(imageUrl);
    }
  };

  const saveHeroImage = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        // Check if an image already exists
        const { data: existingImage, error: fetchError } = await supabase
          .from('hero_images')
          .select('id, image_url')
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw fetchError;
        }

        if (existingImage) {
          // Update existing image
          const { error } = await supabase
            .from('hero_images')
            .update({ image_url: heroImage })
            .eq('id', existingImage.id);
          if (error) throw error;
          // Delete old image from storage if it's different
          if (existingImage.image_url && existingImage.image_url !== heroImage) {
            await deleteImageFromSupabase(existingImage.image_url);
          }
        } else {
          // Insert new image
          const { error } = await supabase
            .from('hero_images')
            .insert({ image_url: heroImage });
          if (error) throw error;
        }
        alert("Hero Image Updated Successfully!");
        fetchHeroImage(); // Re-fetch to ensure UI is consistent
      } catch (error: any) {
        console.error("Error saving hero image:", error);
        alert("Error saving hero image: " + error.message);
      }
  };

  const clearHeroImage = async () => {
    if (!window.confirm("Are you sure you want to remove the hero image?")) return;
    try {
      const { data: existingImage, error: fetchError } = await supabase
        .from('hero_images')
        .select('id, image_url')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingImage) {
        await deleteImageFromSupabase(existingImage.image_url);
        const { error } = await supabase
          .from('hero_images')
          .delete()
          .eq('id', existingImage.id);
        if (error) throw error;
      }
      setHeroImage('');
      alert("Hero Image Removed Successfully!");
      fetchHeroImage();
    } catch (error: any) {
      console.error("Error clearing hero image:", error);
      alert("Error clearing hero image: " + error.message);
    }
  };

  const saveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Delete all existing social links
      const { error: deleteError } = await supabase
        .from('social_links')
        .delete()
        .neq('platform', 'non_existent_platform'); // Delete all rows

      if (deleteError) throw deleteError;

      // Insert new social links
      const linksToInsert = Object.entries(socialLinks)
        .filter(([, url]) => url.trim() !== '')
        .map(([platform, url]) => ({ platform, url }));

      if (linksToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('social_links')
          .insert(linksToInsert);
        if (insertError) throw insertError;
      }
      alert("Social Links Updated!");
      fetchSocialLinks(); // Re-fetch to ensure UI is consistent
    } catch (error: any) {
      console.error("Error saving social links:", error);
      alert("Error saving social links: " + error.message);
    }
  };

  // Category Management Handlers
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    const { error } = await supabase
      .from('project_categories')
      .insert({ name: newCategoryName.trim() });

    if (error) {
      console.error('Error adding category:', error);
      alert('Error adding category: ' + error.message);
    } else {
      setNewCategoryName('');
      fetchProjectCategories();
    }
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    const { error } = await supabase
      .from('project_categories')
      .update({ name: editingCategory.name.trim() })
      .eq('id', editingCategory.id);

    if (error) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + error.message);
    } else {
      setEditingCategory(null);
      fetchProjectCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Projects using this category will still display the name, but it won't be selectable for new projects.")) {
      return;
    }
    const { error } = await supabase
      .from('project_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category: ' + error.message);
    } else {
      fetchProjectCategories();
    }
  };

  const NavItem = ({ id, label, icon }: { id: any, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-5 h-5" />;
      case 'design': return <Layout className="w-5 h-5" />;
      case 'graphics': return <Image className="w-5 h-5" />;
      case 'social': return <Share2 className="w-5 h-5" />;
      case 'ai': return <Brain className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col p-6 fixed h-full z-20">
        <div className="mb-10 flex items-center space-x-2 px-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">M</div>
           <span className="font-black text-slate-900 tracking-tight text-lg">ADMIN</span>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <NavItem id="dashboard" label="Dashboard" icon={<Grid className="w-5 h-5" />} />
          <NavItem id="projects" label="Projects" icon={<FolderOpen className="w-5 h-5" />} />
          <NavItem id="services" label="Services" icon={<Settings className="w-5 h-5" />} />
          <NavItem id="categories" label="Categories" icon={<Tag className="w-5 h-5" />} />
        </nav>

        <button onClick={onLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Log Out</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-around z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <Grid className="w-6 h-6" />
           <span className="text-[10px] font-bold mt-1">Dash</span>
        </button>
        <button onClick={() => setActiveTab('projects')} className={`flex flex-col items-center ${activeTab === 'projects' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <FolderOpen className="w-6 h-6" />
           <span className="text-[10px] font-bold mt-1">Work</span>
        </button>
        <button onClick={() => setActiveTab('services')} className={`flex flex-col items-center ${activeTab === 'services' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <Settings className="w-6 h-6" />
           <span className="text-[10px] font-bold mt-1">Services</span>
        </button>
        <button onClick={() => setActiveTab('categories')} className={`flex flex-col items-center ${activeTab === 'categories' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <Tag className="w-6 h-6" />
           <span className="text-[10px] font-bold mt-1">Cats</span>
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
                 <img src={heroImage || "https://ui-avatars.com/api/?name=Md+Wasim"} className="w-full h-full object-cover" />
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
                                    {heroImage ? (
                                        <img src={heroImage} alt="Preview" className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Photo</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleHeroImageUpload}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                        disabled={uploadingHero}
                                    />
                                    {uploadingHero && <p className="text-xs text-indigo-600 mt-1">Uploading...</p>}
                                </div>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-100" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-300">OR use URL</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input 
                                    value={heroImage} 
                                    onChange={e => setHeroImage(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Image URL"
                                />
                                {heroImage && (
                                    <button type="button" onClick={clearHeroImage} className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg">Clear</button>
                                )}
                            </div>
                            
                            <button className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-500/20" disabled={uploadingHero}>Update Image</button>
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
                                        <p className="text-sm text-slate-500">{msg.email} • {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
                         <select 
                            className="p-3 bg-slate-50 rounded-xl border" 
                            value={newProject.category} 
                            onChange={e => setNewProject({...newProject, category: e.target.value})}
                            required
                         >
                            {projectCategories.length === 0 && <option value="">No categories available</option>}
                            {projectCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                         </select>
                         <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleProjectImageUpload}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            disabled={uploadingProject}
                         />
                         {uploadingProject && <p className="text-xs text-indigo-600 mt-1">Uploading project image...</p>}
                         {newProject.image_url && !uploadingProject && (
                            <img src={newProject.image_url} alt="Project Preview" className="w-20 h-20 object-cover rounded-lg" />
                         )}
                         <button className="md:col-span-3 bg-slate-900 text-white py-3 rounded-xl font-bold" disabled={uploadingProject}>Save Project</button>
                    </form>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map(p => (
                        <div key={p.id} className="group relative bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                                {p.image_url ? (
                                    <img src={p.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Image</div>
                                )}
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
                                <p className="text-sm text-slate-400 mt-1">{s.description}</p>
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
                            <textarea className="w-full p-3 bg-slate-50 rounded-xl border" rows={3} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} />
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Icon Type</label>
                            <select 
                                className="w-full p-3 bg-slate-50 rounded-xl border" 
                                value={editingService.icon_type} 
                                onChange={e => setEditingService({...editingService, icon_type: e.target.value})}
                            >
                                <option value="code">Code</option>
                                <option value="design">Design</option>
                                <option value="graphics">Graphics</option>
                                <option value="social">Social Media</option>
                                <option value="ai">AI Integration</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="flex space-x-3">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Save</button>
                                <button type="button" onClick={() => setEditingService(null)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-xl">Manage Project Categories</h3>
                
                {/* Add New Category Form */}
                <form onSubmit={addCategory} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                    <input 
                        placeholder="New Category Name" 
                        required 
                        className="flex-1 p-3 bg-slate-50 rounded-xl border" 
                        value={newCategoryName} 
                        onChange={e => setNewCategoryName(e.target.value)} 
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700">
                        Add Category
                    </button>
                </form>

                {/* Categories List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h4 className="font-bold text-lg">Existing Categories</h4>
                    </div>
                    {projectCategories.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">No categories added yet.</div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {projectCategories.map(cat => (
                                <div key={cat.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center gap-4">
                                    <span className="font-bold text-slate-900">{cat.name}</span>
                                    <div className="flex space-x-2">
                                        <button onClick={() => setEditingCategory(cat)} className="text-indigo-600 font-bold text-xs bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">Edit</button>
                                        <button onClick={() => deleteCategory(cat.id)} className="text-red-500 font-bold text-xs bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Category Modal */}
                {editingCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <form onSubmit={updateCategory} className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-4">
                            <h3 className="text-xl font-bold">Edit Category</h3>
                            <input 
                                className="w-full p-3 bg-slate-50 rounded-xl border" 
                                value={editingCategory.name} 
                                onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} 
                                required
                            />
                            <div className="flex space-x-3">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Save</button>
                                <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Cancel</button>
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