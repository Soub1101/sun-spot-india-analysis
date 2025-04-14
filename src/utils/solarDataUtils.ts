
// Utility functions for solar data processing

// Define solar radiation categories
export const getRadiationCategory = (value: number) => {
  if (value > 800) return { label: "Excellent", color: "text-green-500" };
  if (value > 600) return { label: "Good", color: "text-blue-500" };
  if (value > 400) return { label: "Moderate", color: "text-yellow-500" };
  if (value > 200) return { label: "Poor", color: "text-orange-500" };
  return { label: "Very Poor", color: "text-red-500" };
};

// Convert NREL data to hourly radiation data
export const convertToHourlyData = (location: any) => {
  const baseGHI = location.ghi * 1000; // Convert from kWh/m²/day to W/m²
  const baseDNI = location.dni * 1000;
  const data = [];
  
  // Generate data for past 12 hours
  const currentHour = new Date().getHours();
  
  for (let i = 0; i < 12; i++) {
    const hour = (currentHour - 11 + i) % 24;
    const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    
    // Generate semi-realistic solar radiation curve
    let radiationFactor = 0;
    if (hour >= 6 && hour <= 18) {
      // Daytime curve (bell shape)
      const midPoint = 12;
      const distance = Math.abs(hour - midPoint);
      radiationFactor = 1 - (distance / 8) ** 2;
    }
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    data.push({
      time: timeLabel,
      ghi: Math.round(baseGHI * radiationFactor * randomFactor),
      dni: Math.round(baseDNI * radiationFactor * randomFactor * 0.9),
    });
  }
  
  return data;
};

// Generate state distribution data
export const generateStateDistribution = (locations: any[]) => {
  const stateData: Record<string, number> = {};
  
  locations.forEach(location => {
    if (stateData[location.state]) {
      stateData[location.state] += location.capacityMW || 0;
    } else {
      stateData[location.state] = location.capacityMW || 0;
    }
  });
  
  // Convert to array and sort by capacity
  return Object.entries(stateData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 states
};

// Generate monthly data for a location
export const generateMonthlyData = (location: any) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseGHI = location.ghi;
  const baseDNI = location.dni;
  
  // Seasonality factors by month (northern hemisphere)
  const seasonalityFactors = [0.7, 0.8, 0.9, 1.1, 1.2, 1.1, 0.9, 0.8, 0.9, 0.8, 0.7, 0.6];
  
  return months.map((month, index) => ({
    month,
    GHI: Math.round(baseGHI * seasonalityFactors[index] * 100) / 100,
    DNI: Math.round(baseDNI * seasonalityFactors[index] * 100) / 100,
  }));
};

// Download data as CSV
export const downloadCSV = (data: any[], filename: string, toast: any) => {
  if (!data || !data.length) {
    toast({
      title: "No data to download",
      description: "Please ensure data is loaded before downloading",
      variant: "destructive",
    });
    return;
  }
  
  // Create CSV headers from first row keys
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header];
        // Handle strings with commas by quoting them
        if (typeof cell === 'string' && cell.includes(',')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ];
  
  // Create and download blob
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast({
    title: "Data downloaded successfully",
    description: `Data has been downloaded as ${filename}`,
  });
};

// Get weather description based on current radiation
export const getWeatherDescription = (currentRadiation: number) => {
  if (currentRadiation > 700) return "Sunny, clear skies";
  if (currentRadiation > 500) return "Partly cloudy";
  if (currentRadiation > 300) return "Mostly cloudy";
  return "Overcast conditions";
};
