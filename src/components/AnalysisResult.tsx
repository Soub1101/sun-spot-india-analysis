
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

interface AnalysisResultProps {
  data: any[];
  fileName: string;
  onSave?: () => void;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", 
  "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"
];

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, fileName, onSave }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-gray-500">
            <p>No data available for analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average solar values
  const calculateAverages = () => {
    let totalGHI = 0;
    let totalDNI = 0;
    let totalScore = 0;
    let count = 0;

    data.forEach(item => {
      if (item.ghi && item.dni) {
        totalGHI += parseFloat(item.ghi);
        totalDNI += parseFloat(item.dni);
        if (item.solarScore) {
          totalScore += parseFloat(item.solarScore);
        }
        count++;
      }
    });

    return {
      avgGHI: count > 0 ? (totalGHI / count).toFixed(2) : 0,
      avgDNI: count > 0 ? (totalDNI / count).toFixed(2) : 0,
      avgScore: count > 0 ? (totalScore / count).toFixed(0) : 0,
      count
    };
  };

  // Prepare data for state distribution chart
  const prepareStateDistribution = () => {
    const stateData: Record<string, number> = {};
    
    data.forEach(item => {
      if (item.state) {
        if (stateData[item.state]) {
          stateData[item.state]++;
        } else {
          stateData[item.state] = 1;
        }
      }
    });
    
    return Object.entries(stateData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Prepare data for GHI comparison chart
  const prepareGHIComparison = () => {
    return data.slice(0, 8).map(item => ({
      name: item.name || "Unknown",
      ghi: parseFloat(item.ghi) || 0,
      dni: parseFloat(item.dni) || 0
    }));
  };

  const averages = calculateAverages();
  const stateDistribution = prepareStateDistribution();
  const ghiComparison = prepareGHIComparison();

  // Generate a simple score based on the data
  const generateScore = () => {
    if (averages.avgGHI > 5.5 && averages.avgDNI > 6.0) {
      return { score: 85, label: "Excellent", color: "text-green-500" };
    } else if (averages.avgGHI > 5.0 && averages.avgDNI > 5.5) {
      return { score: 75, label: "Very Good", color: "text-green-400" };
    } else if (averages.avgGHI > 4.5 && averages.avgDNI > 5.0) {
      return { score: 65, label: "Good", color: "text-blue-500" };
    } else if (averages.avgGHI > 4.0 && averages.avgDNI > 4.5) {
      return { score: 55, label: "Moderate", color: "text-yellow-500" };
    } else if (averages.avgGHI > 3.5 && averages.avgDNI > 4.0) {
      return { score: 45, label: "Fair", color: "text-orange-500" };
    } else {
      return { score: 35, label: "Poor", color: "text-red-500" };
    }
  };

  const solarScore = averages.avgScore > 0 
    ? { score: averages.avgScore, label: averages.avgScore > 80 ? "Excellent" : averages.avgScore > 70 ? "Very Good" : averages.avgScore > 60 ? "Good" : averages.avgScore > 50 ? "Moderate" : averages.avgScore > 40 ? "Fair" : "Poor", color: averages.avgScore > 80 ? "text-green-500" : averages.avgScore > 70 ? "text-green-400" : averages.avgScore > 60 ? "text-blue-500" : averages.avgScore > 50 ? "text-yellow-500" : averages.avgScore > 40 ? "text-orange-500" : "text-red-500" }
    : generateScore();

  // Download analyzed data as JSON
  const downloadAnalysis = () => {
    const analysisData = {
      fileName,
      dataPoints: data.length,
      averages,
      solarScore,
      stateDistribution,
      data
    };

    const jsonString = JSON.stringify(analysisData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis_${fileName.replace(/\.\w+$/, "")}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Analysis downloaded",
      description: "Your data analysis has been downloaded as JSON",
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analysis Result: {fileName}</h2>
        <div className="flex gap-2">
          {onSave && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onSave}
            >
              <Star className="h-4 w-4 text-yellow-500" />
              Save Analysis
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={downloadAnalysis}
          >
            <FileDown className="h-4 w-4" />
            Download Analysis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Analyzed Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.length}</div>
            <p className="text-xs text-gray-500">From {fileName}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Solar Radiation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">GHI:</span>
                <span className="font-bold">{averages.avgGHI} kWh/m²/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">DNI:</span>
                <span className="font-bold">{averages.avgDNI} kWh/m²/day</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solar Suitability Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{solarScore.score}/100</div>
            <p className={`text-sm ${solarScore.color}`}>{solarScore.label}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stateDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stateDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} locations`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Solar Radiation Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ghiComparison}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis label={{ value: 'kWh/m²/day', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ghi" name="GHI" fill="#FFB800" />
                  <Bar dataKey="dni" name="DNI" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-700">Analysis Summary</h3>
        <p className="mt-2 text-sm text-blue-700">
          Based on the analysis of {data.length} data points from {fileName}, the average solar radiation potential is {solarScore.label.toLowerCase()}.
          {solarScore.score > 70 ? 
            " The data shows excellent solar potential, making these locations ideal for solar installations with high energy yield expectations." :
           solarScore.score > 60 ?
            " The data shows good solar potential. Most locations would be suitable for solar installations with proper planning." :
           solarScore.score > 50 ?
            " The data shows moderate solar potential. Installations are viable but may require optimization for maximum efficiency." :
            " The data shows limited solar potential. Careful planning and possibly higher-efficiency panels would be needed for viable installations."
          }
        </p>
            
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-blue-700">Recommendation</p>
            <p className="text-sm text-blue-700">
              {solarScore.score > 70 ? 
                "Proceed with high confidence. These locations are well-suited for both utility-scale and rooftop solar installations." :
              solarScore.score > 60 ?
                "Proceed with good confidence. Focus on optimal panel orientation and consider seasonal variations." :
              solarScore.score > 50 ?
                "Proceed with caution. Detailed site assessments and high-efficiency equipment are recommended." :
                "Consider alternatives or conduct more detailed feasibility studies before proceeding."
              }
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700">Next Steps</p>
            <p className="text-sm text-blue-700">
              Review individual location data for site-specific recommendations and consider conducting shading analysis for selected locations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
