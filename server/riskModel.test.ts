import { describe, expect, it } from 'vitest';
import { evaluateRisk, resolveLocationMetadata, type RiskInputFeatures } from './riskModel.ts';

const baseFeatures: RiskInputFeatures = {
  location: 'Delhi',
  crimeFrequency: 60,
  crimeSeverity: 55,
  weather: 'Clear',
  travelParty: 'solo',
  travellerCount: 1,
  plannedTransport: 'walking',
  recentIncidents: 0
};

const levelFor = (features: RiskInputFeatures) => evaluateRisk(features).riskLevel;

const levelValue = (level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL') =>
  ({ LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 })[level];

describe('rule-based risk model', () => {
  it('scores night travel higher than day travel when other inputs match', () => {
    const day = evaluateRisk({ ...baseFeatures, travelWindow: 'day', time: '14:00' });
    const night = evaluateRisk({ ...baseFeatures, travelWindow: 'night', time: '23:00' });

    expect(night.riskScore).toBeGreaterThan(day.riskScore);
  });

  it('scores storm weather higher than clear weather', () => {
    const clear = evaluateRisk({ ...baseFeatures, weather: 'Clear' });
    const storm = evaluateRisk({ ...baseFeatures, weather: 'Storm' });

    expect(storm.riskScore).toBeGreaterThan(clear.riskScore);
  });

  it('clamps final scores between 8 and 94', () => {
    const minimum = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: -1000,
      crimeSeverity: -1000,
      plannedTransport: 'private_vehicle',
      travelParty: 'group',
      recentIncidents: 0
    });
    const maximum = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 1000,
      crimeSeverity: 1000,
      travelWindow: 'night',
      time: '23:00',
      weather: 'Storm',
      recentIncidents: 100
    });

    expect(minimum.riskScore).toBe(8);
    expect(maximum.riskScore).toBe(94);
  });

  it('uses the supported destination baseline when crime inputs are omitted', () => {
    const inferred = evaluateRisk({
      location: 'Delhi',
      travelParty: 'group',
      plannedTransport: 'private_vehicle',
      recentIncidents: 0
    });
    const explicit = evaluateRisk({
      location: 'Delhi',
      crimeFrequency: 68,
      crimeSeverity: 62,
      travelParty: 'group',
      plannedTransport: 'private_vehicle',
      recentIncidents: 0
    });

    expect(inferred.features).toMatchObject({ crimeFrequency: 68, crimeSeverity: 62 });
    expect(inferred.riskScore).toBe(explicit.riskScore);
  });

  it('assigns the correct risk level at LOW, MODERATE, HIGH, and CRITICAL scores', () => {
    const low = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 100,
      crimeSeverity: 5.714285714285714,
      plannedTransport: 'private_vehicle',
      travelParty: 'group'
    });
    const moderateAt42 = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 100,
      crimeSeverity: 10,
      plannedTransport: 'private_vehicle',
      travelParty: 'group'
    });
    const moderateAt74 = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 100,
      crimeSeverity: 100,
      plannedTransport: 'private_vehicle',
      travelParty: 'group'
    });
    const high = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 100,
      crimeSeverity: 88.57142857142857,
      plannedTransport: 'private_vehicle'
    });
    const criticalAt85 = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 100,
      crimeSeverity: 100,
      time: '05:00',
      travelParty: 'friends',
      travellerCount: 3,
      plannedTransport: 'private_vehicle',
      recentIncidents: 3
    });
    const critical = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 100,
      crimeSeverity: 100,
      travelWindow: 'night',
      time: '23:00',
      plannedTransport: 'private_vehicle',
      travelParty: 'group'
    });

    expect(low.riskScore).toBe(41);
    expect(low.riskLevel).toBe('LOW');
    expect(moderateAt42.riskScore).toBe(42);
    expect(moderateAt42.riskLevel).toBe('MODERATE');
    expect(moderateAt74.riskScore).toBe(74);
    expect(moderateAt74.riskLevel).toBe('MODERATE');
    expect(high.riskScore).toBe(75);
    expect(high.riskLevel).toBe('HIGH');
    expect(criticalAt85.riskScore).toBe(85);
    expect(criticalAt85.riskLevel).toBe('CRITICAL');
    expect(critical.riskScore).toBeGreaterThanOrEqual(85);
    expect(critical.riskLevel).toBe('CRITICAL');
  });

  it('reports day risk no higher than night risk', () => {
    const result = evaluateRisk({
      ...baseFeatures,
      travelWindow: 'night',
      time: '23:00',
      weather: 'Rain'
    });

    expect(levelValue(result.dayNightConsiderations.dayRiskLevel)).toBeLessThanOrEqual(
      levelValue(result.dayNightConsiderations.nightRiskLevel)
    );
  });

  it('returns no metadata for an unsupported destination', () => {
    expect(resolveLocationMetadata('Atlantis')).toBeNull();
    expect(resolveLocationMetadata('notDelhi')).toBeNull();
  });

  it('returns five additive factors whose contributions sum to the unclamped score', () => {
    const result = evaluateRisk({
      ...baseFeatures,
      crimeFrequency: 63.3,
      crimeSeverity: 47.8,
      travelWindow: 'night',
      time: '23:00',
      weather: 'Rain',
      recentIncidents: 2
    });
    const contributionTotal = result.factors.reduce((total, factor) => total + factor.scoreContribution, 0);

    expect(result.factors).toHaveLength(5);
    expect(contributionTotal).toBeCloseTo(result.rawScore, 10);
  });
});
