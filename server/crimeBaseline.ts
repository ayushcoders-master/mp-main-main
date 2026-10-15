import { db } from './db.js';
import type { ICrimeStat } from './crimeStats.js';
import { CITY_TO_STATE, METRO_ALIASES } from '../shared/cityStateMap.ts';

export interface CrimeBaseline {
  /** 'metro' = NCRB city table, 'state' = state-level proxy, 'none' = no NCRB data for this destination */
  scope: 'metro' | 'state' | 'none';
  /** 0-100 inputs for the risk model */
  frequency: number;
  severity: number;
  stat: ICrimeStat | null;
  label: string;
  message: string;
}

const NEUTRAL = 50;

/** Finds the NCRB baseline for a free-text destination such as "Delhi", "New Delhi, India" or "Manali". */
export async function getCrimeBaseline(destination: string): Promise<CrimeBaseline> {
  const norm = destination.toLowerCase().replace(/,?\s*india\s*$/, '').trim();

  const candidates = [norm, ...norm.split(/[,\-–/]/).map((p) => p.trim()).filter(Boolean)];
  const all = await db.getAllCrimeStats();
  const metros = all.filter((s) => s.kind === 'metro');
  const states = all.filter((s) => s.kind === 'state');

  for (const c of candidates) {
    const metroName = (METRO_ALIASES[c] || c).toLowerCase();
    const metro = metros.find((m) => m.name.toLowerCase() === metroName);
    if (metro) {
      return {
        scope: 'metro',
        frequency: metro.frequencyScore,
        severity: metro.severityScore,
        stat: metro,
        label: `${metro.name} (NCRB ${metro.year} metropolitan city data)`,
        message:
          `Baseline from NCRB Crime in India ${metro.year}: ${metro.name} recorded ${metro.ipcRate} IPC crimes per lakh ` +
          `population. Scores are relative to the 19 NCRB metropolitan cities. NCRB cautions that cities should not be ` +
          `compared purely on crime figures (reporting practices differ). This is an advisory estimate, not a safety guarantee.`
      };
    }
  }

  for (const c of candidates) {
    const stateName = (CITY_TO_STATE[c] || c).toLowerCase();
    const state = states.find((s) => s.name.toLowerCase() === stateName || s.name.toLowerCase().replace(' (ut)', '') === stateName);
    if (state) {
      return {
        scope: 'state',
        frequency: state.frequencyScore,
        severity: state.severityScore,
        stat: state,
        label: `${state.name} (NCRB ${state.year} state-level data)`,
        message:
          `NCRB publishes no city-level table for this destination, so the baseline uses statewide figures for ` +
          `${state.name} (${state.ipcRate} IPC crimes per lakh population, NCRB ${state.year}). The destination itself may be ` +
          `safer or riskier than the state average. NCRB also notes that reporting practices differ between states (for example online FIR registration), so states are not strictly comparable. Treat this as a rough, lower-confidence estimate.`
      };
    }
  }

  return {
    scope: 'none',
    frequency: NEUTRAL,
    severity: NEUTRAL,
    stat: null,
    label: 'No NCRB data for this destination',
    message:
      'No NCRB crime statistics are available for this destination, so a neutral baseline was used and the score mainly ' +
      'reflects your travel details (time, transport, weather, group). Treat this as a low-confidence estimate.'
  };
}
