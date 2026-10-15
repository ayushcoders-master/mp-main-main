import fs from 'fs';
import path from 'path';

export interface ICrimeStat {
  _id: string; // "metro:delhi" | "state:goa"
  kind: 'metro' | 'state';
  name: string;
  year: number;
  source: string;
  ipcRate: number; // IPC cognizable crimes per lakh population
  ipcCases: number;
  murderRate: number;
  kidnappingRate: number;
  robberyRate: number;
  theftRate: number;
  populationLakh: number;
  chargesheetRatePct?: number;
  womenCrimeRate?: number; // metros only, per lakh (NCRB metro table)
  cyberCrimeRate?: number; // metros only, per lakh
  /** 0-100: percentile of the IPC crime rate within its group (19 metros, or 36 States/UTs). */
  frequencyScore: number;
  /** 0-100: weighted percentile of murder (40%), robbery (30%) and kidnapping (30%) rates within its group. */
  severityScore: number;
}

interface RawFile {
  source: string;
  metros: Array<Record<string, number | string>>;
  states: Array<Record<string, number | string>>;
}

export const NCRB_YEAR = 2022;
export const SEVERITY_WEIGHTS = { murder: 0.4, robbery: 0.3, kidnapping: 0.3 } as const;

/** Percentile rank (0-100) of each value within the list; ties share the average rank. */
export function percentileRanks(values: number[]): number[] {
  const n = values.length;
  if (n <= 1) return values.map(() => 50);
  return values.map((v) => {
    const below = values.filter((x) => x < v).length;
    const equal = values.filter((x) => x === v).length;
    return ((below + (equal - 1) / 2) / (n - 1)) * 100;
  });
}

const round1 = (x: number) => Math.round(x * 10) / 10;

function scoreGroup<T extends Record<string, number | string>>(rows: T[]) {
  const freq = percentileRanks(rows.map((r) => Number(r.ipc_rate)));
  const murder = percentileRanks(rows.map((r) => Number(r.murder_rate)));
  const robbery = percentileRanks(rows.map((r) => Number(r.robbery_rate)));
  const kidnap = percentileRanks(rows.map((r) => Number(r.kidnapping_rate)));
  return rows.map((_, i) => ({
    frequencyScore: round1(freq[i]),
    severityScore: round1(
      murder[i] * SEVERITY_WEIGHTS.murder + robbery[i] * SEVERITY_WEIGHTS.robbery + kidnap[i] * SEVERITY_WEIGHTS.kidnapping
    )
  }));
}

export function dataFilePath(): string {
  return path.join(process.cwd(), 'server', 'data', 'ncrb2022.json');
}

/** Reads server/data/ncrb2022.json and returns documents ready to be stored in MongoDB. */
export function loadNcrbStats(): ICrimeStat[] {
  const file = dataFilePath();
  if (!fs.existsSync(file)) {
    throw new Error(`NCRB data file not found at ${file}. Run the server from the project root.`);
  }
  const raw = JSON.parse(fs.readFileSync(file, 'utf-8')) as RawFile;
  const out: ICrimeStat[] = [];

  const metroScores = scoreGroup(raw.metros);
  raw.metros.forEach((m, i) => {
    const name = String(m.city);
    out.push({
      _id: `metro:${name.toLowerCase()}`,
      kind: 'metro',
      name,
      year: NCRB_YEAR,
      source: raw.source,
      ipcRate: Number(m.ipc_rate),
      ipcCases: Number(m.ipc_cases_2022),
      murderRate: Number(m.murder_rate),
      kidnappingRate: Number(m.kidnapping_rate),
      robberyRate: Number(m.robbery_rate),
      theftRate: Number(m.theft_rate),
      populationLakh: Number(m.population_lakh_2011),
      chargesheetRatePct: Number(m.chargesheet_rate_pct),
      womenCrimeRate: Number(m.women_crime_rate),
      cyberCrimeRate: Number(m.cyber_crime_rate),
      ...metroScores[i]
    });
  });

  const stateScores = scoreGroup(raw.states);
  raw.states.forEach((s, i) => {
    const name = String(s.state);
    out.push({
      _id: `state:${name.toLowerCase()}`,
      kind: 'state',
      name,
      year: NCRB_YEAR,
      source: raw.source,
      ipcRate: Number(s.ipc_rate),
      ipcCases: Number(s.ipc_cases_2022),
      murderRate: Number(s.murder_rate),
      kidnappingRate: Number(s.kidnapping_rate),
      robberyRate: Number(s.robbery_rate),
      theftRate: Number(s.theft_rate),
      populationLakh: Number(s.population_lakh_2022),
      ...stateScores[i]
    });
  });

  return out;
}
