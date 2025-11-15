import { UserLayout } from "@/components/layout/UserLayout";
import {ConcertCard} from "@/components/card/ConcertCard";

export default function BookingPage() {
  return (
    <UserLayout>
      <div className="pt-10 sm:px-4 px-0">
        <div className="flex flex-col max-w-6xl mx-auto">
          <ConcertCard />
        </div>
      </div>
    </UserLayout>
  );
}

