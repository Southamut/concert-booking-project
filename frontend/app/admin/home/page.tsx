
"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { AdminConcertCardList } from "@/components/admin/AdminConcertCardList";
import { Users, CheckCircle, XCircle } from "lucide-react";

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

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteConcert = async (concertId: number) => {
    const res = await fetch(`${API}/concerts/${concertId}`, {
      method: "DELETE",
      headers: { "x-is-admin": "true" },
    });
    if (!res.ok) {
      const msg = await res.text();
      alert(msg || "Delete failed");
      return;
    }
    await loadData();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-md bg-[#EAF5F9] p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-[#1692EC]" />
              <span className="text-xl text-[#1692EC] font-medium">Total of seats</span>
            </div>
            <span className="text-4xl text-[#1692EC] font-semibold">{totalSeats}</span>
          </div>
          <div className="rounded-md bg-[#E6F6F0] p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-[#0BA572]" />
              <span className="text-xl text-[#0BA572] font-medium">Reserve</span>
            </div>
            <span className="text-4xl text-[#0BA572] font-semibold">{totalReserved}</span>
          </div>
          <div className="rounded-md bg-[#FCEAEA] p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-[#F96464]" />
              <span className="text-xl text-[#F96464] font-medium">Cancel</span>
            </div>
            <span className="text-4xl text-[#F96464] font-semibold">{totalCancelled}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#C2C2C2]">
          <button
            className={`py-3 text-base ${tab === "overview" ? "text-[#1692EC] font-semibold border-b-2 border-[#1692EC]" : "text-gray-700"}`}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-3 text-base ${tab === "create" ? "text-[#1692EC] font-semibold border-b-2 border-[#1692EC]" : "text-gray-700"}`}
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
          <div className="rounded-md border p-6 text-gray-600">
            Create form placeholder
          </div>
        )}
      </div>
    </AdminLayout>
  );
}