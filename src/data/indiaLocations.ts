
// Comprehensive India solar data based on NREL and other Indian solar databases
// Data includes GHI (Global Horizontal Irradiance), DNI (Direct Normal Irradiance)
// and calculated solar scores for states and districts across India

interface LocationData {
  id: string;
  name: string;
  state: string;
  district?: string;
  sector?: string;
  ghi: number; // kWh/m²/day
  dni: number; // kWh/m²/day
  latitude: number;
  longitude: number;
  solarScore: number; // 0-100 score
  capacityMW?: number;
  generationMWh?: number;
  monthlyData?: {
    month: string;
    ghi: number;
    dni: number;
  }[];
}

const indiaLocations: LocationData[] = [
  // Northern India
  {
    id: "delhi-1",
    name: "New Delhi",
    state: "Delhi",
    district: "New Delhi",
    ghi: 5.2,
    dni: 5.7,
    latitude: 28.6139,
    longitude: 77.2090,
    solarScore: 73,
    capacityMW: 2000,
    generationMWh: 3200000
  },
  
  // Rajasthan - High solar potential
  {
    id: "jodhpur-1",
    name: "Jodhpur",
    state: "Rajasthan",
    district: "Jodhpur",
    ghi: 6.1,
    dni: 6.8,
    latitude: 26.2389,
    longitude: 73.0243,
    solarScore: 88,
    capacityMW: 5000,
    generationMWh: 8500000
  },
  {
    id: "jaisalmer-1",
    name: "Jaisalmer",
    state: "Rajasthan",
    district: "Jaisalmer",
    ghi: 6.3,
    dni: 7.0,
    latitude: 26.9157,
    longitude: 70.9083,
    solarScore: 91,
    capacityMW: 5500,
    generationMWh: 9200000
  },
  {
    id: "bikaner-1",
    name: "Bikaner",
    state: "Rajasthan",
    district: "Bikaner",
    ghi: 6.0,
    dni: 6.7,
    latitude: 28.0229,
    longitude: 73.3119,
    solarScore: 86,
    capacityMW: 4700,
    generationMWh: 8000000
  },
  {
    id: "barmer-1",
    name: "Barmer",
    state: "Rajasthan",
    district: "Barmer",
    ghi: 6.2,
    dni: 6.9,
    latitude: 25.7521,
    longitude: 71.3967,
    solarScore: 89,
    capacityMW: 5200,
    generationMWh: 8800000
  },
  {
    id: "jaipur-1",
    name: "Jaipur",
    state: "Rajasthan",
    district: "Jaipur",
    ghi: 5.9,
    dni: 6.5,
    latitude: 26.9124,
    longitude: 75.7873,
    solarScore: 84,
    capacityMW: 4400,
    generationMWh: 7500000
  },
  
  // Gujarat - High solar potential
  {
    id: "kutch-1",
    name: "Kutch",
    state: "Gujarat",
    district: "Kutch",
    ghi: 6.0,
    dni: 6.6,
    latitude: 23.7337,
    longitude: 69.8597,
    solarScore: 87,
    capacityMW: 4900,
    generationMWh: 8300000
  },
  {
    id: "ahmedabad-1",
    name: "Ahmedabad",
    state: "Gujarat",
    district: "Ahmedabad",
    ghi: 5.8,
    dni: 6.3,
    latitude: 23.0225,
    longitude: 72.5714,
    solarScore: 82,
    capacityMW: 4200,
    generationMWh: 7100000
  },
  {
    id: "surat-1",
    name: "Surat",
    state: "Gujarat",
    district: "Surat",
    ghi: 5.6,
    dni: 6.1,
    latitude: 21.1702,
    longitude: 72.8311,
    solarScore: 79,
    capacityMW: 3800,
    generationMWh: 6500000
  },
  {
    id: "banaskantha-1",
    name: "Banaskantha",
    state: "Gujarat",
    district: "Banaskantha",
    ghi: 5.9,
    dni: 6.5,
    latitude: 24.1722,
    longitude: 72.3693,
    solarScore: 85,
    capacityMW: 4500,
    generationMWh: 7700000
  },
  
  // Maharashtra
  {
    id: "pune-1",
    name: "Pune",
    state: "Maharashtra",
    district: "Pune",
    ghi: 5.6,
    dni: 6.0,
    latitude: 18.5204,
    longitude: 73.8567,
    solarScore: 78,
    capacityMW: 3700,
    generationMWh: 6300000
  },
  {
    id: "nagpur-1",
    name: "Nagpur",
    state: "Maharashtra",
    district: "Nagpur",
    ghi: 5.7,
    dni: 6.2,
    latitude: 21.1458,
    longitude: 79.0882,
    solarScore: 80,
    capacityMW: 4000,
    generationMWh: 6800000
  },
  {
    id: "mumbai-1",
    name: "Mumbai",
    state: "Maharashtra",
    district: "Mumbai",
    ghi: 5.5,
    dni: 5.9,
    latitude: 19.0760,
    longitude: 72.8777,
    solarScore: 76,
    capacityMW: 3400,
    generationMWh: 5800000
  },
  
  // Tamil Nadu - Additional cities
  {
    id: "chennai-1",
    name: "Chennai",
    state: "Tamil Nadu",
    district: "Chennai",
    ghi: 5.4,
    dni: 5.7,
    latitude: 13.0827,
    longitude: 80.2707,
    solarScore: 74,
    capacityMW: 3100,
    generationMWh: 5300000
  },
  {
    id: "ramanathapuram-1",
    name: "Ramanathapuram",
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    ghi: 5.8,
    dni: 6.3,
    latitude: 9.3639,
    longitude: 78.8395,
    solarScore: 83,
    capacityMW: 4300,
    generationMWh: 7300000
  },
  {
    id: "tuticorin-1",
    name: "Tuticorin",
    state: "Tamil Nadu",
    district: "Tuticorin",
    ghi: 5.7,
    dni: 6.2,
    latitude: 8.7642,
    longitude: 78.1348,
    solarScore: 81,
    capacityMW: 4100,
    generationMWh: 7000000
  },
  // New Tamil Nadu cities
  {
    id: "madurai-1",
    name: "Madurai",
    state: "Tamil Nadu",
    district: "Madurai",
    ghi: 5.6,
    dni: 6.0,
    latitude: 9.9252,
    longitude: 78.1198,
    solarScore: 78,
    capacityMW: 3700,
    generationMWh: 6300000
  },
  {
    id: "coimbatore-1",
    name: "Coimbatore",
    state: "Tamil Nadu",
    district: "Coimbatore",
    ghi: 5.5,
    dni: 5.9,
    latitude: 11.0168,
    longitude: 76.9558,
    solarScore: 76,
    capacityMW: 3500,
    generationMWh: 5900000
  },
  {
    id: "salem-1",
    name: "Salem",
    state: "Tamil Nadu",
    district: "Salem",
    ghi: 5.7,
    dni: 6.1,
    latitude: 11.6643,
    longitude: 78.1460,
    solarScore: 79,
    capacityMW: 3900,
    generationMWh: 6600000
  },
  {
    id: "tirunelveli-1",
    name: "Tirunelveli",
    state: "Tamil Nadu",
    district: "Tirunelveli",
    ghi: 5.8,
    dni: 6.2,
    latitude: 8.7139,
    longitude: 77.7567,
    solarScore: 80,
    capacityMW: 4000,
    generationMWh: 6800000
  },
  
  // Karnataka
  {
    id: "bangalore-1",
    name: "Bangalore",
    state: "Karnataka",
    district: "Bangalore Urban",
    ghi: 5.5,
    dni: 5.9,
    latitude: 12.9716,
    longitude: 77.5946,
    solarScore: 76,
    capacityMW: 3500,
    generationMWh: 5900000
  },
  {
    id: "tumkur-1",
    name: "Tumkur",
    state: "Karnataka",
    district: "Tumkur",
    ghi: 5.6,
    dni: 6.0,
    latitude: 13.3379,
    longitude: 77.1173,
    solarScore: 78,
    capacityMW: 3700,
    generationMWh: 6300000
  },
  {
    id: "kolar-1",
    name: "Kolar",
    state: "Karnataka",
    district: "Kolar",
    ghi: 5.7,
    dni: 6.1,
    latitude: 13.1357,
    longitude: 78.1326,
    solarScore: 79,
    capacityMW: 3800,
    generationMWh: 6500000
  },
  
  // Andhra Pradesh
  {
    id: "kadapa-1",
    name: "Kadapa",
    state: "Andhra Pradesh",
    district: "Kadapa",
    ghi: 5.8,
    dni: 6.3,
    latitude: 14.4674,
    longitude: 78.8235,
    solarScore: 82,
    capacityMW: 4200,
    generationMWh: 7100000
  },
  {
    id: "anantapur-1",
    name: "Anantapur",
    state: "Andhra Pradesh",
    district: "Anantapur",
    ghi: 5.9,
    dni: 6.4,
    latitude: 14.6819,
    longitude: 77.6006,
    solarScore: 84,
    capacityMW: 4400,
    generationMWh: 7500000
  },
  
  // Telangana
  {
    id: "hyderabad-1",
    name: "Hyderabad",
    state: "Telangana",
    district: "Hyderabad",
    ghi: 5.6,
    dni: 6.0,
    latitude: 17.3850,
    longitude: 78.4867,
    solarScore: 77,
    capacityMW: 3600,
    generationMWh: 6100000
  },

  // Madhya Pradesh - Adding Indore
  {
    id: "bhopal-1",
    name: "Bhopal",
    state: "Madhya Pradesh",
    district: "Bhopal",
    ghi: 5.7,
    dni: 6.2,
    latitude: 23.2599,
    longitude: 77.4126,
    solarScore: 80,
    capacityMW: 4000,
    generationMWh: 6800000
  },
  {
    id: "neemuch-1",
    name: "Neemuch",
    state: "Madhya Pradesh",
    district: "Neemuch",
    ghi: 5.9,
    dni: 6.5,
    latitude: 24.4736,
    longitude: 74.8700,
    solarScore: 84,
    capacityMW: 4400,
    generationMWh: 7500000
  },
  {
    id: "indore-1",
    name: "Indore",
    state: "Madhya Pradesh",
    district: "Indore",
    ghi: 5.8,
    dni: 6.3,
    latitude: 22.7196,
    longitude: 75.8577,
    solarScore: 82,
    capacityMW: 4200,
    generationMWh: 7100000
  },
  {
    id: "ujjain-1",
    name: "Ujjain",
    state: "Madhya Pradesh",
    district: "Ujjain",
    ghi: 5.7,
    dni: 6.2,
    latitude: 23.1765,
    longitude: 75.7885,
    solarScore: 80,
    capacityMW: 4000,
    generationMWh: 6800000
  },
  {
    id: "gwalior-1",
    name: "Gwalior",
    state: "Madhya Pradesh",
    district: "Gwalior",
    ghi: 5.6,
    dni: 6.1,
    latitude: 26.2183,
    longitude: 78.1828,
    solarScore: 78,
    capacityMW: 3700,
    generationMWh: 6300000
  },
  
  // Uttar Pradesh
  {
    id: "lucknow-1",
    name: "Lucknow",
    state: "Uttar Pradesh",
    district: "Lucknow",
    ghi: 5.3,
    dni: 5.7,
    latitude: 26.8467,
    longitude: 80.9462,
    solarScore: 73,
    capacityMW: 3100,
    generationMWh: 5300000
  },
  
  // West Bengal - Adding more cities
  {
    id: "kolkata-1",
    name: "Kolkata",
    state: "West Bengal",
    district: "Kolkata",
    ghi: 5.0,
    dni: 5.3,
    latitude: 22.5726,
    longitude: 88.3639,
    solarScore: 68,
    capacityMW: 2700,
    generationMWh: 4600000
  },
  {
    id: "siliguri-1",
    name: "Siliguri",
    state: "West Bengal",
    district: "Darjeeling",
    ghi: 4.9,
    dni: 5.2,
    latitude: 26.7271,
    longitude: 88.3953,
    solarScore: 67,
    capacityMW: 2600,
    generationMWh: 4400000
  },
  {
    id: "asansol-1",
    name: "Asansol",
    state: "West Bengal",
    district: "Paschim Bardhaman",
    ghi: 5.1,
    dni: 5.4,
    latitude: 23.6889,
    longitude: 86.9661,
    solarScore: 70,
    capacityMW: 2900,
    generationMWh: 4900000
  },
  {
    id: "durgapur-1",
    name: "Durgapur",
    state: "West Bengal",
    district: "Paschim Bardhaman",
    ghi: 5.0,
    dni: 5.3,
    latitude: 23.5204,
    longitude: 87.3119,
    solarScore: 69,
    capacityMW: 2800,
    generationMWh: 4700000
  },
  {
    id: "darjeeling-1",
    name: "Darjeeling",
    state: "West Bengal",
    district: "Darjeeling",
    ghi: 4.7,
    dni: 5.0,
    latitude: 27.0410,
    longitude: 88.2663,
    solarScore: 64,
    capacityMW: 2400,
    generationMWh: 4100000
  },
  
  // Bihar
  {
    id: "patna-1",
    name: "Patna",
    state: "Bihar",
    district: "Patna",
    ghi: 5.1,
    dni: 5.4,
    latitude: 25.5941,
    longitude: 85.1376,
    solarScore: 70,
    capacityMW: 2900,
    generationMWh: 4900000
  },
  
  // Punjab
  {
    id: "amritsar-1",
    name: "Amritsar",
    state: "Punjab",
    district: "Amritsar",
    ghi: 5.2,
    dni: 5.6,
    latitude: 31.6340,
    longitude: 74.8723,
    solarScore: 72,
    capacityMW: 3000,
    generationMWh: 5100000
  },
  
  // Haryana
  {
    id: "gurgaon-1",
    name: "Gurgaon",
    state: "Haryana",
    district: "Gurgaon",
    ghi: 5.3,
    dni: 5.8,
    latitude: 28.4595,
    longitude: 77.0266,
    solarScore: 74,
    capacityMW: 3200,
    generationMWh: 5400000
  },
  
  // Kerala
  {
    id: "thiruvananthapuram-1",
    name: "Thiruvananthapuram",
    state: "Kerala",
    district: "Thiruvananthapuram",
    ghi: 5.3,
    dni: 5.7,
    latitude: 8.5241,
    longitude: 76.9366,
    solarScore: 73,
    capacityMW: 3100,
    generationMWh: 5300000
  },

  // North East Region
  {
    id: "guwahati-1",
    name: "Guwahati",
    state: "Assam",
    district: "Kamrup Metropolitan",
    ghi: 4.8,
    dni: 5.0,
    latitude: 26.1445,
    longitude: 91.7362,
    solarScore: 63,
    capacityMW: 2300,
    generationMWh: 3900000
  },
  
  // Jammu & Kashmir
  {
    id: "leh-1",
    name: "Leh",
    state: "Ladakh",
    district: "Leh",
    ghi: 5.9,
    dni: 6.5,
    latitude: 34.1526,
    longitude: 77.5771,
    solarScore: 85,
    capacityMW: 4500,
    generationMWh: 7700000
  },
  
  // Chhattisgarh
  {
    id: "raipur-1",
    name: "Raipur",
    state: "Chhattisgarh",
    district: "Raipur",
    ghi: 5.5,
    dni: 6.0,
    latitude: 21.2514,
    longitude: 81.6296,
    solarScore: 77,
    capacityMW: 3600,
    generationMWh: 6100000
  },
  
  // Odisha
  {
    id: "bhubaneswar-1",
    name: "Bhubaneswar",
    state: "Odisha",
    district: "Khordha",
    ghi: 5.3,
    dni: 5.7,
    latitude: 20.2961,
    longitude: 85.8245,
    solarScore: 74,
    capacityMW: 3200,
    generationMWh: 5400000
  }
];

export default indiaLocations;
