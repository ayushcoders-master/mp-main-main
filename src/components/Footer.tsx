import React from 'react';
import { Shield, Heart, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-100">
                AI-Powered Tourist Safety Risk Prediction System
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              “Predicting travel risk before you arrive.” Developed as a Computer Science final year mini project integrating machine learning, spatial safety analytics, emergency services routing, and explainable AI.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400/90 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Python ML Microservice (XGBoost Ensemble) Online</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Platform Sections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Tourist Dashboard
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-cyan-400 transition-colors">
                  Interactive Safety Map
                </Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-cyan-400 transition-colors">
                  Safer Route Recommendation
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-cyan-400 transition-colors">
                  Emergency Services Directory
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-cyan-400 transition-colors">
                  AI Safety Recommendations
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-cyan-400 transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Project Info & Disclaimer */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Emergency Advisory
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Notice</span>
              </div>
              <p className="text-slate-400 leading-normal">
                This platform is a proactive safety planning and risk prediction tool, <strong>not a live 911/112 emergency dispatch system</strong>. In immediate danger, call local emergency police.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} AI-Powered Tourist Safety Risk Prediction System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hover:text-slate-300">
              Admin Access
            </Link>
            <span>•</span>
            <span className="text-slate-500">CS Mini Project Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
