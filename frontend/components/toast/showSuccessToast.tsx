"use client";

import { toast } from "sonner";
import { CircleCheck, X } from "lucide-react";

export function showSuccessToast(message: string) {
  toast.custom(
    (t) => (
      <div className="h-[52px] min-w-[246px] rounded-md border border-[#CBE7C6] bg-[#DBEDD9] text-black px-4 py-[6px] flex items-center gap-3 shadow-none">
        <CircleCheck className="size-[20px] text-[#00A743]" />
        <span className="text-[16px] font-normal text-[#2B2B2B]">{message}</span>
        <button
          className="ml-2 text-[#1E4620]"
          onClick={() => toast.dismiss(t)}
          aria-label="Close"
        >
          <X className="size-[20px] text-[#1E4620]" />
        </button>
      </div>
    ),
    { duration: 2500, position: "top-right" }
  );
}


