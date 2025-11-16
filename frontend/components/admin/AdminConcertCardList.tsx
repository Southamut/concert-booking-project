import { ConcertCard } from "@/components/card/ConcertCard";
import { Button } from "@/components/ui/button";

export type AdminConcert = {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  availableSeats: number;
};

interface ConcertListProps {
  concerts: AdminConcert[];
  onDelete: (concertId: number) => void;
}

export function AdminConcertCardList(props: ConcertListProps) {
  const { concerts, onDelete } = props;

  return (
    <div className="flex flex-col gap-6">
      {concerts.map((c) => (
        <ConcertCard
          key={c.id}
          concert={c}
          actionSlot={
            <Button
              className="sm:w-[160px] w-full h-15 bg-[#E84E4E] text-white py-6 px-4 rounded-md text-2xl font-semibold"
              onClick={() => onDelete(c.id)}
            >
              Delete
            </Button>
          }
        />
      ))}
    </div>
  );
}


