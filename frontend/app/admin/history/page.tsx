
"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";

type Reservation = {
  id: number;
  userEmail: string;
  userName: string;
  concertId: number;
  createdAt: string;
  status: 'reserved' | 'cancelled';
  cancelledAt?: string;
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
      const [rRes, cRes] = await Promise.all([
        fetch(`${API}/reservations/all`, {
          headers: { "x-is-admin": "true" },
          cache: "no-store",
        }),
        fetch(`${API}/concerts`, { cache: "no-store" }),
      ]);
      const reservations: Reservation[] = rRes.ok ? await rRes.json() : [];
      const concerts: Concert[] = cRes.ok ? await cRes.json() : [];
      const idToConcert = new Map<number, string>(concerts.map((c) => [c.id, c.name]));

      const mapped = reservations
  .flatMap((r) => {
    const base = {
      userName: r.userName,
      concertName: idToConcert.get(r.concertId) ?? `#${r.concertId}`,
    };

    const rows = [
      {
        ...base,
        createdAt: r.createdAt,
        action: "Reserve",
      },
    ];

    if (r.status === "cancelled" && r.cancelledAt) {
      rows.push({
        ...base,
        createdAt: r.cancelledAt,
        action: "Cancel",
      });
    }

    return rows;
  })
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