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
  const workspaceId = params?.workspaceId as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", date: "", time: "09:00" });

  const handleBook = async () => {
    if (!formData.name || !formData.email || !formData.date) {
      setErrorMsg("Please fill all fields!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const contactRes = await api.post("/contact", {
        name: formData.name, email: formData.email, workspaceId,
      });

      await api.post("/booking", {
        contactId: contactRes.data.id, workspaceId,
        startTime: new Date(`${formData.date}T${formData.time}`),
        title: "New Service Request",
      });

      setStep(2);
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Booking failed: " + (error.message || "Check console"));
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <Card className="w-full max-w-md text-center border-none shadow-2xl p-8 bg-gradient-to-b from-green-50 to-white">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2">You're All Set!</h1>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-6 w-full">Book Another</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative p-4">
      <Card className="w-full max-w-lg shadow-2xl border-none bg-white/90 p-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black">Book Your Visit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMsg && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm font-bold">{errorMsg}</div>}
          
          <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} />
            <select className="border rounded-md px-3" onChange={(e) => setFormData({...formData, time: e.target.value})}>
              <option value="09:00">09:00 AM</option>
              <option value="14:00">02:00 PM</option>
            </select>
          </div>

          <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" onClick={handleBook} disabled={loading}>
            {loading ? "Processing..." : "Confirm Booking"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}