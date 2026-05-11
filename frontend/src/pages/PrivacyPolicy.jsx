import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-white border border-[var(--border-card)] rounded-[3rem] p-12 md:p-20 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[var(--primary-green)]/10 rounded-2xl text-[var(--primary-green)]">
              <Shield size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Privacy Policy</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-[var(--text-main)] font-medium opacity-90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Introduction</h2>
              <p>
                Welcome to NutriAI. We highly value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information when using our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">2. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, such as when you create an account, enter food data, or contact customer service. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identity Information: Name, email address, and profile photo.</li>
                <li>Physical Data: Height, weight, age, and gender.</li>
                <li>Nutrition Data: Food history, calorie targets, and dietary preferences.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">3. Use of Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain NutriAI services.</li>
                <li>Provide personalized nutritional recommendations through AI.</li>
                <li>Analyze app usage to improve features and user experience.</li>
                <li>Send important notifications related to your account.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">4. Data Security</h2>
              <p>
                The security of your data is our priority. We use industry-standard encryption technology to protect your information from unauthorized access. However, please remember that no method of data transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <span className="text-[var(--primary-green)] font-bold">farelrunin@gmail.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-[var(--text-muted)] text-center">
            Last updated: May 6, 2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
