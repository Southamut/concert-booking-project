
"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";

type ReservationEvent = {
  id: number;
  reservationId: number;
  userEmail: string;
  userName: string;
  concertId: number;
  type: "RESERVE" | "CANCEL";
  at: string;
};

type Concert = {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
};

const API = "http://localhost:3001";

export default function AdminHistoryPage() {
  const [rows, setRows] = useState<
    Array<{ createdAt: string; userName: string; concertName: string; action: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [eventsRes, concertsRes] = await Promise.all([
        fetch(`${API}/reservations/history`, {
          headers: { "x-is-admin": "true" },
          cache: "no-store",
        }),
        fetch(`${API}/concerts`, { cache: "no-store" }),
      ]);
      const events: ReservationEvent[] = eventsRes.ok ? await eventsRes.json() : [];
      const concerts: Concert[] = concertsRes.ok ? await concertsRes.json() : [];
      const idToConcert = new Map<number, string>(concerts.map((c) => [c.id, c.name]));

      const mapped = events
        .map((e) => ({
          createdAt: e.at,
          userName: e.userName,
          concertName: idToConcert.get(e.concertId) ?? `#${e.concertId}`,
          action: e.type === "RESERVE" ? "Reserve" : "Cancel",
        }))
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

      setRows(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-12 max-w-6xl mx-auto pt-6">
        <div className="overflow-hidden rounded-sm border border-[#5B5B5B] border-b-0 bg-white shadow-none">
          <Table className="border-collapse">
            <TableHeader className="bg-white text-black">
              <TableRow>
                <TableHead className="px-4 py-3 text-black text-xl border border-b-[#5B5B5B] border-r-[#5B5B5B]">
                  Date time
                </TableHead>
                <TableHead className="px-4 py-3 text-black text-xl border border-b-[#5B5B5B] border-r-[#5B5B5B]">
                  Username
                </TableHead>
                <TableHead className="px-4 py-3 text-black text-xl border border-b-[#5B5B5B] border-r-[#5B5B5B]">
                  Concert name
                </TableHead>
                <TableHead className="px-4 py-3 text-black text-xl border border-b-[#5B5B5B]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell className="px-4 py-3 border border-b-[#5B5B5B] border-r-[#5B5B5B]">
                    {new Date(row.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 border border-b-[#5B5B5B] border-r-[#5B5B5B]">
                    {row.userName}
                  </TableCell>
                  <TableCell className="px-4 py-3 border border-b-[#5B5B5B] border-r-[#5B5B5B]">
                    {row.concertName}
                  </TableCell>
                  <TableCell className="px-4 py-3 border border-b-[#5B5B5B]">
                    {row.action}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}