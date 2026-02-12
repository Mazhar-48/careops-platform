"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timezone: "UTC",
  });

  // Check if we already have a workspace saved
  useEffect(() => {
    const savedId = localStorage.getItem("workspaceId");
    if (savedId) {
      router.push(`/dashboard/${savedId}`);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/workspace", formData);
      // Save the ID so we "remember" the user
      localStorage.setItem("workspaceId", res.data.id);
      
      // Redirect to the Dashboard (we will build this next)
      router.push(`/dashboard/${res.data.id}`);
    } catch (error) {
      alert("Failed to create workspace. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            🚀 Mazhar's Ops Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <Input
                placeholder="e.g., Downtown Dental"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Owner Email</label>
              <Input
                placeholder="owner@business.com"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Input
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Launch Workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}