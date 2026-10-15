// Which NCRB State/UT each app destination belongs to. Used as a fallback when a city is not one of the
// 19 metropolitan cities for which NCRB publishes city-level tables.
// Names must match the `state` values in server/data/ncrb2022.json.
export const CITY_TO_STATE: Record<string, string> = {
  agra: 'Uttar Pradesh',
  amritsar: 'Punjab',
  bhopal: 'Madhya Pradesh',
  bhubaneswar: 'Odisha',
  chandigarh: 'Chandigarh',
  dehradun: 'Uttarakhand',
  goa: 'Goa',
  panaji: 'Goa',
  guwahati: 'Assam',
  manali: 'Himachal Pradesh',
  shimla: 'Himachal Pradesh',
  mysuru: 'Karnataka',
  mysore: 'Karnataka',
  srinagar: 'Jammu & Kashmir',
  thiruvananthapuram: 'Kerala',
  trivandrum: 'Kerala',
  udaipur: 'Rajasthan',
  varanasi: 'Uttar Pradesh',
  // spelling variants of NCRB metro cities
  bangalore: 'Karnataka',
  bombay: 'Maharashtra',
  calcutta: 'West Bengal'
};

// Alternative spellings of the 19 NCRB metro cities -> NCRB city name used in the data file.
export const METRO_ALIASES: Record<string, string> = {
  bangalore: 'Bengaluru',
  bombay: 'Mumbai',
  calcutta: 'Kolkata',
  'new delhi': 'Delhi',
  cochin: 'Kochi',
  madras: 'Chennai',
  calicut: 'Kozhikode'
};
