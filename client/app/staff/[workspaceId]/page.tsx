"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, User, MessageSquare, ClipboardList } from "lucide-react";

export default function StaffPortal() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Fetch data (reusing the dashboard data for speed, but filtering for staff needs)
  const loadData = () => {
    api.get(`/dashboard/${workspaceId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (workspaceId) loadData();
  }, [workspaceId]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/booking/${bookingId}/status`, { status: newStatus });
      loadData(); // Refresh the list instantly
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Staff Portal...</div>;
  if (!data) return <div className="p-10 text-red-500">Error loading data.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* STAFF HEADER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center border-l-4 border-l-blue-500">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Staff Portal</h1>
            <p className="text-slate-500">Manage daily operations and customer communication.</p>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1 bg-blue-50 text-blue-700">Staff Access Level</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: BOOKING MANAGEMENT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  Today's Schedule & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data?.todayBookings?.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No appointments scheduled for today.</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {data.todayBookings.map((booking: any) => (
                      <li key={booking.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{booking.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="flex items-center gap-1"><User className="h-4 w-4"/> {booking.contact?.name || "Walk-in"}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={booking.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                            {booking.status}
                          </Badge>
                          
                          {booking.status !== "COMPLETED" && (
                            <Button 
                              size="sm" 
                              onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" /> Mark Completed
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* COLUMN 3: CUSTOMER COMMUNICATION */}
          <div className="space-y-6">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Recent Communications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-slate-100">
                  {data.recentContacts.map((contact: any) => (
                    <li key={contact.id} className="p-4 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="font-semibold text-slate-800">{contact.name}</div>
                      <div className="text-sm text-slate-500 truncate">{contact.email}</div>
                      <div className="text-xs text-purple-600 mt-2 font-medium">Click to email / view forms &rarr;</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}