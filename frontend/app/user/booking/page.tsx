import { UserLayout } from "@/components/layout/UserLayout";
import { ConcertCard } from "@/components/card/ConcertCard";

type Concert = {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
};

export default async function BookingPage() {
  // Get concerts from backend
  const res = await fetch("http://localhost:3001/concerts", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load concerts");
  }
  const concerts: Concert[] = await res.json();

  return (
    <UserLayout>
      <div className="pt-10 sm:px-4 px-0">
        <div className="flex flex-col max-w-6xl mx-auto gap-6">
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      </div>
    </UserLayout>
  );
}

