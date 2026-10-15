// Demo seed data, inserted once into an empty MongoDB database (see connectDB in db.ts).
// This is DEMO data, not verified official records.
import type { ICrimeData, IEmergencyService, IReview } from './db.js';

// Crime baselines now come from real NCRB data (server/data/ncrb2022.json, collection `crime_stats`).
// The `crime_data` collection holds individual incidents entered by admins, so it starts empty.
export const SEED_CRIME_DATA: ICrimeData[] = [];

export const SEED_EMERGENCY_SERVICES: IEmergencyService[] = [
    // Delhi Services
    {
      _id: 'emg_delhi_1',
      name: 'Delhi Police Headquarters & Tourist Assistance Unit',
      type: 'police',
      location: 'Delhi',
      latitude: 28.6328,
      longitude: 77.2197,
      contact: '112 / +91-11-23490010',
      address: 'Connaught Place Police Station, New Delhi',
      emergencyAvailability: '24/7 Rapid Response, English Assistance'
    },
    {
      _id: 'emg_delhi_2',
      name: 'AIIMS Central Emergency Trauma Center',
      type: 'hospital',
      location: 'Delhi',
      latitude: 28.5672,
      longitude: 77.2100,
      contact: '102 / +91-11-26593677',
      address: 'Ansari Nagar, Ring Road, New Delhi',
      emergencyAvailability: 'Level 1 Trauma Center, 24/7 ICU & Pharmacy'
    },
    {
      _id: 'emg_delhi_3',
      name: 'Darya Ganj Police Station',
      type: 'police',
      location: 'Delhi',
      latitude: 28.6471,
      longitude: 77.2408,
      contact: '+91-11-23274683',
      address: 'Netaji Subhash Marg, Daryaganj, Old Delhi',
      emergencyAvailability: '24/7 Tourist Patrol Unit'
    },
    {
      _id: 'emg_delhi_4',
      name: 'Sir Ganga Ram Hospital',
      type: 'hospital',
      location: 'Delhi',
      latitude: 28.6385,
      longitude: 77.1895,
      contact: '+91-11-25750000',
      address: 'Old Rajinder Nagar, New Delhi',
      emergencyAvailability: '24/7 International Patient Care'
    },
    // Jaipur Services
    {
      _id: 'emg_jpr_1',
      name: 'SMS Hospital (Sawai Man Singh Medical College)',
      type: 'hospital',
      location: 'Jaipur',
      latitude: 26.8920,
      longitude: 75.8190,
      contact: '108 / +91-141-2518224',
      address: 'Jawahar Lal Nehru Marg, Ashok Nagar, Jaipur, Rajasthan 302004',
      emergencyAvailability: '24/7 Level-1 Trauma Emergency, Critical Care & Pharmacy'
    },
    {
      _id: 'emg_jpr_2',
      name: 'Fortis Escorts Hospital Jaipur',
      type: 'hospital',
      location: 'Jaipur',
      latitude: 26.8520,
      longitude: 75.8050,
      contact: '+91-141-2547000',
      address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017',
      emergencyAvailability: '24/7 Emergency Cardiac & Multi-specialty Unit'
    },
    {
      _id: 'emg_jpr_3',
      name: 'Jaipur Tourist Police Station',
      type: 'police',
      location: 'Jaipur',
      latitude: 26.9240,
      longitude: 75.8260,
      contact: '112 / +91-141-2601008',
      address: 'Hawa Mahal Complex, Badi Chaupar, Pink City, Jaipur',
      emergencyAvailability: '24/7 Dedicated Foreign & Domestic Tourist Patrol Unit'
    },
    // Goa Services
    {
      _id: 'emg_goa_1',
      name: 'Goa Medical College and Hospital (GMC)',
      type: 'hospital',
      location: 'Goa',
      latitude: 15.4650,
      longitude: 73.8600,
      contact: '108 / +91-832-2458700',
      address: 'NH 66, Bambolim, Goa 403202',
      emergencyAvailability: '24/7 Tertiary Trauma & Emergency Care Unit'
    },
    {
      _id: 'emg_goa_2',
      name: 'Calangute Police Station & Tourist Assistance',
      type: 'police',
      location: 'Goa',
      latitude: 15.5400,
      longitude: 73.7550,
      contact: '112 / +91-832-2278239',
      address: 'Calangute - Baga Road, Naikawaddo, Calangute, Goa 403516',
      emergencyAvailability: '24/7 Beach Belt Police Patrol & Coastal Safety'
    },
    // Mumbai Services
    {
      _id: 'emg_mum_1',
      name: 'KEM Hospital (King Edward Memorial)',
      type: 'hospital',
      location: 'Mumbai',
      latitude: 19.0020,
      longitude: 72.8420,
      contact: '108 / +91-22-24107000',
      address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
      emergencyAvailability: '24/7 Central Emergency, Trauma & ICU Center'
    },
    {
      _id: 'emg_mum_2',
      name: 'Colaba Police Station',
      type: 'police',
      location: 'Mumbai',
      latitude: 18.9180,
      longitude: 72.8290,
      contact: '112 / +91-22-22182222',
      address: 'Shahid Bhagat Singh Road, Colaba, Mumbai, Maharashtra 400005',
      emergencyAvailability: '24/7 Tourist Assistance & Waterfront Patrol'
    },
    // Manali Services
    {
      _id: 'emg_mnl_1',
      name: 'Civil Hospital Manali',
      type: 'hospital',
      location: 'Manali',
      latitude: 32.2410,
      longitude: 77.1870,
      contact: '108 / +91-1902-252328',
      address: 'Mall Road, Siyal, Manali, Himachal Pradesh 175131',
      emergencyAvailability: '24/7 Alpine Emergency & Altitude Sickness First Aid'
    },
    {
      _id: 'emg_mnl_2',
      name: 'Manali Police Station',
      type: 'police',
      location: 'Manali',
      latitude: 32.2440,
      longitude: 77.1890,
      contact: '112 / +91-1902-252326',
      address: 'Model Town, Siyal, Manali, Himachal Pradesh 175131',
      emergencyAvailability: '24/7 Mountain Patrol & Highway Rescue Desk'
    },
    // Agra Services
    {
      _id: 'emg_agr_1',
      name: 'S.N. Medical College & Emergency Hospital',
      type: 'hospital',
      location: 'Agra',
      latitude: 27.1810,
      longitude: 78.0120,
      contact: '108 / +91-562-2260353',
      address: 'Moti Katra, Mantola, Agra, Uttar Pradesh 282003',
      emergencyAvailability: '24/7 Government Trauma Center & Critical Care'
    },
    {
      _id: 'emg_agr_2',
      name: 'Tajganj Police Station (Tourist Unit)',
      type: 'police',
      location: 'Agra',
      latitude: 27.1680,
      longitude: 78.0420,
      contact: '112 / +91-562-2230100',
      address: 'Fatehabad Road, Near Taj East Gate, Agra 282001',
      emergencyAvailability: '24/7 Dedicated Taj Mahal Tourist Safety Unit'
    },
    // Varanasi Services
    {
      _id: 'emg_vns_1',
      name: 'Sir Sunderlal Hospital (IMS-BHU)',
      type: 'hospital',
      location: 'Varanasi',
      latitude: 25.2750,
      longitude: 82.9980,
      contact: '108 / +91-542-2369299',
      address: 'Banaras Hindu University Campus, Varanasi, Uttar Pradesh 221005',
      emergencyAvailability: '24/7 Super Specialty Emergency & Trauma Services'
    },
    {
      _id: 'emg_vns_2',
      name: 'Dashashwamedh Police Station & Ghat Patrol',
      type: 'police',
      location: 'Varanasi',
      latitude: 25.3080,
      longitude: 83.0100,
      contact: '112 / +91-542-2451200',
      address: 'Godowlia Crossing, Dashashwamedh Ghat Road, Varanasi 221001',
      emergencyAvailability: '24/7 Riverfront Ghat Safety & Tourist Assistance'
    }
];

export const SEED_REVIEWS: IReview[] = [
    {
      _id: 'rev_1',
      destination: 'Delhi',
      targetType: 'heritage',
      targetName: 'Red Fort (Lal Qila)',
      authorName: 'Sarah Jenkins',
      rating: 5,
      comment: 'Magnificent Mughal architecture. Make sure to visit early at 9:30 AM before the sun gets harsh. The sound and light show is well worth it.',
      date: '2026-09-18',
      verified: true
    },
    {
      _id: 'rev_2',
      destination: 'Delhi',
      targetType: 'heritage',
      targetName: 'Qutub Minar Complex',
      authorName: 'Rahul Verma',
      rating: 5,
      comment: 'Immaculately maintained ASI heritage grounds with the 1,600-year-old rustless iron pillar. Highly recommended for history buffs.',
      date: '2026-09-02',
      verified: true
    },
    {
      _id: 'rev_3',
      destination: 'Delhi',
      targetType: 'hotel',
      targetName: 'The Imperial New Delhi',
      authorName: 'David Miller',
      rating: 5,
      comment: 'Outstanding colonial luxury with great security and prime location near Connaught Place. Concierge was extremely helpful with metro routes.',
      date: '2026-08-25',
      verified: true
    },
    {
      _id: 'rev_4',
      destination: 'Jaipur',
      targetType: 'heritage',
      targetName: 'Amer Fort & Palace',
      authorName: 'Ananya Sharma',
      rating: 5,
      comment: 'The Sheesh Mahal mirror work is breathtaking. Hire an authorized guide with official ASI badge at the ticket booth to understand the history.',
      date: '2026-09-12',
      verified: true
    },
    {
      _id: 'rev_5',
      destination: 'Jaipur',
      targetType: 'heritage',
      targetName: 'Hawa Mahal',
      authorName: 'Elena Rostova',
      rating: 4,
      comment: 'Iconic street façade. The morning light hitting the pink stone is magnificent for photography from the opposite rooftop cafes.',
      date: '2026-09-05',
      verified: true
    },
    {
      _id: 'rev_6',
      destination: 'Goa',
      targetType: 'heritage',
      targetName: 'Aguada Fort & Lighthouse',
      authorName: 'Vikram Mehta',
      rating: 4,
      comment: 'Superb 17th-century Portuguese fortress overlooking the Arabian Sea. Wear comfortable shoes and visit around 4 PM for sunset views.',
      date: '2026-09-20',
      verified: true
    },
    {
      _id: 'rev_7',
      destination: 'Agra',
      targetType: 'heritage',
      targetName: 'Taj Mahal',
      authorName: 'Charlotte Dubois',
      rating: 5,
      comment: 'Sunrise visit is magical. The white marble changes color as the sun emerges. Very strict security checking so carry only small bags.',
      date: '2026-09-15',
      verified: true
    },
    {
      _id: 'rev_8',
      destination: 'Varanasi',
      targetType: 'heritage',
      targetName: 'Dashashwamedh Ghat & Evening Ganga Aarti',
      authorName: 'Marcus Wong',
      rating: 5,
      comment: 'The evening Aarti at 6:30 PM is an unforgettable spiritual spectacle. Hire a wooden rowboat 30 minutes in advance to see it from the river.',
      date: '2026-09-22',
      verified: true
    }
];
