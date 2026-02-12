"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";

export default function BookingPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "09:00",
  });

  const handleBook = async () => {
    try {
      // 1. Create the Contact First
      const contactRes = await api.post("/contact", { // We will add this route next
        name: formData.name,
        email: formData.email,
        workspaceId,
      });

      // 2. Create the Booking
      await api.post("/booking", { // We will add this route next
        contactId: contactRes.data.id,
        workspaceId,
        startTime: new Date(`${formData.date}T${formData.time}`),
        title: "New Service Request",
      });

      setStep(2); // Show Success Screen
    } catch (error) {
      alert("Booking failed. (Did you add the API routes yet?)");
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Card className="w-[400px] text-center p-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600">We have sent a confirmation to {formData.email}.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-[500px] shadow-xl">
        <CardHeader>
          <CardTitle>📅 Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Date
              </label>
              <Input 
                type="date" 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> Time
              </label>
              <select 
                className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handleBook}>
            Confirm Booking
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}