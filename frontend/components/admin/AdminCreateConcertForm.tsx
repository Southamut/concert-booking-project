"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CreateConcertPayload = {
  name: string;
  description: string;
  totalSeats: number;
};

interface AdminCreateConcertFormProps {
  apiBase?: string;
  onCreated?: () => Promise<void> | void;
}

export function AdminCreateConcertForm(props: AdminCreateConcertFormProps) {
  const { apiBase = "http://localhost:3001", onCreated } = props;

  const [form, setForm] = useState<CreateConcertPayload>({
    name: "",
    description: "",
    totalSeats: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    totalSeats?: string;
    general?: string;
  }>({});

  const handleChange =
    (key: keyof CreateConcertPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        key === "totalSeats" ? Number(e.target.value.replace(/\D/g, "") || 0) : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value as never }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let hasError = false;
    if (!form.name.trim()) {
      hasError = true;
      setErrors((prev) => ({ ...prev, name: "Please input concert name" }));
    }
    if (form.totalSeats <= 0) {
      hasError = true;
      setErrors((prev) => ({
        ...prev,
        totalSeats: "Please input total seats",
      }));
    }
    if (hasError) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}/concerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-is-admin": "true",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          totalSeats: form.totalSeats,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Create failed");
      }
      // reset
      setForm({ name: "", description: "", totalSeats: 0 });
      await onCreated?.();
      toast.success("Create successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-md border p-6 bg-white space-y-6">
      <h2 className="text-2xl font-semibold">Create</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-base text-black">Concert Name</label>
          <Input
            placeholder="Please input concert name"
            value={form.name}
            onChange={handleChange("name")}
            disabled={submitting}
          />
          {errors.name && (
            <p className="text-sm text-[#E84E4E]">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-base text-black">Total of seat</label>
          <Input
            inputMode="numeric"
            placeholder="0"
            value={form.totalSeats || ""}
            onChange={handleChange("totalSeats")}
            disabled={submitting}
          />
          {errors.totalSeats && (
            <p className="text-sm text-[#E84E4E]">{errors.totalSeats}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-base text-black">Description</label>
        <textarea
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-32 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
          placeholder="Please input description"
          value={form.description}
          onChange={handleChange("description")}
          disabled={submitting}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-12 px-6 text-base bg-[#1692EC] hover:bg-[#147fc9]"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}


