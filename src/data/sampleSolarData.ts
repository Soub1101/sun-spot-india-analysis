
// Sample data for import feature demonstration

export const sampleLocationData = [
  {
    "name": "Chennai",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "ghi": 5.8,
    "dni": 6.2,
    "latitude": 13.0827,
    "longitude": 80.2707
  },
  {
    "name": "Coimbatore",
    "state": "Tamil Nadu",
    "district": "Coimbatore",
    "ghi": 5.6,
    "dni": 5.9,
    "latitude": 11.0168,
    "longitude": 76.9558
  },
  {
    "name": "Bengaluru",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "ghi": 5.5,
    "dni": 5.8,
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  {
    "name": "Hyderabad",
    "state": "Telangana",
    "district": "Hyderabad",
    "ghi": 5.9,
    "dni": 6.1,
    "latitude": 17.3850,
    "longitude": 78.4867
  },
  {
    "name": "Jaipur",
    "state": "Rajasthan",
    "district": "Jaipur",
    "ghi": 6.2,
    "dni": 6.5,
    "latitude": 26.9124,
    "longitude": 75.7873
  }
];

// Function to generate sample CSV content
export const generateSampleCSV = (): string => {
  const headers = ["name", "state", "district", "ghi", "dni", "latitude", "longitude"];
  const rows = sampleLocationData.map(location => {
    return headers.map(header => location[header as keyof typeof location]).join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
};

// Function to download sample data as CSV
export const downloadSampleData = (): void => {
  const csvContent = generateSampleCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_solar_data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to download sample data as JSON
export const downloadSampleDataJSON = (): void => {
  const jsonContent = JSON.stringify(sampleLocationData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_solar_data.json');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
