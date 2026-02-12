"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  AlertTriangle, 
  Users, 
  Package, 
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;
  
  interface DashboardData {
    todayBookings: any[];
    lowStockItems: any[];
    recentContacts: any[];
  }
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (workspaceId) {
      api.get(`/dashboard/${workspaceId}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error("Failed to load dashboard", err))
        .finally(() => setLoading(false));
    }
  }, [workspaceId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-blue-600 font-medium">Loading your empire...</div>
    </div>
  );
  
  if (!data) return <div className="p-10 text-red-500">Error loading data.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 p-6 rounded-2xl border border-white/20 shadow-sm backdrop-blur-xl">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-lg">
              Overview for <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-base">{workspaceId.slice(0,8)}...</span>
            </p>
          </div>
          <Button 
            onClick={() => router.push(`/book/${workspaceId}`)}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105"
            size="lg"
          >
            View Public Booking Page <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking Card */}
          <Card className="border-none shadow-xl shadow-blue-900/5 bg-gradient-to-br from-white to-blue-50/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900/70 uppercase tracking-wider">Today's Bookings</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{data.todayBookings.length}</div>
              <p className="text-sm font-medium text-blue-600/80 mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          {/* Inventory Card */}
          <Card className="border-none shadow-xl shadow-orange-900/5 bg-gradient-to-br from-white to-orange-50/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-orange-900/70 uppercase tracking-wider">Inventory Alerts</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{data.lowStockItems.length}</div>
              <p className="text-sm font-medium text-orange-600/80 mt-1">Items below threshold</p>
            </CardContent>
          </Card>

          {/* Leads Card */}
          <Card className="border-none shadow-xl shadow-green-900/5 bg-gradient-to-br from-white to-green-50/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-900/70 uppercase tracking-wider">New Leads</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{data.recentContacts.length}</div>
              <p className="text-sm font-medium text-green-600/80 mt-1">In the last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* DETAILED SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CRITICAL INVENTORY */}
          <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 bg-red-100 rounded-md">
                   <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                Critical Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {data.lowStockItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Package className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">All stock levels look good. ✅</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.lowStockItems.map((item: any) => (
                    <div key={item.id} className="group flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="font-semibold text-slate-700 group-hover:text-red-700 transition-colors">{item.name}</span>
                      </div>
                      <Badge variant="destructive" className="px-3 py-1 text-sm shadow-sm">
                        Only {item.quantity} left
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* RECENT INQUIRIES */}
          <Card className="border-slate-100 shadow-lg">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                 <div className="p-1.5 bg-indigo-100 rounded-md">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                 </div>
                Recent Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               {data.recentContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Users className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">No new inquiries yet.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                   {data.recentContacts.map((c: any) => (
                     <li key={c.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group cursor-default">
                       <div className="flex flex-col">
                         <span className="font-semibold text-slate-700 group-hover:text-indigo-700">{c.name}</span>
                         <span className="text-xs text-slate-400">{c.email}</span>
                       </div>
                       <span className="text-slate-400 text-xs font-mono bg-white px-2 py-1 rounded border">
                         {new Date(c.createdAt).toLocaleDateString()}
                       </span>
                     </li>
                   ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}