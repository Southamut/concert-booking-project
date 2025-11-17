import { ConcertCard } from "@/components/card/ConcertCard";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/alert/AlertDialog";

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
  deleting?: number | null;
}

export function AdminConcertCardList(props: ConcertListProps) {
  const { concerts, onDelete, deleting } = props;

  return (
    <div className="flex flex-col gap-6">
      {concerts.map((c) => (
        <ConcertCard
          key={c.id}
          concert={c}
          actionSlot={
            <ConfirmDeleteDialog
              trigger={
                <Button 
                  className="sm:w-[160px] w-full h-15 bg-[#E84E4E] text-white py-6 px-4 rounded-md text-2xl font-semibold"
                  disabled={deleting === c.id}
                >
                  {deleting === c.id ? "Deleting..." : "Delete"}
                </Button>
              }
              title="Are you sure to delete?"
              description={`"${c.name}"`}
              confirmLabel="Yes, Delete"
              cancelLabel="Cancel"
              onConfirm={() => onDelete(c.id)}
            />
          }
        />
      ))}
    </div>
  );
}


