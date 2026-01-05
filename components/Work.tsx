import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';

interface Project {
  id: string; // Changed to string for UUID
  title: string;
  category: string;
  image_url: string; // Changed to image_url to match Supabase schema
}

const Work: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(4); // Initially show 4 projects

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data);
      }
    };

    fetchProjects();
  }, []);

  const toggleViewAll = () => {
      if (visibleCount >= projects.length) {
          setVisibleCount(4);
          const element = document.getElementById('work');
          if(element) {
              const headerOffset = 80;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
      } else {
          setVisibleCount(projects.length);
      }
  };

  return (
    <section id="work" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal">
          <div>
            <h2 className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4">Portfolio</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900">Selected Work</h3>
          </div>
          
          {projects.length > 4 && (
            <button 
                onClick={toggleViewAll}
                className="hidden md:flex items-center space-x-2 text-slate-900 font-bold hover:text-indigo-600 transition-colors mt-6 md:mt-0 group"
            >
                <span>{visibleCount >= projects.length ? 'Show Less' : 'View All Projects'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${visibleCount >= projects.length ? '' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={visibleCount >= projects.length ? "M5 15l7-7 7 7" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.slice(0, visibleCount).map((project, index) => (
            <div 
              key={project.id} 
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 reveal"
              style={{ transitionDelay: `${(index % 4) * 50}ms` }}
            >
              <div className="aspect-[4/5] bg-slate-100 overflow-hidden">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                    {/* No project image */}
                  </div>
                )}
              </div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Content on Hover */}
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                  {project.category}
                </span>
                <h4 className="text-white font-bold text-xl leading-tight">{project.title}</h4>
              </div>
            </div>
          ))}
        </div>
        
        {projects.length > 4 && (
            <div className="mt-12 text-center md:hidden">
                <button 
                    onClick={toggleViewAll}
                    className="inline-flex items-center space-x-2 text-slate-900 font-bold hover:text-indigo-600 transition-colors"
                >
                <span>{visibleCount >= projects.length ? 'Show Less' : 'View All Projects'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${visibleCount >= projects.length ? '' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={visibleCount >= projects.length ? "M5 15l7-7 7 7" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                </svg>
            </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default Work;