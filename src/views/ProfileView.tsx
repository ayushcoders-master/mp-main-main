import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { TouristCategory } from '../types.ts';
import {
  User,
  Mail,
  Compass,
  Shield,
  Phone,
  Save,
  CheckCircle2,
  Lock,
  HeartHandshake
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [category, setCategory] = useState<TouristCategory>(
    user?.touristCategory || 'Solo Traveler'
  );
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 392-1084');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories: TouristCategory[] = [
    'Solo Traveler',
    'Family',
    'Couple',
    'Senior Citizen',
    'Student',
    'Business Traveler'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, touristCategory: category });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <User className="w-5 h-5" />
          </div>
          <span>Traveler Profile & Safety Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your default traveler category and emergency contact parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Profile preferences successfully updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Profile Avatar Card */}
        <div className="md:col-span-4 bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400">{user?.email || 'alex.tourist@example.com'}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {category}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-700/60 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Account Role:</span>
              <strong className="text-slate-200 uppercase font-mono">{user?.role || 'User'}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Safety Status:</span>
              <strong className="text-emerald-400">Active Monitoring</strong>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-8 bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'alex.tourist@example.com'}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default Tourist Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TouristCategory)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Risk models and advisory generation will automatically adjust for this demographic profile.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Designated Emergency Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Used in the emergency SOS quick share location broadcast.
              </p>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Preferences</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
