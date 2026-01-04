import React, { useState, useEffect } from 'react'; // useState added
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
// SessionContextProvider और useSession अब आवश्यक नहीं हैं

const App: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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

    const observeElements = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    };

    observeElements();

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
  }, [isAdminLoggedIn]); // Re-run effect if admin login status changes

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  if (isAdminLoggedIn) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
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
      <Footer onAdminClick={() => setShowAdminLogin(true)} />
      
      {showAdminLogin && (
        <AdminLogin 
          onLoginSuccess={handleAdminLoginSuccess} 
          onClose={() => setShowAdminLogin(false)} 
        />
      )}
    </div>
  );
};

export default App;