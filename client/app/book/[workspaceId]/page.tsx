"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Sparkles } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "09:00",
  });

  const handleBook = async () => {
    setLoading(true);
    try {
      const contactRes = await api.post("/contact", {
        name: formData.name,
        email: formData.email,
        workspaceId,
      });

      await api.post("/booking", {
        contactId: contactRes.data.id,
        workspaceId,
        startTime: new Date(`${formData.date}T${formData.time}`),
        title: "New Service Request",
      });

      setStep(2);
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="w-full max-w-md text-center border-none shadow-2xl p-8 bg-gradient-to-b from-green-50 to-white">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">You're All Set!</h1>
          <p className="text-slate-600 mb-6">We've received your request. A confirmation email is on its way to <span className="font-bold text-slate-900">{formData.email}</span>.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full">Book Another Appointment</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      {/* GLOW DECORATION */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <Card className="w-full max-w-lg shadow-2xl border-none backdrop-blur-sm bg-white/90">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900">Book Your Visit</CardTitle>
          <p className="text-slate-500">Secure your spot in seconds.</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
            <Input 
              className="h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Smith" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <Input 
              type="email"
              className="h-12 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@company.com" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" /> Date
              </label>
              <Input 
                type="date" 
                className="h-12 bg-slate-50 border-slate-100"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Clock className="h-3 w-3" /> Time
              </label>
              <select 
                className="w-full h-12 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                <option value="09:00">09:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="16:00">04:00 PM</option>
              </select>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]" 
            onClick={handleBook}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </Button>

          <p className="text-center text-[10px] text-slate-400">
            By clicking confirm, you agree to our terms of service.
          </p>

        </CardContent>
      </Card>
    </div>
  );
}