import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { SessionContextProvider, useSession } from './src/components/SessionContextProvider'; // Corrected import path
import { supabase } from './src/integrations/supabase/client';

const AppContent: React.FC = () => {
  const { session } = useSession();

  useEffect(() => {
    const observerOptions = { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Function to observe all current reveal elements
    const observeElements = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    };

    // Initial observation
    observeElements();

    // Use MutationObserver to watch for dynamically added content (like Work items)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          observeElements();
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [session]); // Re-run effect if session changes

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer onAdminClick={() => { /* AdminLogin will be shown via routing */ }} />
      
      {/* AdminLogin will now be shown if not authenticated */}
      <AdminLogin />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SessionContextProvider>
      <AppContent />
    </SessionContextProvider>
  );
};

export default App;