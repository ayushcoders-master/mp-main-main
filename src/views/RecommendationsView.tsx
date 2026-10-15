import React, { useState } from 'react';
import { TouristCategory } from '../types.ts';
import {
  Sparkles,
  ShieldCheck,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Luggage,
  Users,
  Compass,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const RecommendationsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TouristCategory>('Solo Traveler');
  const [activeTab, setActiveTab] = useState<'profile' | 'temporal' | 'scams' | 'checklist'>('profile');

  const categoryAdvisories: Record<TouristCategory, { icon: any; title: string; points: string[] }> = {
    'Solo Traveler': {
      icon: Compass,
      title: 'Solo Traveler Protection Protocols',
      points: [
        'Share your live itinerary and GPS tracking with a designated emergency contact at all times.',
        'Avoid dimly lit alleys or poorly populated shortcuts, especially after 20:00.',
        'Never disclose your specific hotel room number loudly in lobbies or public transport.',
        'Carry a secondary dummy wallet with minimal cash and an expired card to hand over if confronted.',
        'Download offline regional maps (e.g. OpenStreetMap) to maintain navigation without cellular coverage.'
      ]
    },
    Family: {
      icon: Users,
      title: 'Family & Child Safety Guidelines',
      points: [
        'Place contact cards or ID wristbands in children’s pockets containing parents’ mobile numbers and hotel name.',
        'Establish an immediate rendezvous point at all crowded landmarks in case someone gets separated.',
        'Stick strictly to monitored pedestrian thoroughfares and avoid congested street bazaars during rush hour.',
        'Confirm medical clinic availability and carry a portable first-aid kit with pediatric medications.',
        'Use registered radio cabs or verified hotel shuttles rather than flagging unmarked roadside vehicles.'
      ]
    },
    Couple: {
      icon: ShieldCheck,
      title: 'Couples & Leisure Travel Advisory',
      points: [
        'Research localized cultural customs and attire norms to avoid unwanted street attention or friction.',
        'Stay aware of surroundings while taking photos or selfies at crowded monuments.',
        'Keep passports and primary credit cards secured in the hotel room safety deposit box.',
        'Arrange licensed airport transfers directly through certified travel booths inside the terminal.'
      ]
    },
    'Senior Citizen': {
      icon: HelpCircle,
      title: 'Senior Citizen Health & Mobility Advisory',
      points: [
        'Verify hospital trauma center proximity (under 15 minutes) when reserving accommodations.',
        'Carry medical prescriptions with generic chemical names in your day bag.',
        'Prioritize daytime transit and avoid unpaved or poorly illuminated pedestrian walkways.',
        'Ensure travel insurance includes comprehensive emergency air evacuation and hospitalization.'
      ]
    },
    Student: {
      icon: Lock,
      title: 'Student & Backpacker Safety Strategies',
      points: [
        'Use TSA-approved cable locks on your backpack zippers in hostels and crowded metro lines.',
        'Do not accept unsealed drinks or food from friendly strangers in nightlife districts.',
        'Store digital copies of student ID, passport, and visa in secure encrypted cloud storage.',
        'Avoid carrying high-value gadgets openly in high-theft transit hubs.'
      ]
    },
    'Business Traveler': {
      icon: Smartphone,
      title: 'Corporate & Executive Safety Standards',
      points: [
        'Always use a trusted VPN on hotel Wi-Fi and public airport networks to prevent digital packet sniffing.',
        'Use privacy screen filters on laptops when working on transit or in open café lounges.',
        'Use pre-booked corporate chauffeur transport for late-night hotel-to-meeting connections.',
        'Ensure devices have remote wipe capabilities enabled in case of device theft.'
      ]
    }
  };

  const currentAdvisory = categoryAdvisories[selectedCategory];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>AI Safety Advisory & Traveler Intelligence</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Specialized risk mitigation protocols tailored for diverse traveler profiles, day/night cycles, and common tourist scams.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'profile'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Traveler Category Profiles
        </button>

        <button
          onClick={() => setActiveTab('temporal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'temporal'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Day vs. Night Safety Matrix
        </button>

        <button
          onClick={() => setActiveTab('scams')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'scams'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Common Tourist Scams & Fraud
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'checklist'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Pre-Departure Checklist
        </button>
      </div>

      {/* Tab 1: Category Profiles */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Category Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(categoryAdvisories) as TouristCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-700/60">
              <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <currentAdvisory.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold block">
                  Category Focused Advisory
                </span>
                <h3 className="text-xl font-bold text-white">{currentAdvisory.title}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAdvisory.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3 text-xs text-slate-200 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Day vs Night Safety */}
      {activeTab === 'temporal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daytime */}
          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/60">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Daytime Protocol (06:00 - 18:00)</h3>
                <span className="text-xs text-emerald-400 font-medium">Optimal Window for Exploration</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span><strong>Crowd Awareness:</strong> Pickpocketing spikes at tourist monuments, ticket queues, and metro interchanges. Keep backpacks worn in front or zipped securely.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span><strong>Hydration & Weather:</strong> In tropical or desert destinations, schedule outdoor monument visits during early morning to avoid heat strokes.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span><strong>Authorized Guides:</strong> Only hire certified state tourism guides wearing registered photo badges at monument gates.</span>
              </li>
            </ul>
          </div>

          {/* Nighttime */}
          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/60">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Nighttime Protocol (18:00 - 05:00)</h3>
                <span className="text-xs text-rose-400 font-medium">Elevated Incident Vulnerability</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong>Transit Confinement:</strong> Do not walk through unfamiliar neighborhoods after dark. Rely on app-dispatched cabs (Uber, Ola, Grab) with registered driver OTPs.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong>Illumination & CCTV:</strong> Stick strictly to main commercial avenues featuring active street illumination and open storefronts.</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/40">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                <span><strong>Alcohol & Social Awareness:</strong> Avoid leaving beverages unattended in pubs. Plan your return transport before heading out for nightlife.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Scams */}
      {activeTab === 'scams' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-base font-bold text-white">The "Closed Attraction" Scam</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Taxi drivers or friendly passersby claim your intended palace or temple is closed for a holiday or festival, steering you to expensive gem or souvenir shops.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 text-xs text-emerald-400">
              <strong>Defense:</strong> Check official website or verify at the physical ticket booth yourself.
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="text-base font-bold text-white">The Broken Taxi Meter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Driver starts the ride claiming the meter is broken, demanding an extortionate flat rate at destination.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 text-xs text-emerald-400">
              <strong>Defense:</strong> Insist on turning on the meter before departing or book exclusively via rideshare apps.
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-base font-bold text-white">Fake Wi-Fi & QR Stealing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rogue Wi-Fi access points named "Free_Airport_WiFi" capturing banking logins and personal credentials.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 text-xs text-emerald-400">
              <strong>Defense:</strong> Use personal mobile roaming eSIM and a VPN for all sensitive data transfers.
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Pre-Departure Tourist Safety Checklist</h3>
          <div className="space-y-3 text-xs">
            {[
              'Register your travel itinerary with your national embassy or consulate abroad.',
              'Save local emergency numbers (Police, Ambulance, Tourist Helpline) in phone speed dial.',
              'Upload photocopy of Passport, Visa, and Insurance policy to secure cloud drive.',
              'Notify your credit card provider of international destination dates to prevent card freezes.',
              'Download offline map of destination city and locate your hotel coordinates.',
              'Verify prescription medications are legal in your destination country.'
            ].map((item, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 cursor-pointer hover:bg-slate-900 text-slate-300 hover:text-white transition-colors"
              >
                <input
                  type="checkbox"
                  defaultChecked={idx < 2}
                  className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
