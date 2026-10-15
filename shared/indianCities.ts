export const INDIAN_CITIES = [
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Manali', lat: 32.2432, lng: 77.1892 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
  { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 }
] as const;

export const INDIAN_CITY_NAMES = INDIAN_CITIES.map(({ name }) => name);

export function getIndianCityOrDefault(city: string | null | undefined): string {
  return INDIAN_CITY_NAMES.find((name) => name.toLowerCase() === city?.trim().toLowerCase()) || 'Delhi';
}

export const POPULAR_INDIAN_CITIES = [
  'Delhi',
  'Jaipur',
  'Goa',
  'Mumbai',
  'Manali',
  'Agra',
  'Bengaluru',
  'Varanasi'
];