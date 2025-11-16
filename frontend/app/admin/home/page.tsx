
"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { AdminConcertCardList } from "@/components/admin/AdminConcertCardList";
import { User, CheckCircle, XCircle } from "lucide-react";
import { AdminCreateConcertForm } from "@/components/admin/AdminCreateConcertForm";
import { toast } from "sonner";

type Concert = {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
};

type Reservation = {
  id: number;
  userEmail: string;
  userName: string;
  concertId: number;
  createdAt: string;
};

const API = "http://localhost:3001";

export default function AdminHomePage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tab, setTab] = useState<"overview" | "create">("overview");

  const totalSeats = useMemo(
    () => concerts.reduce((sum, c) => sum + c.totalSeats, 0),
    [concerts]
  );
  const totalReserved = useMemo(() => reservations.length, [reservations]);
  const totalCancelled = 0; // No cancellation history tracked in backend; left as 0 placeholder

  // Load data on mount
  const loadData = async () => {
    const [cRes, rRes] = await Promise.all([
      fetch(`${API}/concerts`, { cache: "no-store" }),
      fetch(`${API}/reservations/all`, {
        headers: { "x-is-admin": "true" },
        cache: "no-store",
      }),
    ]);
    if (cRes.ok) setConcerts(await cRes.json());
    if (rRes.ok) setReservations(await rRes.json());
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Delete a concert
  const handleDeleteConcert = async (concertId: number) => {
    const res = await fetch(`${API}/concerts/${concertId}`, {
      method: "DELETE",
      headers: { "x-is-admin": "true" },
    });
    if (!res.ok) {
      const msg = await res.text();
      toast.error(msg || "Delete failed");
      return;
    }
    await loadData();
    toast.success("Delete successfully");
  };

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-6xl mx-auto pt-10">
        {/* Stat cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-md lg:max-w-[350px] w-full bg-[#0070A4] py-6 px-4 flex flex-col items-center gap-[10px] justify-between text-center">
            <User className="h-10 w-10 text-white" />
            <span className="lg:text-2xl text-xl text-white font-normal">Total of seats</span>
            <span className="lg:text-6xl text-4xl text-white font-normal leading-[150%]">{totalSeats}</span>
          </div>
          <div className="rounded-md lg:max-w-[350px] w-full bg-[#00A58B] py-6 px-4 flex flex-col items-center gap-[10px] justify-between">
            <CheckCircle className="h-10 w-10 text-white" />
            <span className="lg:text-2xl text-xl text-white font-normal">Reserve</span>
            <span className="lg:text-6xl text-4xl text-white font-normal leading-[150%]">{totalReserved}</span>
          </div>
          <div className="rounded-md lg:max-w-[350px] w-full bg-[#E84E4E] py-6 px-4 flex flex-col items-center gap-[10px] justify-between">
            <XCircle className="h-10 w-10 text-white" />
            <span className="lg:text-2xl text-xl text-white font-normal">Cancel</span>
            <span className="lg:text-6xl text-4xl text-white font-normal leading-[150%]">{totalCancelled}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#C2C2C2]">
          <button
            className={`py-3 text-2xl ${tab === "overview" ? "text-[#1692EC] font-semibold border-b-2 border-[#1692EC]" : "text-gray-700"}`}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-3 text-2xl ${tab === "create" ? "text-[#1692EC] font-semibold border-b-2 border-[#1692EC]" : "text-gray-700"}`}
            onClick={() => setTab("create")}
          >
            Create
          </button>
        </div>

        {/* Overview content */}
        {tab === "overview" && (
          <AdminConcertCardList concerts={concerts} onDelete={handleDeleteConcert} />
        )}

        {/* Create tab placeholder */}
        {tab === "create" && (
          <AdminCreateConcertForm onCreated={loadData} />
        )}
      </div>
    </AdminLayout>
  );
}