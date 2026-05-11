import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--primary-green)] transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-[3rem] p-12 md:p-20 shadow-xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[var(--primary-green)]/10 rounded-2xl text-[var(--primary-green)]">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)]">Terms of Service</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-[var(--text-main)] font-medium opacity-90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using NutriAI, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are not allowed to use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">2. Use of Service</h2>
              <p>
                NutriAI provides tools to monitor nutrition and provide AI-based recommendations. This service is for informational purposes only and should not be considered professional medical advice. Always consult with a nutritionist or doctor before starting a new diet.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account information and password. You agree to be responsible for all activities that occur under your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">4. User Content</h2>
              <p>
                You own all the data you enter into the application. However, by entering data, you grant us the right to process that data to provide personalized services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">5. Cancellation and Suspension</h2>
              <p>
                We reserve the right to suspend or terminate your access to the service at any time, without prior notice, for behavior that we deem violates these terms or harms other users.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">6. Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. Changes will take effect immediately after being posted on this page. Your continued use of the service after changes means you accept the new terms.
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

export default TermsOfService;
