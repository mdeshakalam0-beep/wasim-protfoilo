
import React from 'react';

const About: React.FC = () => {
  const skills = [
    "Website Development", "UI/UX Design", "Graphic Design", "Social Media",
    "AI-Assisted Graphics", "SEO Optimization", "React & TypeScript", "Brand Strategy"
  ];

  const stats = [
    { value: "50+", label: "Projects Completed" },
    { value: "5+", label: "Years Experience" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "24/7", label: "Dedicated Support" },
  ];

  return (
    <section id="about" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <div className="reveal">
            <h2 className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4">About Me</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-8 leading-tight">
              Crafting Digital Excellence with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Passion & Precision.</span>
            </h3>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                I am a forward-thinking digital creator who sits at the intersection of design and technology. 
                My mission is to help businesses elevate their online presence through bespoke websites, 
                compelling visuals, and strategic content.
              </p>
              <p>
                Leveraging the latest in AI tools and modern frameworks, I deliver work that is not only 
                visually stunning but also optimized for performance and conversion.
              </p>
            </div>

            <div className="mt-10">
              <h4 className="text-slate-900 font-bold mb-4">Core Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal lg:pl-10">
            <div className="grid grid-cols-2 gap-4">
               {stats.map((stat, idx) => (
                 <div key={idx} className={`p-8 rounded-[2rem] border transition-all hover:-translate-y-2 hover:shadow-xl ${idx === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
                    <div className="text-4xl lg:text-5xl font-black mb-2 tracking-tight">{stat.value}</div>
                    <div className={`text-xs font-bold uppercase tracking-widest ${idx === 0 ? 'text-indigo-200' : 'text-slate-400'}`}>{stat.label}</div>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start space-x-4">
               <div className="text-3xl">🚀</div>
               <div>
                 <h5 className="font-bold text-slate-900 mb-1">Always Learning</h5>
                 <p className="text-sm text-slate-500 leading-relaxed">Constantly updating my skill set with the latest industry trends to keep your business ahead of the curve.</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
