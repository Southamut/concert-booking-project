"use client";

import { UserLayout } from "@/components/layout/UserLayout";
import { ConcertCard } from "@/components/card/ConcertCard";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
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
  status: "reserved" | "cancelled";
  cancelledAt?: string;
};

// mock user
const CURRENT_USER = {
  email: "john@example.com",
  name: "John Doe",
};

const API = "http://localhost:3001";

export default function BookingPage() {

  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [reserving, setReserving] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  const reservedSet = useMemo(
    () =>
      new Set(
        reservations
          .filter((reservation) => reservation.status === "reserved")
          .map((reservation) => reservation.concertId),
      ),
    [reservations],
  );
  const reservationIdByConcert = useMemo(() => {
    const map = new Map<number, number>();
    reservations
      .filter((r) => r.status === "reserved")
      .forEach((r) => map.set(r.concertId, r.id));
    return map;
  }, [reservations]);

  // Get concerts and reservations from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        fetch(`${API}/concerts`, { cache: "no-store" }),
        fetch(`${API}/reservations/user/${encodeURIComponent(CURRENT_USER.email)}`, {
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
      const [c, r] = (await Promise.all([cRes.json(), rRes.json()])) as [
        Concert[],
        Reservation[]
      ];
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

  // Reserve a concert
  const handleReserve = async (concertId: number) => {
    setReserving(concertId);
    try {
      const body = {
        concertId,
        userEmail: CURRENT_USER.email,
        userName: CURRENT_USER.name,
      };
      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": CURRENT_USER.email,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg || "Reserve failed");
        return;
      }
      await loadData(); // refresh concerts (seats) and reservations
    } catch (error: any) {
      toast.error(error?.message || "Failed to reserve");
    } finally {
      setReserving(null);
    }
  };

  // Cancel a reservation
  const handleCancel = async (reservationId: number) => {
    setCancelling(reservationId);
    try {
      const res = await fetch(`${API}/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "x-user-email": CURRENT_USER.email,
        },
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg || "Cancel failed");
        return;
      }
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel");
    } finally {
      setCancelling(null);
    }
  };

  // Render the page
  return (
    <UserLayout>
      <div className="pt-6">
        <div className="flex flex-col max-w-6xl mx-auto gap-6">
          {/* All concerts (includes sold out) */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Spinner className="size-6 text-gray-400" />
            </div>
          )}
            {!loading &&
            concerts.map((concert) => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                reserved={reservedSet.has(concert.id)}
                reservationId={reservationIdByConcert.get(concert.id)}
                onReserve={handleReserve}
                onCancel={handleCancel}
                reserving={reserving}
                cancelling={cancelling}
              />
            ))}
        </div>
      </div>
    </UserLayout>
  );
}

