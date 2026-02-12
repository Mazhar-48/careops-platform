"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  AlertTriangle, 
  Users, 
  Package, 
  MessageSquare 
} from "lucide-react";

export default function DashboardPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetch the "God View" data
    if (workspaceId) {
      api.get(`/dashboard/${workspaceId}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error("Failed to load dashboard", err))
        .finally(() => setLoading(false));
    }
  }, [workspaceId]);

  if (loading) return <div className="p-10">Loading your business...</div>;
  if (!data) return <div className="p-10 text-red-500">Error loading data.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, Owner.</p>
        </div>
        <Button onClick={() => alert("This will open the Booking Page (Next Step!)")}>
          View Public Booking Page
        </Button>
      </div>

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: TODAY'S BOOKINGS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.todayBookings.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        {/* CARD 2: LOW STOCK ALERTS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items below threshold</p>
          </CardContent>
        </Card>

        {/* CARD 3: RECENT LEADS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentContacts.length}</div>
            <p className="text-xs text-muted-foreground">In the last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* DETAILED SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SECTION 1: INVENTORY WARNINGS */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.lowStockItems.length === 0 ? (
              <p className="text-sm text-slate-500">All stock levels look good. ✅</p>
            ) : (
              <div className="space-y-2">
                {data.lowStockItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                    <span className="font-medium text-red-700">{item.name}</span>
                    <Badge variant="destructive">{item.quantity} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 2: RECENT ACTIVITY (Placeholder) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-slate-500" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
             {data.recentContacts.length === 0 ? (
              <p className="text-sm text-slate-500">No new inquiries yet.</p>
            ) : (
              <ul className="space-y-2">
                 {data.recentContacts.map((c: any) => (
                   <li key={c.id} className="text-sm p-2 bg-slate-100 rounded">
                     {c.name} ({c.email})
                   </li>
                 ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}