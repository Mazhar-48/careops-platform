"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertTriangle, Users, Package, MessageSquare, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params?.workspaceId as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    api.get(`/dashboard/${workspaceId}`)
      .then((res) => {
        if (res.data) setData(res.data);
        else setErrorDetails("Backend ne empty data bheja hai.");
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setErrorDetails(err.message || "Network Error. Check console (F12).");
      })
      .finally(() => setLoading(false));
  }, [workspaceId]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-pulse text-blue-600 font-bold text-xl mb-4">Loading your empire...</div>
      <p className="text-slate-400">Agar ye 10 sec se zyada le, toh error hai.</p>
    </div>
  );
  
  if (errorDetails) return (
    <div className="p-10 min-h-screen bg-red-50 text-red-700">
      <h1 className="text-2xl font-bold mb-2">🚨 Error Aa Gaya!</h1>
      <p>{errorDetails}</p>
      <p className="mt-4 text-sm text-red-500">Hint: Apne browser mein F12 dabao aur 'Console' tab check karo.</p>
    </div>
  );

  if (!data) return <div className="p-10 text-slate-500">No data available.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 p-6 rounded-2xl border border-white/20 shadow-sm backdrop-blur-xl">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-lg">
              Overview for <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-base">{workspaceId.slice(0,8)}...</span>
            </p>
          </div>
          <Button onClick={() => router.push(`/book/${workspaceId}`)} className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all" size="lg">
            View Public Booking Page <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-white to-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900/70 uppercase">Today's Bookings</CardTitle>
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              {/* Optional Chaining (?.) prevents crashes if data is missing */}
              <div className="text-4xl font-black text-slate-900">{data?.todayBookings?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-white to-orange-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-orange-900/70 uppercase">Inventory Alerts</CardTitle>
              <Package className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{data?.lowStockItems?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-white to-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-900/70 uppercase">New Leads</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{data?.recentContacts?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}