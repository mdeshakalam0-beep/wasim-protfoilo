import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../src/integrations/supabase/client';

interface AdminLoginProps {
  // onClose और onLoginSuccess अब आवश्यक नहीं हैं क्योंकि Supabase Auth UI रीडायरेक्ट को संभालता है
  // और App.tsx में सत्र स्थिति को अपडेट करता है।
}

const AdminLogin: React.FC<AdminLoginProps> = () => {
  // Supabase Auth UI प्रमाणीकरण प्रक्रिया को संभालता है,
  // इसलिए हमें अब स्थानीय स्थिति या मैन्युअल लॉगिन तर्क की आवश्यकता नहीं है।

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
      <div className="bg-white/10 backdrop-blur-xl w-full max-w-md rounded-[2rem] shadow-2xl p-10 border border-white/20 animate-in fade-in zoom-in duration-300 relative overflow-hidden text-white">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight">System Login</h3>
            <p className="text-slate-400 text-sm mt-1">Authorized personnel only</p>
          </div>
          {/* onClose बटन अब आवश्यक नहीं है क्योंकि यह एक पूर्ण-पृष्ठ लॉगिन है */}
        </div>

        <div className="relative z-10">
          <Auth
            supabaseClient={supabase}
            providers={[]} // केवल ईमेल/पासवर्ड के लिए कोई प्रदाता नहीं
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5', // indigo-600
                    brandAccent: '#6366f1', // indigo-500
                    inputBackground: 'rgba(0,0,0,0.2)',
                    inputBorder: 'rgba(255,255,255,0.1)',
                    inputLabelText: '#94a3b8', // slate-400
                    inputText: '#ffffff',
                    messageBackground: 'rgba(255,255,255,0.1)',
                    messageText: '#ffffff',
                    messageActionText: '#6366f1',
                  },
                },
              },
            }}
            theme="dark" // डार्क थीम का उपयोग करें ताकि यह मौजूदा UI के साथ बेहतर ढंग से फिट हो
            magicLink={true} // मैजिक लिंक प्रमाणीकरण सक्षम करें
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;