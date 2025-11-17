import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

type Concert = {
    id: number;
    name: string;
    description: string;
    totalSeats: number;
    availableSeats: number;
};

export const ConcertCard = ({
    concert,
    reserved,
    onReserve,
    onCancel,
    reservationId,
    actionSlot,
    reserving,
    cancelling,
}: {
    concert: Concert;
    reserved?: boolean;
    onReserve?: (concertId: number) => void;
    onCancel?: (reservationId: number) => void;
    reservationId?: number;
    actionSlot?: React.ReactNode;
    reserving?: number | null;
    cancelling?: number | null;
}) => {

    const soldOut = concert.availableSeats === 0;

    return (
        <Card className="bg-white border border-[#C2C2C2] shadow-none sm:p-10 p-4 sm:gap-8 gap-10">
            <div className="flex flex-col gap-6">
                <CardTitle className="border-b border-[#C2C2C2] sm:pb-6 pb-4 sm:text-[40px] text-2xl font-semibold text-[#1692EC] text-center sm:text-left">
                    {concert.name}
                </CardTitle>
                <CardContent className="p-0">
                    <p className="sm:text-2xl text-base font-normal text-black">
                        {concert.description}
                    </p>
                </CardContent>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-2">
                    <User className="w-8 h-8" />
                    <p className="text-2xl font-normal">{concert.availableSeats}</p>
                </div>
                {actionSlot ? (
                    actionSlot
                ) : reserved && onCancel && typeof reservationId === "number" ? (
                    <Button
                        className="sm:w-[160px] w-full h-15 bg-[#F96464] text-white py-6 px-4 rounded-md text-2xl font-semibold"
                        onClick={() => onCancel(reservationId)}
                        disabled={cancelling === reservationId}
                    >
                        {cancelling === reservationId ? "Cancelling..." : "Cancel"}
                    </Button>
                ) : (
                    <Button
                        className={`sm:w-[160px] w-full h-15 ${soldOut ? "bg-gray-400" : "bg-[#1692EC]"} text-white py-6 px-4 rounded-md text-2xl font-semibold`}
                        disabled={soldOut || !!reserved || !onReserve || reserving === concert.id}
                        onClick={() => onReserve && onReserve(concert.id)}
                    >
                        {reserving === concert.id ? "Reserving..." : soldOut ? "Sold out" : "Reserve"}
                    </Button>
                )}
            </div>
        </Card>
    );
}