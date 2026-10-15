export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface TravelExpense {
  label: string;
  value: string;
  note: string;
}

export interface FoodPlace {
  dish: string;
  price: string;
  note: string;
  image?: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  constructionPeriod: string;
  location: string;
  historicalSignificance: string;
  culturalImportance: string;
  historySnippet: string;
  fullHistory: string;
  visitingInfo: {
    timings: string;
    entryFee: string;
    bestTimeToVisit: string;
  };
  image?: string;
}

export interface TransportOption {
  type: string;
  name: string;
  terminalAddress: string;
  fareRange: string;
  pickupInfo: string;
  directionsUrl: string;
  bookingLinks: {
    uber?: string;
    ola?: string;
    rapido?: string;
    official?: string;
  };
  contact?: string;
}

export interface HotelOption {
  name: string;
  address: string;
  priceRange: string;
  price?: string;
  rating: string;
  reviewCount: string;
  distance: string;
  amenities: string[];
  perks?: string[];
  bookingUrl: string;
  image: string;
}

export interface SeasonalRecommendation {
  season: 'Winter' | 'Summer' | 'Monsoon' | 'Spring / Autumn';
  months: string;
  climate: string;
  whyVisit: string;
  precautions: string;
  suitableFor: string;
}

export interface DestinationHospital {
  name: string;
  address: string;
  distanceKm: number;
  phone: string;
  emergencyInfo: string;
  mapsUrl: string;
}

export interface VisitingPlace {
  name: string;
  time: string;
  bestSlot: string;
  image?: string;
  note: string;
}

// Backward compatibility alias
export type HotelStay = HotelOption;
export type VehicleOption = {
  type: string;
  fare: string;
  note: string;
};

export interface DestinationProfile {
  id: string;
  name: string;
  city: string;
  state: string;
  tagline: string;
  category: string;
  image: string;
  oldGlimpse: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskHotspot: string;
  visitWindow: string;
  visitTime: string;
  totalExpense: string;
  expenses: TravelExpense[];
  vehicleOptions: VehicleOption[];
  transportOptions: TransportOption[];
  food: FoodPlace[];
  hotels: HotelOption[];
  places: VisitingPlace[];
  heritageSites: HeritageSite[];
  seasonalGuide: SeasonalRecommendation[];
  hospitals: DestinationHospital[];
  glimpses: string[];
  highlights: string[];
}

export const DESTINATION_PROFILES: DestinationProfile[] = [
  {
    id: 'connaught-place',
    name: 'Connaught Place & New Delhi',
    city: 'Delhi',
    state: 'Delhi NCR',
    tagline: 'Heart of modern Delhi featuring British-era colonnades, royal tombs, and tree-lined avenues',
    category: 'Colonial architecture, urban dining, and historic monuments',
    image: 'https://images.unsplash.com/photo-1587474260584-9dc6d0d0d87b?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'MODERATE',
    riskScore: 58,
    riskHotspot: 'Janpath pedestrian crossings, outer radial road parking alleys, and Rajiv Chowk transit exits post 10:30 PM.',
    visitWindow: 'Evening (5:00 PM - 10:00 PM)',
    visitTime: 'Half-day to full-day',
    totalExpense: '₹3,500 - ₹5,800 / day',
    expenses: [
      { label: 'Hotel Stay', value: '₹2,600', note: 'Central mid-tier hotel or heritage guesthouse' },
      { label: 'Meals & Dining', value: '₹950', note: 'Iconic restaurants and street specialties' },
      { label: 'City Transport', value: '₹450', note: 'Delhi Metro Smart Card + short autorickshaw rides' },
      { label: 'Heritage Admissions', value: '₹700', note: 'ASI monument passes and museum tickets' }
    ],
    vehicleOptions: [
      { type: 'Delhi Metro', fare: '₹20 - ₹60', note: 'Yellow & Blue Lines intersect directly below Rajiv Chowk station.' },
      { type: 'App-based Cab', fare: '₹200 - ₹450', note: 'Uber & Ola operate 24/7 with pickup booths on outer circles.' },
      { type: 'Prepaid Auto', fare: '₹80 - ₹180', note: 'Available at all metro gate exits with digital fare meters.' }
    ],
    transportOptions: [
      {
        type: 'Metro Rail',
        name: 'Rajiv Chowk Metro Station (Gate 1 - 8)',
        terminalAddress: 'Block B, Connaught Place, New Delhi, Delhi 110001',
        fareRange: '₹20 - ₹60',
        pickupInfo: 'Major transit interchange connecting Gurugram, Noida, and Old Delhi. High security and baggage scanning.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Rajiv+Chowk+Metro+Station+New+Delhi',
        bookingLinks: {
          official: 'https://www.delhimetrorail.com/'
        },
        contact: '011-155370 (DMRC Helpline)'
      },
      {
        type: 'Cab / Ride Hailing',
        name: 'Connaught Place Outer Circle Cab Hub',
        terminalAddress: 'Radial Road 1 to 7, Connaught Circus, New Delhi 110001',
        fareRange: '₹150 - ₹500',
        pickupInfo: 'Verified pickup stands located near Palika Bazar and Regal Building.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Connaught+Place+New+Delhi',
        bookingLinks: {
          uber: 'https://m.uber.com/',
          ola: 'https://book.olacabs.com/',
          rapido: 'https://www.rapido.bike/'
        }
      },
      {
        type: 'Inter-State Bus',
        name: 'Kashmere Gate ISBT (Maharana Pratap Terminal)',
        terminalAddress: 'Inter State Bus Terminal, Kashmere Gate, Delhi 110006',
        fareRange: '₹150 - ₹900',
        pickupInfo: 'Major terminal for air-conditioned buses to Himachal Pradesh, Uttarakhand, and Punjab.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Kashmere+Gate+ISBT+Delhi',
        bookingLinks: {
          official: 'https://dtc.delhi.gov.in/'
        },
        contact: '011-23860290'
      }
    ],
    food: [
      { dish: 'Chole Bhature', price: '₹180', note: 'Crisp puffed bhaturas served with spiced chickpeas at Bengali Market.' },
      { dish: 'North Indian Royal Thali', price: '₹380', note: 'Dal makhani, paneer butter masala, tandoori rotis, and gulab jamun.' },
      { dish: 'Butter Chicken & Naan', price: '₹420', note: 'Authentic rich tomato-butter gravy perfected at Pandara Road.' }
    ],
    hotels: [
      {
        name: 'The Imperial New Delhi',
        address: 'Janpath Lane, Connaught Place, New Delhi, Delhi 110001',
        priceRange: '₹8,500 - ₹14,000 / night',
        rating: '4.8',
        reviewCount: '3,420 reviews',
        distance: '0.8 km from center',
        amenities: ['Heritage Architecture', '24/7 Security', 'Swimming Pool', 'Airport Pickup', 'Multi-cuisine Dining'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Imperial+New+Delhi',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'The Lalit New Delhi',
        address: 'Barakhamba Avenue, Connaught Place, New Delhi 110001',
        priceRange: '₹5,800 - ₹9,500 / night',
        rating: '4.6',
        reviewCount: '4,110 reviews',
        distance: '0.5 km from Rajiv Chowk',
        amenities: ['Business Center', 'Free Wi-Fi', 'Spa & Wellness', 'Valet Parking', 'Soundproof Rooms'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Lalit+New+Delhi',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Hotel Janpath (Ashok Group)',
        address: 'Janpath Road, Near Windsor Place, New Delhi 110001',
        priceRange: '₹3,200 - ₹4,800 / night',
        rating: '4.3',
        reviewCount: '1,890 reviews',
        distance: '1.2 km from Connaught Place',
        amenities: ['Free Breakfast', '24/7 Desk', 'CCTV Security', 'Family Suites', 'In-house Cafe'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+Janpath+Delhi',
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Bloomrooms @ Janpath',
        address: '1 Janpath Lane, Next to Le Meridien, New Delhi 110001',
        priceRange: '₹3,400 - ₹5,200 / night',
        rating: '4.5',
        reviewCount: '2,650 reviews',
        distance: '1.0 km from Connaught Place',
        amenities: ['Modern Minimalist Design', 'Cloud Bedding', 'High-Speed Wi-Fi', 'Cafe', 'Airport Transfer'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Bloomrooms+Janpath+Delhi',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'India Gate & Kartavya Path',
        time: '1 - 2 hours',
        bestSlot: 'Sunset (5:30 PM - 7:30 PM)',
        image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
        note: 'National war memorial designed by Edwin Lutyens, surrounded by fountains and manicured lawns.'
      },
      {
        name: 'Rashtrapati Bhavan Forecourt',
        time: '1 hour',
        bestSlot: 'Morning (9:30 AM)',
        note: 'Official residence of the President of India displaying classical European and Indian stone architecture.'
      }
    ],
    heritageSites: [
      {
        id: 'humayun-tomb',
        name: "Humayun's Tomb (Maqbara-e-Humayun)",
        constructionPeriod: '1565 - 1572 CE (Commissioned by Empress Bega Begum)',
        location: 'Mathura Road, Nizamuddin East, New Delhi 110013',
        historicalSignificance: 'First garden-tomb on the Indian subcontinent, marking the debut of monumental Mughal architecture and serving as the architectural precursor to the Taj Mahal.',
        culturalImportance: 'UNESCO World Heritage Site that introduced Persian charbagh quadrilateral symmetry to Indian royal funerary art.',
        historySnippet: 'Built nine years after the death of the second Mughal Emperor Humayun by his senior consort Bega Begum with Persian architect Mirak Mirza Ghiyas.',
        fullHistory: "Humayun's Tomb was commissioned in 1565 by Emperor Humayun's chief consort, Empress Bega Begum, following his accidental death in 1556. Designed by Persian architect Mirak Mirza Ghiyas, it synthesized Persian Timurid geometry with indigenous Rajasthani red sandstone and marble inlay craftsmanship. The complex features a 30-acre Charbagh garden intersected by flowing water channels symbolizing the four rivers of Paradise mentioned in Quranic texts. More than 150 Mughal royals are interred in its underground crypts, earning it the moniker 'Dormitory of the House of Timur'. It was inscribed as a UNESCO World Heritage Site in 1993 and underwent landmark restoration by the Aga Khan Trust for Culture.",
        visitingInfo: {
          timings: '6:00 AM - 6:00 PM (All days)',
          entryFee: '₹40 (Indian Citizens) / ₹600 (Foreign Nationals)',
          bestTimeToVisit: 'Early morning (7 AM - 9 AM) or golden hour before sunset'
        },
      },
      {
        id: 'qutub-minar',
        name: 'Qutub Minar & Mehrauli Archaeological Complex',
        constructionPeriod: '1199 - 1368 CE (Begun by Qutb-ud-din Aibak, completed by Iltutmish & Firoz Shah Tughlaq)',
        location: 'Seth Sarai, Mehrauli, New Delhi 110030',
        historicalSignificance: 'At 72.5 meters, it is the tallest fluted brick minaret in the world, symbolizing the establishment of the Delhi Sultanate in North India.',
        culturalImportance: 'Encompasses the 4th-century CE Gupta Iron Pillar, Quwwat-ul-Islam Mosque, and Alai Darwaza, representing Indo-Islamic epigraphy and metallurgical marvels.',
        historySnippet: 'Constructed over three dynasties with red sandstone bands carved with Arabic calligraphic inscriptions and intricate honeycomb stalactite corbels.',
        fullHistory: 'Construction of Qutub Minar began in 1199 under Qutb-ud-din Aibak, the founder of the Mamluk (Slave) Dynasty, who completed the base level. His successor Shams-ud-din Iltutmish added three more stories of red sandstone between 1211 and 1236. After a lightning strike damaged the summit in 1368, Sultan Firoz Shah Tughlaq rebuilt the top two levels using white marble and sandstone. Within the courtyard stands the famous 1,600-year-old rust-resistant Gupta iron pillar, which has baffled metallurgists for centuries due to its high phosphorus content forming a protective passive film.',
        visitingInfo: {
          timings: '7:00 AM - 9:00 PM (Illuminated in evenings)',
          entryFee: '₹40 (Indian Citizens) / ₹600 (Foreign Nationals)',
          bestTimeToVisit: 'Late afternoon through evening light show'
        },
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'October to March',
        climate: 'Crisp, pleasant days (14°C - 23°C) with occasional dense morning fog in December & January.',
        whyVisit: 'Peak sightseeing season; walking through outdoor heritage monuments like India Gate and Humayun’s Tomb is exceptionally comfortable.',
        precautions: 'Carry a warm jacket for evening transit; monitor air quality indices during November.',
        suitableFor: 'Sightseeing, heritage walking tours, outdoor garden picnics'
      },
      {
        season: 'Summer',
        months: 'April to June',
        climate: 'Dry heat with afternoon temperatures frequently exceeding 40°C - 44°C and dry loo winds.',
        whyVisit: 'Significantly fewer tourist crowds at monuments; substantial off-season hotel discounts.',
        precautions: 'Schedule outdoor monument exploration strictly between 6:30 AM - 9:30 AM or after 6:00 PM. Drink plenty of electrolyte water.',
        suitableFor: 'Early morning photography, indoor museums, evening fine dining'
      },
      {
        season: 'Monsoon',
        months: 'July to September',
        climate: 'Warm and humid (28°C - 34°C) with periodic heavy monsoon downpours and green gardens.',
        whyVisit: 'Monuments look vibrant against rain-cleared skies; parks like Lodhi Gardens and Mughal gardens are lush.',
        precautions: 'Carry an umbrella; waterlogging can cause traffic congestion during rush hours.',
        suitableFor: 'Heritage visits during rain breaks, cultural cafes'
      },
      {
        season: 'Spring / Autumn',
        months: 'February to March & October',
        climate: 'Mild daytime sunshine (20°C - 28°C) with cool, breezy evenings.',
        whyVisit: 'Mughal Gardens at Rashtrapati Bhavan open to the public; annual flower shows across parks.',
        precautions: 'Minimal precautions required; ideal weather for travelers of all ages.',
        suitableFor: 'All tourist categories and full-day walking tours'
      }
    ],
    hospitals: [
      {
        name: 'AIIMS Central Emergency Trauma Center',
        address: 'Ansari Nagar, Ring Road, New Delhi 110029',
        distanceKm: 4.8,
        phone: '+91-11-26593677 / 102',
        emergencyInfo: 'Level-1 Apex Trauma Center with 24/7 emergency resuscitation, ICU, blood bank, and multilingual assistance.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=AIIMS+Trauma+Center+New+Delhi'
      },
      {
        name: 'Dr. Ram Manohar Lohia Hospital (RML)',
        address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
        distanceKm: 1.4,
        phone: '+91-11-23365525 / 108',
        emergencyInfo: 'Central government hospital situated directly adjacent to Connaught Place with 24/7 emergency trauma casualty.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=RML+Hospital+New+Delhi'
      },
      {
        name: 'Sir Ganga Ram Hospital',
        address: 'Sir Ganga Ram Hospital Marg, Rajinder Nagar, New Delhi 110060',
        distanceKm: 3.5,
        phone: '+91-11-25750000 / +91-11-42254000',
        emergencyInfo: 'Multi-specialty accredited private hospital with 24/7 international patient coordination and cardiac care.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sir+Ganga+Ram+Hospital+New+Delhi'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1587474260584-9dc6d0d0d87b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2625b7d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['Metro Transit Network', 'Colonial Arcades', 'High Police Density', 'UNESCO Heritage Sites']
  },
  {
    id: 'old-delhi',
    name: 'Old Delhi & Shahjahanabad',
    city: 'Delhi',
    state: 'Delhi NCR',
    tagline: '17th-century Mughal capital walled city featuring red sandstone fortifications and traditional spice bazars',
    category: 'Mughal history, monumental mosques, and culinary bazaars',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'HIGH',
    riskScore: 74,
    riskHotspot: 'Crowded lanes near Khari Baoli spice market, railway transit gates after dusk, and narrow alleys near Matia Mahal.',
    visitWindow: 'Morning to late afternoon (8:30 AM - 4:30 PM)',
    visitTime: 'Half-day (4 - 6 hours)',
    totalExpense: '₹2,600 - ₹4,500 / day',
    expenses: [
      { label: 'Hotel Stay', value: '₹2,100', note: 'Heritage haveli stay or boutique guest rooms' },
      { label: 'Traditional Meals', value: '₹700', note: 'Historic Paranthe Wali Gali & Jama Masjid kebabs' },
      { label: 'Cycle Rickshaws', value: '₹350', note: 'Multiple rides through pedestrian-only lanes' },
      { label: 'Monuments & Guides', value: '₹600', note: 'Red Fort museum and sound-light tickets' }
    ],
    vehicleOptions: [
      { type: 'Cycle Rickshaw', fare: '₹60 - ₹150', note: 'Practical way to move through narrow pedestrian market alleys.' },
      { type: 'Delhi Metro', fare: '₹20 - ₹50', note: 'Chandni Chowk & Jama Masjid stations connect directly to heritage gates.' },
      { type: 'App Cab', fare: '₹250 - ₹550', note: 'Vehicles must drop off at Red Fort parking ground.' }
    ],
    transportOptions: [
      {
        type: 'Metro Rail',
        name: 'Chandni Chowk Metro Station',
        terminalAddress: 'Bazar Sirkiwalan, Chandni Chowk, Old Delhi, Delhi 110006',
        fareRange: '₹20 - ₹50',
        pickupInfo: 'Located directly at the center of the historical market street; pedestrian walkways lead to Sis Ganj Gurudwara.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Chandni+Chowk+Metro+Station+Delhi',
        bookingLinks: { official: 'https://www.delhimetrorail.com/' },
        contact: '011-155370'
      },
      {
        type: 'Railway Station',
        name: 'Old Delhi Railway Station (DLI)',
        terminalAddress: 'Railway Colony, Mori Gate, Delhi 110006',
        fareRange: 'Standard train fares',
        pickupInfo: 'Major railway terminus connecting to Rajasthan, Punjab, and Uttar Pradesh. Pre-paid taxi booth at main porch.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Old+Delhi+Railway+Station',
        bookingLinks: {
          uber: 'https://m.uber.com/',
          ola: 'https://book.olacabs.com/'
        }
      }
    ],
    food: [
      { dish: 'Stuffed Paranthas', price: '₹180', note: 'Crispy fried bread with tamarind chutney in Paranthe Wali Gali.' },
      { dish: 'Mutton Kebabs & Nihari', price: '₹320', note: 'Slow-cooked Mughal recipes perfected over centuries near Jama Masjid.' },
      { dish: 'Rabri Falooda & Jalebi', price: '₹160', note: 'Sweet saffron syrup coils served with thick reduced milk.' }
    ],
    hotels: [
      {
        name: 'Haveli Dharampura - UNESCO Awarded',
        address: '2293, Gali Guliyan, Dharampura, Chandni Chowk, Old Delhi 110006',
        priceRange: '₹6,200 - ₹9,800 / night',
        rating: '4.7',
        reviewCount: '1,450 reviews',
        distance: 'Within historic Chandni Chowk',
        amenities: ['Mughal Haveli Courtyard', 'Kathak Dance Shows', 'Rooftop Fort Views', 'Rooftop Fine Dining'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Haveli+Dharampura+Delhi',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Hotel Red Fort View',
        address: 'Chandni Chowk Road, Opposite Red Fort, Old Delhi 110006',
        priceRange: '₹2,200 - ₹3,600 / night',
        rating: '4.1',
        reviewCount: '980 reviews',
        distance: '0.4 km from Red Fort',
        amenities: ['Budget Friendly', '24/7 Desk', 'Air Conditioned', 'Walking Distance to Metro'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+Red+Fort+Delhi',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Tara Palace Chandni Chowk',
        address: '4190, Dhobiwara, Chandni Chowk, Old Delhi 110006',
        priceRange: '₹2,800 - ₹4,200 / night',
        rating: '4.2',
        reviewCount: '1,120 reviews',
        distance: '0.6 km from Jama Masjid',
        amenities: ['Free Breakfast', 'Rooftop Terrace', 'Luggage Storage', 'Tour Assistance'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Tara+Palace+Delhi',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Maidens Hotel Delhi',
        address: '7 Sham Nath Marg, Civil Lines, Delhi 110054 (Near Old Delhi)',
        priceRange: '₹7,500 - ₹12,000 / night',
        rating: '4.8',
        reviewCount: '2,890 reviews',
        distance: '2.5 km from Red Fort',
        amenities: ['Colonial 1903 Estate', 'Outdoor Swimming Pool', 'Garden Dining', 'High Security'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Maidens+Hotel+Delhi',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'Jama Masjid Courtyard',
        time: '1 - 2 hours',
        bestSlot: 'Early Afternoon',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80',
        note: 'Massive red sandstone mosque accommodating over 25,000 worshippers built by Shah Jahan.'
      },
      {
        name: 'Khari Baoli Spice Market',
        time: '1 hour',
        bestSlot: 'Morning (10:00 AM)',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        note: 'Asia’s largest wholesale spice market functioning continuously since the 17th century.'
      }
    ],
    heritageSites: [
      {
        id: 'red-fort',
        name: 'Red Fort (Lal Qila)',
        constructionPeriod: '1638 - 1648 CE (Under Mughal Emperor Shah Jahan)',
        location: 'Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi 110006',
        historicalSignificance: 'Main residence of the Mughal emperors for nearly 200 years and national symbol from which the Prime Minister of India addresses the nation on Independence Day.',
        culturalImportance: 'UNESCO World Heritage Site embodying the pinnacle of Mughal creativity, blending Persian palace architecture with Timurid and Indian decorative traditions.',
        historySnippet: 'Constructed when Shah Jahan decided to shift his imperial capital from Agra to the newly planned city of Shahjahanabad.',
        fullHistory: "Commissioned by Emperor Shah Jahan in 1638 when he transferred the Mughal court from Agra to Shahjahanabad, the Red Fort took ten years to complete under architects Ustad Ahmad Lahori and Ustad Hamid. Constructed of red sandstone octagonal walls stretching over 2.4 kilometers along the Yamuna River, it houses the Diwan-i-Aam (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience where the Peacock Throne once stood), and the marble Hammam royal baths. The complex was seized by Nadir Shah in 1739 and later transformed into a British military garrison following the 1857 Uprising. It remains an indelible symbol of India's sovereignty.",
        visitingInfo: {
          timings: '9:30 AM - 4:30 PM (Closed on Mondays)',
          entryFee: '₹50 (Indian Citizens) / ₹600 (Foreign Nationals)',
          bestTimeToVisit: 'Morning at 9:30 AM before the heat and peak school tour crowds'
        },
        image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=900&q=80'
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'November to February',
        climate: 'Chilly mornings (10°C - 18°C) with clear afternoons, ideal for walking crowded bazars.',
        whyVisit: 'Comfortable outdoor street food exploration; crisp air enhances monument sightseeing.',
        precautions: 'Carry cash in small denominations as many legacy stalls do not accept international cards.',
        suitableFor: 'Heritage walking, culinary trails, shopping'
      },
      {
        season: 'Monsoon',
        months: 'July to September',
        climate: 'Humid (30°C - 36°C) with periodic showers.',
        whyVisit: 'Authentic monsoonal street food like pakoras and jalebis; fresh river views.',
        precautions: 'Streets can become wet and crowded; wear waterproof footwear with good traction.',
        suitableFor: 'Indoor haveli dining, mosque exploration'
      },
      {
        season: 'Summer',
        months: 'April to June',
        climate: 'Extremely hot and crowded during midday (38°C - 45°C).',
        whyVisit: 'Morning bazar walks before 10 AM offer a peaceful look at merchant life.',
        precautions: 'Avoid afternoon walking tours; carry water and sun protection.',
        suitableFor: 'Early morning cultural visits'
      },
      {
        season: 'Spring / Autumn',
        months: 'March & October',
        climate: 'Pleasant temperatures (22°C - 30°C) with mild breezes.',
        whyVisit: 'Great time for festival celebrations and photography.',
        precautions: 'Watch personal belongings in congested bazaar choke points.',
        suitableFor: 'All travelers'
      }
    ],
    hospitals: [
      {
        name: 'Lok Nayak Jai Prakash Narayan Hospital (LNJP)',
        address: 'Jawaharlal Nehru Marg, Delhi Gate, Near Old Delhi 110002',
        distanceKm: 1.8,
        phone: '+91-11-23233000 / 102',
        emergencyInfo: 'Government teaching hospital equipped with 24/7 dedicated trauma casualty and emergency resuscitation.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=LNJP+Hospital+Delhi'
      },
      {
        name: 'Kasturba Hospital',
        address: 'Near Jama Masjid, Daryaganj, Old Delhi 110006',
        distanceKm: 0.9,
        phone: '+91-11-23275023',
        emergencyInfo: 'Municipal hospital providing 24/7 emergency care and first-aid response within the walled city.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kasturba+Hospital+Daryaganj'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['UNESCO Red Fort', 'Mughal Architecture', 'Authentic Street Food', 'Cycle Rickshaw Tours']
  },
  {
    id: 'jaipur-pink-city',
    name: 'Pink City & Amber Fortresses',
    city: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'UNESCO World Heritage royal city defined by terracotta pink facades, hill forts, and royal observatories',
    category: 'Rajput palace architecture, hilltop forts, and textile craft bazars',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1601412436000-7ee7d2281dd9?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'LOW',
    riskScore: 36,
    riskHotspot: 'Crowded gem bazars around Johari Bazar and parking approaches to Bapu Bazaar post 9:30 PM.',
    visitWindow: 'Morning to sunset (8:30 AM - 5:30 PM)',
    visitTime: '1 to 2 days',
    totalExpense: '₹4,000 - ₹7,200 / day',
    expenses: [
      { label: 'Hotel Stay', value: '₹2,800', note: 'Restored Rajput heritage haveli or boutique stay' },
      { label: 'Rajasthani Thali', value: '₹850', note: 'Dal baati churma and royal courtyard dining' },
      { label: 'Cab Sightseeing', value: '₹600', note: 'Full-day taxi to hill fortresses (Amer, Nahargarh)' },
      { label: 'Composite Passes', value: '₹1,000', note: 'Rajasthan Tourism composite pass for 8 monuments' }
    ],
    vehicleOptions: [
      { type: 'Day Rental Taxi', fare: '₹1,600 - ₹2,400/day', note: 'Convenient for climbing hill forts and traveling between city monuments.' },
      { type: 'Jaipur Metro', fare: '₹15 - ₹40', note: 'Connects Railway Station to Chandpole inside the walled city.' },
      { type: 'Auto-rickshaw', fare: '₹100 - ₹250', note: 'Ideal for navigating narrow bazar gates like Tripolia.' }
    ],
    transportOptions: [
      {
        type: 'Railway Station',
        name: 'Jaipur Junction Railway Station (JP)',
        terminalAddress: 'Station Road, Gopalbari, Jaipur, Rajasthan 302006',
        fareRange: 'Intercity train fares',
        pickupInfo: 'Government-authorized pre-paid taxi and auto-rickshaw booths located directly outside Platform 1.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Jaipur+Junction+Railway+Station',
        bookingLinks: {
          uber: 'https://m.uber.com/',
          ola: 'https://book.olacabs.com/',
          rapido: 'https://www.rapido.bike/'
        },
        contact: '0141-2201940'
      },
      {
        type: 'Central Bus Terminal',
        name: 'Sindhi Camp Central Bus Stand (RSRTC)',
        terminalAddress: 'Station Road, Sindhi Camp, Jaipur 302001',
        fareRange: '₹120 - ₹800',
        pickupInfo: 'Main depot for state and deluxe Volvo buses across Delhi, Agra, Jodhpur, and Udaipur.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Sindhi+Camp+Bus+Stand+Jaipur',
        bookingLinks: { official: 'https://transport.rajasthan.gov.in/rsrtc/' },
        contact: '0141-2207908'
      }
    ],
    food: [
      { dish: 'Dal Baati Churma', price: '₹300', note: 'Baked wheat balls dipped in pure desi ghee with spicy dal and sweet jaggery churma.' },
      { dish: 'Pyaaz Kachori & Mirchi Vada', price: '₹120', note: 'Crispy deep-fried onion pastry served with tangy mint and tamarind chutney.' },
      { dish: 'Mawa Ghevar', price: '₹220', note: 'Honeycomb festive disc dessert soaked in cardamom saffron sugar syrup.' }
    ],
    hotels: [
      {
        name: 'Hotel Umaid Mahal Heritage Style',
        address: 'C-20 / B-2, Bihari Marg, Jai Singh Highway, Bani Park, Jaipur 302016',
        priceRange: '₹4,600 - ₹7,200 / night',
        rating: '4.6',
        reviewCount: '3,850 reviews',
        distance: '2.5 km from City Palace',
        amenities: ['Ornate Frescoes', 'Swimming Pool', 'Rooftop Restaurant', 'Airport Shuttle', 'Live Puppet Shows'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+Umaid+Mahal+Jaipur',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Shahpura House Heritage Hotel',
        address: 'D-257, Devi Marg, Bani Park, Jaipur 302016',
        priceRange: '₹6,400 - ₹11,000 / night',
        rating: '4.7',
        reviewCount: '2,920 reviews',
        distance: '3.0 km from Hawa Mahal',
        amenities: ['Royal Rajput Decor', 'Outdoor Pool', 'Ayurvedic Spa', 'Boutique Suites', 'Free High-Speed Wi-Fi'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Shahpura+House+Jaipur',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Treebo Trend Heritage Inn',
        address: 'Subhash Nagar, Near Science Park, Shastri Nagar, Jaipur 302016',
        priceRange: '₹2,400 - ₹3,800 / night',
        rating: '4.4',
        reviewCount: '1,420 reviews',
        distance: '2.0 km from city center',
        amenities: ['Free Breakfast', 'Budget Friendly', 'Clean Rooms', 'High-speed Wi-Fi', '24/7 Desk'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Treebo+Trend+Jaipur',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'ITC Rajputana, a Luxury Collection Hotel',
        address: 'Palace Road, Gopalbari, Jaipur 302006',
        priceRange: '₹9,800 - ₹18,000 / night',
        rating: '4.8',
        reviewCount: '4,650 reviews',
        distance: '0.5 km from Jaipur Junction',
        amenities: ['Luxury Spa', 'Fine Dining Pavilions', 'Concierge Service', 'Heated Pool', 'Doctor on Call'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=ITC+Rajputana+Jaipur',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'City Palace Complex',
        time: '2 - 3 hours',
        bestSlot: 'Morning (10:00 AM)',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
        note: 'Centuries-old residence of the Maharaja of Jaipur featuring Chandra Mahal, Mubarak Mahal, and armoury museums.'
      },
      {
        name: 'Nahargarh Fort Sunset Point',
        time: '2 hours',
        bestSlot: 'Sunset (5:00 PM - 7:00 PM)',
        note: 'High ridge fortress on the Aravalli hills overlooking the entirety of the Pink City.'
      }
    ],
    heritageSites: [
      {
        id: 'amer-fort',
        name: 'Amer Fort & Palace (Amber Fort)',
        constructionPeriod: '1592 CE (Commissioned by Raja Man Singh I, expanded by Sawai Jai Singh)',
        location: 'Devisinghpura, Amer, Jaipur, Rajasthan 302028',
        historicalSignificance: 'Formidable hilltop fortress and palatial complex serving as the principal seat of the Kachwaha Rajputs before the founding of Jaipur.',
        culturalImportance: 'UNESCO World Heritage Hill Fort of Rajasthan famed for Sheesh Mahal (Palace of Mirrors) and artistic Hindu elements.',
        historySnippet: 'Constructed using red sandstone and yellow marble along the banks of Maota Lake.',
        fullHistory: "Amer Fort was constructed on the rugged Cheel ka Teela (Hill of Eagles) by Raja Man Singh I in 1592, with extensive additions by Mirza Raja Jai Singh. Rising majestically above Maota Lake, the fort features four grand courtyards. The first is Jaleb Chowk, where victorious soldiers assembled. The second contains the Diwan-i-Aam. The third courtyard houses the Sheesh Mahal, where walls are encrusted with thousands of imported concave convex mirror glass pieces that reflect a single candle's beam across the chamber. Below the fort, underground tunnels connect to the military citadel of Jaigarh Fort, providing escape routes during sieges.",
        visitingInfo: {
          timings: '8:00 AM - 5:30 PM (Night viewing 6:30 PM - 9:15 PM)',
          entryFee: '₹100 (Indian Citizens) / ₹500 (Foreign Nationals)',
          bestTimeToVisit: 'Morning (8:30 AM - 11 AM) before heat'
        },
      },
      {
        id: 'hawa-mahal',
        name: 'Hawa Mahal (Palace of Winds)',
        constructionPeriod: '1799 CE (Built by Maharaja Sawai Pratap Singh)',
        location: 'Hawa Mahal Road, Badi Choupad, J.D.A. Market, Pink City, Jaipur 302002',
        historicalSignificance: 'Architectural crown of Jaipur designed in the form of the crown of Lord Krishna by Lal Chand Ustad.',
        culturalImportance: 'Built with 953 jharokhas (latticed windows) allowing royal women to observe street festivals in privacy without violating purdah customs.',
        historySnippet: 'Constructed of pink and red sandstone with cool venturi airflow system that air-conditions the palace naturally.',
        fullHistory: 'Erected in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal is a five-story pyramidal monument with no formal foundation, resting on a base wall just 1.5 feet thick at the top. The façade features 953 intricately carved sandstone casements designed to harness the venturi effect, cooling interior rooms even in scorching 45°C summer heat. The palace has no conventional staircases; floors are reached via gently inclined ramps constructed for royal palanquins.',
        visitingInfo: {
          timings: '9:00 AM - 5:00 PM',
          entryFee: '₹50 (Indian Citizens) / ₹200 (Foreign Nationals)',
          bestTimeToVisit: 'Early morning (8 AM - 9:30 AM) when morning sunlight illuminates the pink stone'
        },
        image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=900&q=80'
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'November to February',
        climate: 'Mild sunny days (18°C - 24°C) and cool desert nights (8°C - 12°C).',
        whyVisit: 'Ideal festival season (Jaipur Literature Festival, Kite Festival); walking through Amer Fort is effortless.',
        precautions: 'Book heritage hotels at least 4 weeks in advance due to peak global demand.',
        suitableFor: 'Sightseeing, cultural festivals, desert shopping'
      },
      {
        season: 'Monsoon',
        months: 'July to September',
        climate: 'Warm with dramatic rains that turn the Aravalli hills lush green.',
        whyVisit: 'Nahargarh and Amer Forts look stunning with full waterfalls and filled lakes; fewer crowds.',
        precautions: 'Carry rain protection; roads in the old city can encounter temporary water delays.',
        suitableFor: 'Scenic photography, budget travel'
      },
      {
        season: 'Summer',
        months: 'April to June',
        climate: 'Dry desert heat exceeding 40°C - 45°C during peak midday.',
        whyVisit: 'Great room rates at premier royal palaces and havelis.',
        precautions: 'Schedule fort visits early in the morning before 10 AM; keep hydrated with lemonade.',
        suitableFor: 'Budget luxury stays, early morning tours'
      },
      {
        season: 'Spring / Autumn',
        months: 'March & October',
        climate: 'Warm days and pleasant evenings (24°C - 32°C).',
        whyVisit: 'Good balance of comfortable temperatures and vibrant craft markets.',
        precautions: 'Standard sunscreen and walking shoes for cobbled courtyards.',
        suitableFor: 'Couples, families, cultural travelers'
      }
    ],
    hospitals: [
      {
        name: 'SMS Hospital (Sawai Man Singh Medical College)',
        address: 'Jawahar Lal Nehru Marg, Ashok Nagar, Jaipur, Rajasthan 302004',
        distanceKm: 2.8,
        phone: '+91-141-2518224 / 108',
        emergencyInfo: 'Largest apex government multi-specialty trauma hospital in Rajasthan with 24/7 dedicated ICU, neurosurgery, and casualty.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SMS+Hospital+Jaipur'
      },
      {
        name: 'Fortis Escorts Hospital Jaipur',
        address: 'JLN Marg, Malviya Nagar, Jaipur 302017',
        distanceKm: 6.2,
        phone: '+91-141-2547000',
        emergencyInfo: 'JCI-accredited tertiary private hospital with 24/7 cardiac emergency, international patient concierge, and pharmacy.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fortis+Escorts+Hospital+Jaipur'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556005819-5d0fe9fa3c4d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['UNESCO Walled City', 'Hilltop Amber Fort', 'Palace Observatories', 'Handmade Block Prints']
  },
  {
    id: 'agra-taj',
    name: 'Taj Heritage Zone & Fatehabad',
    city: 'Agra',
    state: 'Uttar Pradesh',
    tagline: 'Home to the Taj Mahal, imperial Mughal fortifications, and royal riverbank gardens',
    category: 'Mughal wonders, marble heritage, and UNESCO World Heritage Sites',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'MODERATE',
    riskScore: 50,
    riskHotspot: 'West & East Gate monument approaches with persistent unofficial touts; stick to ASI-verified ticketing booths.',
    visitWindow: 'Sunrise (6:00 AM - 9:00 AM) or Sunset',
    visitTime: 'Full-day (6 - 8 hours)',
    totalExpense: '₹3,200 - ₹5,800 / day',
    expenses: [
      { label: 'Hotel Stay', value: '₹2,400', note: 'Fatehabad Road hotel with Taj Mahal view' },
      { label: 'Meals & Petha', value: '₹800', note: 'Mughlai dining & famous Angoori Petha' },
      { label: 'Electric Transport', value: '₹400', note: 'Eco battery carts within the green monument zone' },
      { label: 'ASI Monument Pass', value: '₹950', note: 'Taj Mahal & Agra Fort admissions' }
    ],
    vehicleOptions: [
      { type: 'Eco Battery Cart', fare: '₹40 - ₹80', note: 'Only authorized transport inside the 500m non-pollution zone surrounding the Taj.' },
      { type: 'Prepaid Taxi', fare: '₹700 - ₹1,400/day', note: 'Useful to cover Taj Mahal, Agra Fort, and Mehtab Bagh seamlessly.' },
      { type: 'App Cab', fare: '₹150 - ₹350', note: 'Uber & Ola operate across Agra Cantt and Fatehabad tourist corridor.' }
    ],
    transportOptions: [
      {
        type: 'Railway Station',
        name: 'Agra Cantt Railway Station (AGC)',
        terminalAddress: 'Station Road, Cantonment, Agra, Uttar Pradesh 282001',
        fareRange: 'Express train fares (e.g. Gatimaan Express from Delhi: 1 hr 40 min)',
        pickupInfo: 'Prepaid taxi kiosk operated by GRP Police directly on main concourse.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Agra+Cantt+Railway+Station',
        bookingLinks: {
          uber: 'https://m.uber.com/',
          ola: 'https://book.olacabs.com/'
        },
        contact: '0562-2421204'
      },
      {
        type: 'Bus Station',
        name: 'Idgah Inter-State Bus Stand',
        terminalAddress: 'Idgah, Near Agra Cantt, Agra 282001',
        fareRange: '₹100 - ₹500',
        pickupInfo: 'Buses to Jaipur, Mathura, and Delhi Yamuna Expressway services.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Idgah+Bus+Stand+Agra',
        bookingLinks: { official: 'https://upsrtc.up.gov.in/' }
      }
    ],
    food: [
      { dish: 'Agra Kesar & Angoori Petha', price: '₹180', note: 'Signature translucent candied ash gourd sweet soaked in saffron syrup.' },
      { dish: 'Bedmi Puri with Spicy Aloo', price: '₹120', note: 'Traditional breakfast dish of urad-dal stuffed crisp wheat bread with fenugreek potato curry.' },
      { dish: 'Mughlai Chicken Korma', price: '₹380', note: 'Cashew and yogurt gravy simmered with aromatic whole spices.' }
    ],
    hotels: [
      {
        name: 'The Oberoi Amarvilas Agra',
        address: 'Taj East Gate Road, Paktola, Tajganj, Agra, Uttar Pradesh 282001',
        priceRange: '₹18,000 - ₹38,000 / night',
        rating: '4.9',
        reviewCount: '4,280 reviews',
        distance: '600m from Taj Mahal (unobstructed views from all rooms)',
        amenities: ['Direct Taj Mahal Views', 'Private Buggy to Monument', 'Luxury Spa', 'Michelin Standard Dining', '24/7 Butler'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Oberoi+Amarvilas+Agra',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Tajview - IHCL SeleQtions',
        address: 'Fatehabad Road, Tajganj, Agra 282001',
        priceRange: '₹4,800 - ₹8,200 / night',
        rating: '4.5',
        reviewCount: '2,940 reviews',
        distance: '1.6 km from Taj Mahal',
        amenities: ['Rooftop Taj Cafe', 'Swimming Pool', 'Doctor on Call', 'Family Suites', 'Free Parking'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Tajview+Agra',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Courtyard by Marriott Agra',
        address: 'Taj Nagari, Phase 2, Fatehabad Road, Agra 282001',
        priceRange: '₹3,900 - ₹6,500 / night',
        rating: '4.6',
        reviewCount: '3,210 reviews',
        distance: '2.5 km from Taj East Gate',
        amenities: ['Outdoor Pool', '24/7 Fitness Center', 'International Buffet', 'High Security', 'Concierge Service'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Courtyard+by+Marriott+Agra',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Hotel Taj Resorts',
        address: '538, Near Shilpgram, Taj Mahal East Gate, Agra 282001',
        priceRange: '₹2,600 - ₹4,100 / night',
        rating: '4.2',
        reviewCount: '1,860 reviews',
        distance: '0.7 km from East Gate Ticket Counter',
        amenities: ['Rooftop Pool with Taj View', 'Restaurant', 'Free Wi-Fi', 'Travel Desk', 'Luggage Storage'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+Taj+Resorts+Agra',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'Agra Fort (Red Fort of Agra)',
        time: '2 - 3 hours',
        bestSlot: 'Morning (10:00 AM - 12:30 PM)',
        note: 'Massive red sandstone residence of emperors Akbar, Jahangir, and Shah Jahan with marble palaces.'
      },
      {
        name: 'Mehtab Bagh (Moonlight Garden)',
        time: '1.5 hours',
        bestSlot: 'Sunset (5:00 PM - 6:30 PM)',
        image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=900&q=80',
        note: 'Charbagh garden complex on the opposite Yamuna bank providing tranquil sunset views of the Taj Mahal.'
      }
    ],
    heritageSites: [
      {
        id: 'taj-mahal',
        name: 'Taj Mahal (The Crown of Palaces)',
        constructionPeriod: '1631 - 1648 CE (Commissioned by Mughal Emperor Shah Jahan)',
        location: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001',
        historicalSignificance: 'Universally recognized as the jewel of Muslim art in India and one of the seven wonders of the world, commemorating Mumtaz Mahal.',
        culturalImportance: 'UNESCO World Heritage Site exhibiting Makrana translucent white marble, intricate pietra dura lapidary inlay, and optical symmetry.',
        historySnippet: 'Built by over 20,000 artisans under court architect Ustad Ahmad Lahori on the south bank of the Yamuna River.',
        fullHistory: 'The Taj Mahal was commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of his favorite consort, Mumtaz Mahal, who died in Burhanpur during childbirth. The central tomb sits on a square marble plinth with four 40-meter minarets tilted slightly outward to protect the central dome in case of an earthquake. The dome rises 35 meters and is made of pure white Makrana marble brought from Rajasthan by thousands of elephants. Precious and semi-precious stones including lapis lazuli from Afghanistan, jade from China, turquoise from Tibet, and carnelian from Arabia were inlaid into floral scrollwork using the delicate pietra dura (parchin kari) technique.',
        visitingInfo: {
          timings: '30 minutes before sunrise to 30 minutes before sunset (Closed on Fridays)',
          entryFee: '₹50 (Indian Citizens) + ₹200 for Main Mausoleum / ₹1,100 (Foreign Nationals)',
          bestTimeToVisit: 'Sunrise at 6:00 AM to see the marble shift from soft gold to brilliant pearl'
        },
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80'
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'October to March',
        climate: 'Chilly to pleasant (11°C - 23°C) with occasional early morning fog in January.',
        whyVisit: 'Best time for comfortable walking along extensive stone courtyards.',
        precautions: 'Check fog forecast for sunrise timing; fog can occasionally veil morning views.',
        suitableFor: 'Photography, couples, heritage tours'
      },
      {
        season: 'Summer',
        months: 'April to June',
        climate: 'High heat (39°C - 45°C).',
        whyVisit: 'Least crowded season; sunrise entry offers empty marble corridors.',
        precautions: 'Arrive at the ticket counter right at 5:45 AM; finish monument visits by 9:30 AM.',
        suitableFor: 'Sunrise photographers, budget travelers'
      },
      {
        season: 'Monsoon',
        months: 'July to September',
        climate: 'Warm and overcast (28°C - 34°C).',
        whyVisit: 'Yamuna River flows full, enhancing reflection pools and Mehtab Bagh gardens.',
        precautions: 'Carry an umbrella; watch footing on marble steps after rain.',
        suitableFor: 'Garden walks, monsoon views'
      },
      {
        season: 'Spring / Autumn',
        months: 'March & October',
        climate: 'Crisp, sunny, and very comfortable (20°C - 30°C).',
        whyVisit: 'Taj Mahotsav cultural crafts festival in February/March at Shilpgram.',
        precautions: 'Book express train tickets early.',
        suitableFor: 'All travelers'
      }
    ],
    hospitals: [
      {
        name: 'S.N. Medical College & Emergency Hospital',
        address: 'Moti Katra, Mantola, Agra, Uttar Pradesh 282003',
        distanceKm: 3.2,
        phone: '+91-562-2260353 / 108',
        emergencyInfo: 'Government teaching medical center with 24/7 dedicated critical care and emergency triage.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SN+Medical+College+Agra'
      },
      {
        name: 'Pushpanjali Hospital & Research Centre',
        address: 'Delhi Gate, Civil Lines, Agra 282002',
        distanceKm: 4.5,
        phone: '+91-562-2850388',
        emergencyInfo: 'Private multi-specialty hospital with 24/7 emergency response, cardiac care, and trauma service.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pushpanjali+Hospital+Agra'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['Taj Mahal Wonder', 'Agra Fort', 'Parchin Kari Stone Craft', 'Direct High-Speed Rail']
  },
  {
    id: 'manali-himalayas',
    name: 'Manali & Solang Valley',
    city: 'Manali',
    state: 'Himachal Pradesh',
    tagline: 'High-altitude Himalayan gateway nestled in the Beas River valley featuring pine forests, cedar temples, and snow passes',
    category: 'Himalayan adventure, ancient wooden temples, and alpine valleys',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1596761224566-34027780362f?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'LOW',
    riskScore: 28,
    riskHotspot: 'Narrow road bends on Rohtang Highway during snowfall, and high-current Beas riverbanks near Aleo post dusk.',
    visitWindow: 'Daytime (9:00 AM - 6:00 PM)',
    visitTime: '2 to 4 days',
    totalExpense: '₹3,800 - ₹6,500 / day',
    expenses: [
      { label: 'Mountain Resort', value: '₹3,200', note: 'Cedar cottage or scenic mountain-view stay' },
      { label: 'Himachali Meals', value: '₹750', note: 'Local trout, Siddu, and Tibetan thukpa' },
      { label: 'Mountain Cab', value: '₹900', note: '4x4 taxi for Solang & Atal Tunnel excursion' },
      { label: 'Green Tax & Permits', value: '₹550', note: 'Rohtang eco-permits and temple entries' }
    ],
    vehicleOptions: [
      { type: '4x4 Mountain Taxi', fare: '₹2,000 - ₹3,500/day', note: 'Required for high passes (Rohtang Pass & Atal Tunnel) with certified mountain drivers.' },
      { type: 'Auto-rickshaw', fare: '₹120 - ₹250', note: 'Convenient for transit between Mall Road, Old Manali, and Hadimba Temple.' },
      { type: 'Scooter / Royal Enfield Rental', fare: '₹900 - ₹1,600/day', note: 'Popular option in Old Manali for independent valley exploration.' }
    ],
    transportOptions: [
      {
        type: 'Bus Station',
        name: 'Manali Private Volvo & HRTC Bus Stand',
        terminalAddress: 'Model Town, Mall Road, Manali, Himachal Pradesh 175131',
        fareRange: '₹900 - ₹1,800 (Overnight Volvo from Delhi / Chandigarh)',
        pickupInfo: 'Major boarding point for luxury semi-sleeper Volvo buses directly connecting New Delhi (Kashmere Gate) and Chandigarh.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Manali+Bus+Stand',
        bookingLinks: {
          official: 'https://hrtchp.com/',
          uber: 'https://m.uber.com/'
        },
        contact: '01902-252323 (HRTC Manali Depot)'
      },
      {
        type: 'Regional Airport Hub',
        name: 'Kullu-Manali Airport (Bhuntar - KUU)',
        terminalAddress: 'Bhuntar, Kullu District, Himachal Pradesh 175125 (50 km south of Manali)',
        fareRange: '₹1,500 - ₹2,500 (Prepaid Airport Taxi to Manali)',
        pickupInfo: 'Operates direct Alliance Air flights from Delhi and Chandigarh. Pre-paid taxi counter inside terminal.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Kullu+Manali+Airport+Bhuntar',
        bookingLinks: {
          official: 'https://www.aai.aero/en/airports/kullu-manali',
          ola: 'https://book.olacabs.com/'
        },
        contact: '01902-265052'
      }
    ],
    food: [
      { dish: 'Himachali Siddu with Ghee', price: '₹140', note: 'Steamed fermented wheat dough bun stuffed with poppy seeds and walnuts, served hot with desi ghee.' },
      { dish: 'Pan-Fried Himalayan River Trout', price: '₹380', note: 'Fresh freshwater trout seasoned with garlic, butter, and lemon at Old Manali cafes.' },
      { dish: 'Tibetan Thukpa & Momos', price: '₹160', note: 'Comforting noodle soup in rich spiced vegetable or chicken broth with handmade dumplings.' }
    ],
    hotels: [
      {
        name: 'The Himalayan Resort & Spa',
        address: 'Hadimba Road, Kullu Valley, Manali, Himachal Pradesh 175131',
        priceRange: '₹7,500 - ₹14,000 / night',
        rating: '4.8',
        reviewCount: '1,980 reviews',
        distance: '1.2 km from Mall Road',
        amenities: ['Victorian Gothic Castle Decor', 'Heated Outdoor Pool', 'Orchard Views', 'Fireplace Suites', 'Spa'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Himalayan+Resort+Manali',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Span Resort & Spa',
        address: 'Baragarh Estate, NH-21, Kullu-Manali Highway 175129',
        priceRange: '₹9,800 - ₹18,000 / night',
        rating: '4.7',
        reviewCount: '2,420 reviews',
        distance: '14 km before Manali on Beas Riverbank',
        amenities: ['Private Beas River Frontage', 'Helipad', 'Riverside Lawn Dining', 'Heated Pool', 'Doctor on Call'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Span+Resort+Manali',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Apple Country Resorts',
        address: 'Log-Huts Area, Manali 175131',
        priceRange: '₹3,800 - ₹6,500 / night',
        rating: '4.4',
        reviewCount: '2,110 reviews',
        distance: '1.8 km from Hadimba Temple',
        amenities: ['Mountain View Balconies', 'Pure Veg Dining', 'Cedar Forest Setting', 'Free Wi-Fi', 'Travel Desk'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Apple+Country+Resorts+Manali',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Snow Valley Resorts Manali',
        address: 'Log Hut Area, Manali 175131',
        priceRange: '₹3,200 - ₹5,400 / night',
        rating: '4.5',
        reviewCount: '3,890 reviews',
        distance: '2.0 km from city center',
        amenities: ['Scenic Apple Orchard View', 'Buffet Breakfast', 'Family Suites', 'Billiards Room', 'Parking'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Snow+Valley+Resorts+Manali',
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'Solang Valley Adventure Grounds',
        time: '3 - 5 hours',
        bestSlot: 'Morning (9:30 AM - 1:30 PM)',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        note: 'Famous hub for paragliding, zorbing, quad biking, and winter ski slopes against snow-capped peaks.'
      },
      {
        name: 'Atal Tunnel & Sissu Valley',
        time: 'Half-day (4 hours)',
        bestSlot: 'Morning (10:00 AM)',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
        note: 'Engineering marvel 9.02 km tunnel crossing under Rohtang Pass into the breathtaking Lahaul valley.'
      }
    ],
    heritageSites: [
      {
        id: 'hadimba-temple',
        name: 'Hadimba Devi Temple (Dhungri Temple)',
        constructionPeriod: '1553 CE (Commissioned by Raja Bahadur Singh of Kullu)',
        location: 'Hadimba Temple Road, Old Manali, Manali, Himachal Pradesh 175131',
        historicalSignificance: 'Ancient four-tiered wooden pagoda temple dedicated to Hadimba Devi, wife of Bhima from the Mahabharata epic.',
        culturalImportance: 'Built in indigenous Kath Kuni timber-and-stone architectural style with elaborate wooden reliefs of deities, lions, and floral motifs.',
        historySnippet: 'Constructed around a natural cave where Hadimba is believed to have engaged in penance and meditation.',
        fullHistory: 'Hadimba Devi Temple was built in 1553 CE by Raja Bahadur Singh, ruler of the Kullu kingdom. Surrounded by dense Dhungri cedar forests, the pagoda structure features three square timber tiers roofed with pine wood and a conical brass pinnacle summit. The sanctum encloses a natural rock outcrop venerated as the deity’s footprint. The temple is historically significant for its preservation of pre-Mughal Western Himalayan woodcarving traditions and continues to be the site of the annual Saroohni fair.',
        visitingInfo: {
          timings: '8:00 AM - 6:00 PM (Open all days)',
          entryFee: 'Free entry for all visitors',
          bestTimeToVisit: 'Early morning (8:00 AM - 10:00 AM) to experience peaceful forest chanting'
        },
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'naggar-castle',
        name: 'Naggar Castle (Historic Seat of Kullu Kings)',
        constructionPeriod: '1460 CE (Built by Raja Sidh Singh)',
        location: 'Naggar Village, Kullu District, Himachal Pradesh 175130 (21 km from Manali)',
        historicalSignificance: 'Former royal residence of the Kullu rulers for over 1,400 years, offering sweeping panoramas of the Beas gorge.',
        culturalImportance: 'Classic example of earthquake-resistant Kath Kuni architecture, utilizing alternating layers of timber beams and deodar stones without mortar.',
        historySnippet: 'Withstood the catastrophic 1905 Kangra earthquake with virtually no structural damage thanks to its interlocking timber joints.',
        fullHistory: 'Naggar Castle was constructed in 1460 CE by Raja Sidh Singh of Kullu and served as the administrative capital until the seat moved to Sultanpur in 1660. The castle was later acquired by the British and served as a retreat for European painters including Russian artist Nicholas Roerich, whose historic estate and art gallery are located nearby. Today managed by Himachal Tourism (HPTDC), the castle houses wooden courtyards, the Jagatipatt temple stone, and traditional balconies.',
        visitingInfo: {
          timings: '9:00 AM - 6:00 PM',
          entryFee: '₹30 (Indian Citizens) / ₹100 (Foreign Nationals)',
          bestTimeToVisit: 'Afternoon (1:00 PM - 4:00 PM)'
        },
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'December to February',
        climate: 'Sub-zero temperatures (-4°C to 8°C) with heavy snowfall, frosting, and frozen waterfalls.',
        whyVisit: 'Prime snow adventure season; skiing, snowboarding, and winter wonderland landscapes.',
        precautions: 'Carry heavy down jackets, thermal layers, and snow boots. Rohtang Pass is closed due to snow; Atal Tunnel remains open subject to weather.',
        suitableFor: 'Snow enthusiasts, honeymooners, winter sports athletes'
      },
      {
        season: 'Summer',
        months: 'April to June',
        climate: 'Pleasant daytime mountain sunshine (12°C - 24°C) with cool, refreshing evenings.',
        whyVisit: 'Peak tourist season; Rohtang Pass opens, Solang Valley paragliding is fully active, and river rafting is available.',
        precautions: 'High tourist traffic on NH-3; leave early in the morning for Solang and Rohtang visits.',
        suitableFor: 'Families, adventure seekers, trekking groups'
      },
      {
        season: 'Monsoon',
        months: 'July to September',
        climate: 'Wet and humid (15°C - 22°C) with torrential rainfall and high river discharge.',
        whyVisit: 'Lush emerald green landscapes, roaring waterfalls, and significantly lower hotel tariffs.',
        precautions: 'Check weather advisories before traveling; landslides can cause road delays on Chandigarh-Manali highway. Avoid riverbeds completely.',
        suitableFor: 'Leisure stays at secluded resorts, workcations'
      },
      {
        season: 'Spring / Autumn',
        months: 'October to November & March',
        climate: 'Crisp mountain air (8°C - 18°C) with crystal-clear panoramic visibility of Himalayan peaks.',
        whyVisit: 'Apple harvest season across orchards; vibrant golden autumn leaves and minimal crowd congestion.',
        precautions: 'Nights get cold quickly; carry medium woolens and windbreakers.',
        suitableFor: 'Photographers, couples, nature lovers'
      }
    ],
    hospitals: [
      {
        name: 'Civil Hospital Manali (Government 100-Bed Center)',
        address: 'Near Mall Road, Manali, Himachal Pradesh 175131',
        distanceKm: 0.6,
        phone: '+91-1902-252338 / 108',
        emergencyInfo: 'Government emergency facility equipped with 24/7 trauma casualty, high-altitude pulmonary edema stabilization, and ambulance response.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Civil+Hospital+Manali'
      },
      {
        name: 'Lady Willingdon Hospital (Charitable Trust)',
        address: 'Bazar, Old Manali Road, Manali 175131',
        distanceKm: 1.1,
        phone: '+91-1902-252327',
        emergencyInfo: 'Historic missionary surgical hospital with 24/7 emergency medical triage, ICU, and orthopedic trauma services.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lady+Willingdon+Hospital+Manali'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596761224566-34027780362f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['Atal Tunnel Marvel', 'Solang Snow Sports', 'Hadimba Cedar Shrine', 'Beas River Valley']
  },
  {
    id: 'goa-coastal',
    name: 'Panaji & Old Goa Heritage',
    city: 'Goa',
    state: 'Goa',
    tagline: 'Coastal Portuguese colonial enclaves, UNESCO Baroque cathedrals, and serene Mandovi riverfront promenades',
    category: 'Portuguese colonial architecture, Latin quarter havelis, and Arabian Sea coastline',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'LOW',
    riskScore: 32,
    riskHotspot: 'Late night scooter traffic along Candolim-Calangute strip and isolated cliff paths near Fort Aguada post 10:00 PM.',
    visitWindow: 'Late Afternoon to Evening (3:30 PM - 9:30 PM)',
    visitTime: '2 to 3 days',
    totalExpense: '₹4,200 - ₹7,500 / day',
    expenses: [
      { label: 'Boutique Stay / Resort', value: '₹3,400', note: 'Restored Portuguese villa or beachside resort' },
      { label: 'Goan Seafood Meals', value: '₹1,100', note: 'Authentic prawn balchão, fish thali, and bebinca' },
      { label: 'Scooter / Self-Drive', value: '₹500', note: 'Daily rental bike or local pilot taxi' },
      { label: 'Museums & Cruises', value: '₹750', note: 'Old Goa museum passes and Mandovi river cruise' }
    ],
    vehicleOptions: [
      { type: 'Self-Drive Scooter / Car', fare: '₹400 - ₹1,800/day', note: 'Most flexible and widely preferred way to explore beaches and heritage towns across Goa.' },
      { type: 'GoaMiles App Taxi', fare: '₹350 - ₹900', note: 'Official Goa government taxi booking service with fixed rates and GPS tracking.' },
      { type: 'Motorcycle Pilot', fare: '₹80 - ₹180', note: 'Unique licensed two-wheeler motorcycle taxis carrying a single pillion passenger.' }
    ],
    transportOptions: [
      {
        type: 'Bus Station',
        name: 'Kadamba Inter-State Bus Stand (KTC Panaji)',
        terminalAddress: 'Patto Centre, Panaji, Goa 403001',
        fareRange: '₹30 - ₹700',
        pickupInfo: 'Major transit terminus for inter-state buses to Mumbai, Pune, and Bengaluru, as well as airport shuttle buses.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Kadamba+Bus+Stand+Panaji',
        bookingLinks: {
          official: 'https://ktclgoa.com/',
          uber: 'https://m.uber.com/'
        },
        contact: '0832-2438034'
      },
      {
        type: 'Airport',
        name: 'Dabolim International Airport (GOI) / Mopa (GOX)',
        terminalAddress: 'Dabolim, Vasco da Gama, Goa 403801',
        fareRange: '₹800 - ₹1,600 (Pre-paid Airport Taxi)',
        pickupInfo: 'Official pre-paid taxi counters operated by Goa Police are situated right outside the arrival lounge.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Dabolim+Airport+Goa',
        bookingLinks: {
          official: 'https://www.goamiles.com/'
        },
        contact: '0832-2540800'
      }
    ],
    food: [
      { dish: 'Goan Fish Curry Thali', price: '₹240', note: 'Kingfish in spiced coconut curry served with red rice, fried rava fish, and dried prawn kismoor.' },
      { dish: 'Prawn Balchão with Poee', price: '₹380', note: 'Tangy, spicy pickled prawn preparation scooped with traditional Goan wheat leavened bread.' },
      { dish: 'Traditional Bebinca Dessert', price: '₹160', note: 'Seven-layered Indo-Portuguese pudding made from coconut milk, egg yolks, sugar, and nutmeg.' }
    ],
    hotels: [
      {
        name: 'Taj Fort Aguada Resort & Spa',
        address: 'Sinquerim, Candolim, Bardez, Goa 403515',
        priceRange: '₹12,000 - ₹24,000 / night',
        rating: '4.8',
        reviewCount: '4,520 reviews',
        distance: 'Directly adjoining 16th-century Fort Aguada',
        amenities: ['Cliffside Sea View', 'Private Beach Access', 'Jiva Spa', 'Tennis Courts', '24/7 Concierge'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Taj+Fort+Aguada+Goa',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Vivanta Goa, Panaji',
        address: 'Off Dayanand Bandodkar Marg, St. Inez, Panaji, Goa 403001',
        priceRange: '₹5,500 - ₹9,800 / night',
        rating: '4.6',
        reviewCount: '3,110 reviews',
        distance: '0.8 km from Mandovi River Promenade',
        amenities: ['Rooftop Infinity Pool', 'Central Panaji Location', 'Spa', 'Valet Parking', 'Multi-cuisine Dining'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Vivanta+Goa+Panaji',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'The Postcard Velha, Old Goa',
        address: 'Our Lady of Mount, Old Goa, Goa 403402',
        priceRange: '₹8,200 - ₹14,000 / night',
        rating: '4.9',
        reviewCount: '1,120 reviews',
        distance: '1.5 km from Basilica of Bom Jesus',
        amenities: ['Private Forest Haven', 'Personalized Dining', 'Luxury Ayurvedic Spa', 'Bespoke Heritage Walks'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Postcard+Velha+Goa',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Heritage Village Resort & Spa Goa',
        address: 'Arossim Beach Road, Cansaulim, South Goa 403712',
        priceRange: '₹4,800 - ₹8,500 / night',
        rating: '4.5',
        reviewCount: '2,890 reviews',
        distance: '200m from Arossim Beach',
        amenities: ['Portuguese Architecture', 'Ayurvedic Wellness', 'Swimming Pool', 'Live Music', 'All-Inclusive Packages'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Heritage+Village+Resort+Goa',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'Fontainhas Latin Quarter',
        time: '2 - 3 hours',
        bestSlot: 'Late Afternoon (3:30 PM - 6:00 PM)',
        image: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=900&q=80',
        note: 'Asia’s only Latin quarter, filled with pastel yellow and cobalt blue Portuguese villas, red-tiled roofs, and cafes.'
      },
      {
        name: 'Dona Paula Viewpoint & Jetty',
        time: '1 hour',
        bestSlot: 'Sunset (5:30 PM - 7:00 PM)',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
        note: 'Scenic promontory where the Zuari and Mandovi rivers meet the Arabian Sea, famous for coastal sunset views.'
      }
    ],
    heritageSites: [
      {
        id: 'bom-jesus',
        name: 'Basilica of Bom Jesus',
        constructionPeriod: '1594 - 1605 CE (Consecrated by Archbishop Dom Fr. Aleixo de Menezes)',
        location: 'Old Goa Road, Bainguinim, Velha Goa, Goa 403402',
        historicalSignificance: 'One of the oldest churches in India and a landmark of Christian pilgrimage, enshrining the mortal remains of St. Francis Xavier.',
        culturalImportance: 'UNESCO World Heritage Site exhibiting unplastered black basalt Baroque architecture, doric and ionic pilasters, and gilded altars.',
        historySnippet: 'Built by the Jesuit order, it represents the introduction of Mannerist Renaissance architectural principles to the Indian subcontinent.',
        fullHistory: 'Construction of the Basilica of Bom Jesus began in 1594 and was completed in 1605. Dedicated to Infant Jesus, the church holds the silver casket containing the relic body of Saint Francis Xavier, co-founder of the Society of Jesus. The interior features a gilded main altar rising to the ceiling, surmounted by a six-foot statue of St. Ignatius of Loyola. The floor is paved with marble inlaid with precious stones, and the church remains an active place of worship hosting the decennial exposition of sacred relics.',
        visitingInfo: {
          timings: '9:00 AM - 6:30 PM (Sundays 10:30 AM - 6:30 PM)',
          entryFee: 'Free entry for all visitors',
          bestTimeToVisit: 'Morning at 9:30 AM before tourist coach arrivals'
        },
        image: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'se-cathedral',
        name: 'Sé Cathedral de Santa Catarina',
        constructionPeriod: '1562 - 1619 CE (Commissioned by King Sebastian of Portugal)',
        location: 'Velha Goa, Goa 403402 (Across from Basilica of Bom Jesus)',
        historicalSignificance: 'Largest church in Asia, built to commemorate the Portuguese victory under Afonso de Albuquerque over the Muslim army in 1510 on the feast of St. Catherine.',
        culturalImportance: 'Portuguese-Manueline style exterior with Corinthian interior, housing the legendary "Golden Bell" renowned for its resonant chime.',
        historySnippet: 'Originally featured twin towers until one collapsed following a lightning strike in 1776, giving it its distinctive asymmetric profile.',
        fullHistory: 'Commissioned in 1562 under Governor Redondo, the cathedral took over 80 years to construct and was formally consecrated in 1640. The cathedral measures 250 feet in length and 181 feet in breadth. Its 14 side altars display intricately carved woodwork, and the Chapel of the Cross of Miracles is revered for reported apparitions of Christ in 1619.',
        visitingInfo: {
          timings: '7:30 AM - 6:00 PM',
          entryFee: 'Free entry',
          bestTimeToVisit: 'Midday when sunlight filters through the high clerestory windows'
        },
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80'
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'November to February',
        climate: 'Warm sunny days (24°C - 32°C) and cool, pleasant sea breezes (20°C - 23°C).',
        whyVisit: 'Peak season for water sports, beach festivals (Sunburn, Christmas, New Year), and open-air beach dining.',
        precautions: 'High tourist density; reserve beach stays and rental vehicles weeks ahead.',
        suitableFor: 'Beach travelers, parties, international tourists, water sports'
      },
      {
        season: 'Monsoon',
        months: 'June to September',
        climate: 'Heavy tropical monsoon rains, high ocean waves, and dramatic cloud formations.',
        whyVisit: 'Lush green spice plantations; Dudhsagar Falls in full thunderous majesty; serene unhurried pace.',
        precautions: 'Swimming in the Arabian Sea is strictly prohibited by lifeguards due to dangerous rip currents. Avoid rocky headlands during rain.',
        suitableFor: 'Nature lovers, writers, budget wellness seekers, quiet getaways'
      },
      {
        season: 'Summer',
        months: 'March to May',
        climate: 'Warm and humid (28°C - 36°C) with bright coastal sunshine.',
        whyVisit: 'Substantially discounted five-star luxury resort rates and quiet, uncrowded beaches.',
        precautions: 'Apply high-SPF sun protection; schedule beach walks before 10 AM or after 5 PM.',
        suitableFor: 'Budget luxury stays, relaxation, pool retreats'
      },
      {
        season: 'Spring / Autumn',
        months: 'October',
        climate: 'Post-monsoon freshness with warm sunshine (26°C - 33°C).',
        whyVisit: 'Beach shacks start re-opening; clear waters and calm sea for dolphin boat trips.',
        precautions: 'Midday sun can still feel intense.',
        suitableFor: 'Couples, families, cultural travelers'
      }
    ],
    hospitals: [
      {
        name: 'Goa Medical College & Hospital (GMC Apex Trauma)',
        address: 'NH-66, Bambolim, Goa 403202 (Near Panaji)',
        distanceKm: 5.4,
        phone: '+91-832-2458700 / 108',
        emergencyInfo: 'Largest apex government teaching hospital in Goa with 24/7 super-specialty trauma, ICU, neurosurgery, and air ambulance coordination.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Goa+Medical+College+Bambolim'
      },
      {
        name: 'Manipal Hospital Goa',
        address: 'Dr. E. Borges Road, Dona Paula, Panaji, Goa 403004',
        distanceKm: 4.8,
        phone: '+91-832-3048800',
        emergencyInfo: 'NABH-accredited private tertiary care center with 24/7 dedicated emergency casualty, cardiac care, and international tourist desk.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Goa'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['UNESCO Baroque Churches', 'Latin Quarter Fontainhas', 'Dudhsagar Waterfalls', 'Mandovi River Cruises']
  },
  {
    id: 'mumbai-heritage',
    name: 'South Mumbai & Fort Heritage',
    city: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Gothic Victorian architectural splendor, Arabian sea breezes along Marine Drive, and historic Art Deco promenades',
    category: 'Victorian Gothic & Art Deco ensembles, colonial financial district, and coastal promenades',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    oldGlimpse: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    riskLevel: 'LOW',
    riskScore: 35,
    riskHotspot: 'Crowded suburban train interchanges during peak rush hours (8:30 AM - 10:30 AM and 6:00 PM - 8:30 PM).',
    visitWindow: 'Morning or Sunset (4:30 PM - 9:30 PM)',
    visitTime: '1 to 2 days',
    totalExpense: '₹4,500 - ₹8,500 / day',
    expenses: [
      { label: 'Hotel Stay', value: '₹3,800', note: 'South Mumbai heritage stay or boutique business hotel' },
      { label: 'Meals & Street Food', value: '₹950', note: 'Iconic Irani cafes, street vada pav, and coastal seafood' },
      { label: 'Taxi & Metro', value: '₹550', note: 'Metered black-and-yellow Premier Padminis & underground Metro Line 3' },
      { label: 'Museum Passes', value: '₹600', note: 'CSMVS Museum, Elephanta ferry, and heritage walking tours' }
    ],
    vehicleOptions: [
      { type: 'Metered Black & Yellow Taxi (Kaali Peeli)', fare: '₹28 minimum + metered', note: 'Regulated, metered, and available 24/7 on every corner across South Mumbai.' },
      { type: 'Mumbai Metro (Line 3 Aqua & Line 1)', fare: '₹20 - ₹50', note: 'Underground high-speed transit linking Colaba, CSMT, and domestic/international airports.' },
      { type: 'App Cab (Uber / Ola)', fare: '₹200 - ₹600', note: 'Convenient for longer city transit and airport transfers.' }
    ],
    transportOptions: [
      {
        type: 'Railway Terminus',
        name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
        terminalAddress: 'DN Road, Fort, Mumbai, Maharashtra 400001',
        fareRange: '₹10 - ₹2,500 (Suburban local train to express rail)',
        pickupInfo: 'Major railway hub with dedicated prepaid taxi booths outside Platform 1 and Suburban concourse.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=CSMT+Mumbai',
        bookingLinks: {
          official: 'https://www.irctc.co.in/',
          uber: 'https://m.uber.com/',
          ola: 'https://book.olacabs.com/'
        },
        contact: '022-22620173'
      },
      {
        type: 'Airport',
        name: 'Chhatrapati Shivaji Maharaj International Airport (BOM)',
        terminalAddress: 'Sahar, Andheri East, Mumbai 400099',
        fareRange: '₹500 - ₹1,200 (Pre-paid / App Cab to South Mumbai)',
        pickupInfo: 'Multi-level parking pickup booths for Uber, Ola, and pre-paid Black & Yellow taxis at Terminal 2.',
        directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Mumbai+Airport+T2',
        bookingLinks: {
          uber: 'https://m.uber.com/',
          ola: 'https://book.olacabs.com/'
        },
        contact: '022-66851010'
      }
    ],
    food: [
      { dish: 'Bombay Vada Pav & Pav Bhaji', price: '₹120', note: 'Crisp spiced potato patty in butter-toasted bun and slow-mashed spiced vegetable gravy with hot pav.' },
      { dish: 'Irani Bun Maska & Irani Chai', price: '₹90', note: 'Sweet crusty milk buns smothered in butter dipped in sweet cardamom-steeped Irani tea.' },
      { dish: 'Malvani Bombil Fry & Prawn Curry', price: '₹380', note: 'Crispy rava-coated Bombay duck and coconut-kokum fish curry at regional coastal restaurants.' }
    ],
    hotels: [
      {
        name: 'The Taj Mahal Palace, Mumbai',
        address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
        priceRange: '₹18,000 - ₹35,000 / night',
        rating: '4.9',
        reviewCount: '6,890 reviews',
        distance: 'Directly overlooking Gateway of India & Harbour',
        amenities: ['Historic 1903 Heritage Landmark', 'Outdoor Sea Pool', 'World-Class Dining', 'Butler Service', 'High Security'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Taj+Mahal+Palace+Mumbai',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'The Oberoi, Mumbai',
        address: 'Nariman Point, Marine Drive, Mumbai 400021',
        priceRange: '₹14,000 - ₹28,000 / night',
        rating: '4.8',
        reviewCount: '4,120 reviews',
        distance: 'Direct views of Marine Drive Queen’s Necklace',
        amenities: ['Panoramic Arabian Sea Views', 'Michelin Standard Dining', 'Luxury Spa', 'Heated Pool', 'Doctor on Call'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=The+Oberoi+Mumbai',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Trident Nariman Point',
        address: 'CR 2 Nariman Point, Marine Drive, Mumbai 400021',
        priceRange: '₹8,500 - ₹15,000 / night',
        rating: '4.6',
        reviewCount: '5,240 reviews',
        distance: 'Directly on Marine Drive promenade',
        amenities: ['Sea View Rooms', '24/7 Fitness Center', 'Business Center', 'Concierge Desk', 'Valet Parking'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Trident+Nariman+Point+Mumbai',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80'
      },
      {
        name: 'Residency Hotel Fort',
        address: '26, Rustom Sidhwa Marg, Fort, Mumbai 400001',
        priceRange: '₹4,200 - ₹6,800 / night',
        rating: '4.4',
        reviewCount: '2,650 reviews',
        distance: '0.4 km from CSMT Station',
        amenities: ['Central Fort Heritage Hub', 'Buffet Breakfast', 'Airport Transfer', 'High-Speed Wi-Fi', '24/7 Desk'],
        bookingUrl: 'https://www.booking.com/searchresults.html?ss=Residency+Hotel+Fort+Mumbai',
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80'
      }
    ],
    places: [
      {
        name: 'Marine Drive & Queen’s Necklace',
        time: '1 - 2 hours',
        bestSlot: 'Sunset to Night (6:00 PM - 10:00 PM)',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80',
        note: '3.6 km arc along the coast with Art Deco promenades, gentle sea breezes, and stunning night lighting.'
      },
      {
        name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)',
        time: '2 - 3 hours',
        bestSlot: 'Morning (10:30 AM - 1:30 PM)',
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=900&q=80',
        note: 'Premier arts and history museum housed in a majestic Indo-Saracenic palace surrounded by lush palm gardens.'
      }
    ],
    heritageSites: [
      {
        id: 'gateway-of-india',
        name: 'Gateway of India',
        constructionPeriod: '1911 - 1924 CE (Architect: George Wittet)',
        location: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
        historicalSignificance: 'Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in 1911, and the symbolic exit point of the last British troops (First Battalion, Somerset Light Infantry) in 1948.',
        culturalImportance: 'Indo-Saracenic basalt triumphal arch incorporating 16th-century Gujarati Muslim architectural elements with European triumphal design.',
        historySnippet: 'Built of yellow basalt stone quarried from Kharodi with perforated jali screens reflecting Hindu and Muslim traditions.',
        fullHistory: 'The Gateway of India was designed by Scottish architect George Wittet and sanctioned in 1914, with construction completed in 1924 by Gammon India. The central dome is 48 feet in diameter and reaches 83 feet into the sky. Situated at the water’s edge overlooking the Arabian Sea, it serves as the passenger ferry terminal to Elephanta Island caves and remains Mumbai’s most iconic civic monument.',
        visitingInfo: {
          timings: 'Open 24 hours (Monument illuminated until 11:00 PM)',
          entryFee: 'Free entry',
          bestTimeToVisit: 'Sunrise (6:30 AM) or sunset when Arabian sea boats bob in the harbor'
        },
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'csmt-station',
        name: 'Chhatrapati Shivaji Maharaj Terminus (formerly Victoria Terminus)',
        constructionPeriod: '1878 - 1887 CE (Architect: Frederick William Stevens)',
        location: 'DN Road, Fort, Mumbai 400001',
        historicalSignificance: 'UNESCO World Heritage Site commemorating Queen Victoria’s Golden Jubilee in 1887; headquarters of the Central Railway of India.',
        culturalImportance: 'Outstanding fusion of Victorian Italianate Gothic Revival architecture with traditional Indian palace stonecraft, turrets, pointed arches, and gargoyles.',
        historySnippet: 'Features a central ribbed octagonal masonry dome topped with a colossal four-meter statue of Progress holding a torch.',
        fullHistory: 'Designed by consulting architect Frederick William Stevens in 1878, the station took ten years to build at a cost of £260,000. Indian master craftsmen worked alongside British architects to produce intricate wood carvings, tiles, ornate iron grilles, and balustrades. Inscribed as a UNESCO World Heritage Site in 2004, it handles over 3 million commuters daily.',
        visitingInfo: {
          timings: 'Active rail hub 24 hours (Heritage gallery tours 2:00 PM - 5:00 PM on weekdays)',
          entryFee: '₹10 for platform pass / Heritage Museum: ₹100',
          bestTimeToVisit: 'Night viewing at 8:00 PM when exterior facade illumination reveals architectural details'
        },
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=900&q=80'
      }
    ],
    seasonalGuide: [
      {
        season: 'Winter',
        months: 'November to February',
        climate: 'Mild, dry, and pleasant (18°C - 30°C) with refreshing sea breezes.',
        whyVisit: 'Finest weather for walking tours through Fort, Kala Ghoda Arts Festival in February, and sunset strolls along Marine Drive.',
        precautions: 'Minimal precautions; carry light evening wrap.',
        suitableFor: 'All travelers, heritage walking, culinary trails'
      },
      {
        season: 'Monsoon',
        months: 'June to September',
        climate: 'Heavy tropical downpours (26°C - 31°C) with roaring Arabian Sea waves crashing against sea walls.',
        whyVisit: 'Dramatic sea views at Marine Drive and Bandstand; piping hot roasted corn on the cob (bhutta).',
        precautions: 'Check tide timings; do not stand on sea walls during high tide warnings. Carry strong umbrella; suburban trains can face water delays.',
        suitableFor: 'Monsoon lovers, cafe hoppers, indoor museums'
      },
      {
        season: 'Summer',
        months: 'March to May',
        climate: 'Humid and warm (28°C - 35°C).',
        whyVisit: 'Alphonso mango season; late-night coastal strolls are pleasant when cool sea winds blow.',
        precautions: 'Stay hydrated; plan outdoor activities before 10 AM or after 5 PM.',
        suitableFor: 'Nightlife, indoor shopping, early morning tours'
      },
      {
        season: 'Spring / Autumn',
        months: 'October',
        climate: 'Warm and sunny with clear blue skies (25°C - 33°C).',
        whyVisit: 'Great visibility for harbour ferry rides to Elephanta Caves.',
        precautions: 'Midday sunshine is strong; carry sunglasses.',
        suitableFor: 'Couples, families, photography'
      }
    ],
    hospitals: [
      {
        name: 'Bombay Hospital & Medical Research Centre',
        address: '12, Marine Lines, Mumbai, Maharashtra 400020',
        distanceKm: 1.2,
        phone: '+91-22-22067676 / 108',
        emergencyInfo: '830-bed premier tertiary care hospital with 24/7 dedicated cardiac ICU, neuro-trauma casualty, and multilingual emergency coordination.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bombay+Hospital+Marine+Lines'
      },
      {
        name: "St. George's Hospital (Government Teaching Hospital)",
        address: 'P D’Mello Road, Fort, Mumbai 400001 (Adjacent to CSMT)',
        distanceKm: 0.3,
        phone: '+91-22-22620242',
        emergencyInfo: 'Government emergency facility providing 24/7 immediate trauma casualty, burns triage, and ambulance dispatch in South Mumbai.',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=St+Georges+Hospital+Mumbai'
      }
    ],
    glimpses: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: ['UNESCO CSMT Architecture', 'Marine Drive Queen’s Necklace', 'Gateway of India', 'Art Deco Precinct']
  }
];

export function findDestinationProfiles(query: string): DestinationProfile[] {
  if (!query || !query.trim()) return DESTINATION_PROFILES;
  const q = query.trim().toLowerCase();

  const directMatches = DESTINATION_PROFILES.filter((profile) =>
    profile.city.toLowerCase() === q ||
    profile.name.toLowerCase().includes(q) ||
    profile.city.toLowerCase().includes(q) ||
    q.includes(profile.city.toLowerCase()) ||
    q.includes(profile.name.toLowerCase()) ||
    (profile.state && profile.state.toLowerCase().includes(q))
  );

  return directMatches;
}

export function getDestinationProfile(query: string): DestinationProfile | null {
  const matches = findDestinationProfiles(query);
  return matches.length > 0 ? matches[0] : null;
}
