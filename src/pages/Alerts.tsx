
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: "warning" | "info" | "success" | "error";
  date: string;
  read: boolean;
}

const alertsData: Alert[] = [
  {
    id: "1",
    title: "Weather Alert",
    description: "Heavy cloud cover expected over Mumbai tomorrow. Solar generation may be reduced by 30%.",
    type: "warning",
    date: "2025-04-12",
    read: false,
  },
  {
    id: "2",
    title: "Optimal Radiation",
    description: "Solar radiation in Rajasthan is at peak levels. Excellent time for maximum generation.",
    type: "success",
    date: "2025-04-11",
    read: false,
  },
  {
    id: "3",
    title: "System Update",
    description: "New solar data has been added for 15 additional locations across India.",
    type: "info",
    date: "2025-04-10",
    read: true,
  },
  {
    id: "4",
    title: "Panel Maintenance",
    description: "Time to check and clean solar panels before the monsoon season.",
    type: "info",
    date: "2025-04-09",
    read: true,
  },
  {
    id: "5",
    title: "Data Error",
    description: "Unable to fetch live solar radiation data for Chennai. Using estimated values.",
    type: "error",
    date: "2025-04-08",
    read: true,
  },
];

const getAlertBgColor = (type: Alert["type"], read: boolean) => {
  if (read) return "bg-gray-50";
  
  switch (type) {
    case "warning": return "bg-yellow-50";
    case "info": return "bg-blue-50";
    case "success": return "bg-green-50";
    case "error": return "bg-red-50";
    default: return "bg-gray-50";
  }
};

const getAlertIconColor = (type: Alert["type"]) => {
  switch (type) {
    case "warning": return "text-yellow-500";
    case "info": return "text-blue-500";
    case "success": return "text-green-500";
    case "error": return "text-red-500";
    default: return "text-gray-500";
  }
};

const AlertIcon: React.FC<{ type: Alert["type"] }> = ({ type }) => {
  const className = `h-5 w-5 ${getAlertIconColor(type)}`;
  
  switch (type) {
    case "warning":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "info":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "success":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "error":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    default:
      return null;
  }
};

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = React.useState<Alert[]>(alertsData);
  
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };
  
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };
  
  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-gray-500">
            Your solar alerts and notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`${getAlertBgColor(alert.type, alert.read)} ${!alert.read ? 'border-l-4' : ''}`}
            style={{ 
              borderLeftColor: !alert.read 
                ? alert.type === 'warning' 
                  ? '#F59E0B' 
                  : alert.type === 'info' 
                    ? '#3B82F6' 
                    : alert.type === 'success' 
                      ? '#10B981' 
                      : '#EF4444' 
                : undefined 
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertIcon type={alert.type} />
                  <CardTitle className={!alert.read ? "font-bold" : "font-medium"}>
                    {alert.title}
                  </CardTitle>
                </div>
                <div className="text-sm text-gray-500">{alert.date}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{alert.description}</p>
            </CardContent>
            {!alert.read && (
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                  Mark as read
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
        
        {alerts.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500">No alerts to display</p>
              <p className="text-sm text-gray-400">
                New alerts will appear here when available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
