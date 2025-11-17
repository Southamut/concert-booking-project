
"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { useEffect, useMemo, useState } from "react";
import { AdminConcertCardList } from "@/components/admin/AdminConcertCardList";
import { User, CircleCheck, XCircle } from "lucide-react";
import { AdminCreateConcertForm } from "@/components/admin/AdminCreateConcertForm";
import { toast } from "sonner";
import { showSuccessToast } from "@/components/toast/showSuccessToast";
import { Spinner } from "@/components/ui/spinner";

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
  status: "reserved" | "cancelled";
  cancelledAt?: string;
};

const API = "http://localhost:3001";

export default function AdminHomePage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tab, setTab] = useState<"overview" | "create">("overview");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const totalSeats = useMemo(
    () => concerts.reduce((sum, c) => sum + c.totalSeats, 0),
    [concerts]
  );
  const totalReserved = useMemo(
    () => reservations.filter((r) => r.status === "reserved").length,
    [reservations]
  );
  const totalCancelled = useMemo(
    () => reservations.filter((r) => r.status === "cancelled").length,
    [reservations]
  );

  // Load data on mount
  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        fetch(`${API}/concerts`, { cache: "no-store" }),
        fetch(`${API}/reservations/all`, {
          headers: { "x-is-admin": "true" },
          cache: "no-store",
        }),
      ]);
      if (!cRes.ok) {
        const msg = await cRes.text();
        toast.error(msg || "Failed to load concerts");
        return;
      }
      if (!rRes.ok) {
        const msg = await rRes.text();
        toast.error(msg || "Failed to load reservations");
        return;
      }
      const [c, r] = await Promise.all([cRes.json(), rRes.json()]);
      setConcerts(c);
      setReservations(r);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Delete a concert
  const handleDeleteConcert = async (concertId: number) => {
    setDeleting(concertId);
    try {
      const res = await fetch(`${API}/concerts/${concertId}`, {
        method: "DELETE",
        headers: { "x-is-admin": "true" },
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg || "Delete failed");
        return;
      }
      showSuccessToast("Delete successfully");
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete concert");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-6xl mx-auto pt-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-md lg:max-w-[350px] w-full bg-[#0070A4] py-6 px-4 flex flex-col items-center gap-[10px] justify-between text-center">
            <User className="h-10 w-10 text-white" />
            <span className="lg:text-2xl text-xl text-white font-normal">Total of seats</span>
            <span className="lg:text-6xl text-4xl text-white font-normal leading-[150%]">{totalSeats}</span>
          </div>
          <div className="rounded-md lg:max-w-[350px] w-full bg-[#00A58B] py-6 px-4 flex flex-col items-center gap-[10px] justify-between">
            <CircleCheck className="h-10 w-10 text-white" />
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
          <>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Spinner className="size-8 text-gray-400" />
              </div>
            )}
            {!loading && (
              <AdminConcertCardList 
                concerts={concerts} 
                onDelete={handleDeleteConcert}
                deleting={deleting}
              />
            )}
          </>
        )}

        {/* Create tab placeholder */}
        {tab === "create" && (
          <AdminCreateConcertForm onCreated={loadData} onSuccess={() => setTab("overview")}  />
        )}
      </div>
    </AdminLayout>
  );
}