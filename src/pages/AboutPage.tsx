import React from 'react';
import {
  Compass,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  FlaskConical,
  Target,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../lib/storage';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const settings = StorageService.getSettings();

  return (
    <div id="about-us-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Our Editorial Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-serif-editorial">
          We Test Hardware So You Don&apos;t Waste Money.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {settings.siteName} was founded with a singular, uncompromising goal: to deliver the most honest, scientifically grounded, and practical buying advice on the internet.
        </p>
      </div>

      {/* 3 Core Editorial Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Rigorous Testing Protocol</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We don&apos;t just read spec sheets. We test battery discharge under real workloads, measure decibel attenuation for ANC headphones, and test chair lumbar mechanisms for 100+ hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Zero Sponsored Biases</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We never accept paid reviews or sponsored rankings. If a product fails our build quality or ergonomics evaluation, we say so openly in our cons column.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Clear, Actionable Verdicts</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We provide definitive &ldquo;Who should buy&rdquo; and &ldquo;Who should skip&rdquo; breakdowns so you can decide in under 2 minutes if a product matches your exact workflow.
          </p>
        </div>
      </div>

      {/* Editorial Team Section */}
      <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xs space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Meet The Hardware Reviewers
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif-editorial">
            The Editorial Staff
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Our editors bring decades of collective hardware evaluation experience across audio engineering, ergonomic design, and consumer electronics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Elena Rostova"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover shrink-0"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">Elena Rostova</h4>
              <p className="text-xs font-semibold text-emerald-700">Lead Hardware & Audio Editor</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Former acoustic lab technician with 12+ years evaluating reference headphones, microphones, and studio monitoring hardware.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              alt="Marcus Vance"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover shrink-0"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">Marcus Vance</h4>
              <p className="text-xs font-semibold text-emerald-700">Senior Ergonomics & Peripherals Reviewer</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ergonomics specialist specializing in occupational health, task seating mechanisms, mechanical switches, and wrist posture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl text-center space-y-4">
        <h3 className="text-2xl font-bold font-serif-editorial">Have a Question or Product We Should Test?</h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
          We welcome testing suggestions, reader feedback, and hardware inquiries from our community.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
        >
          Contact Our Editorial Desk
        </button>
      </div>
    </div>
  );
};
