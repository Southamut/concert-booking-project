"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showSuccessToast } from "@/components/toast/showSuccessToast";
import { User, SaveIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
        description?: string;
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
        if (!form.description.trim()) {
            hasError = true;
            setErrors((prev) => ({ ...prev, description: "Please input description" }));
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
            showSuccessToast("Create successfully");
        } catch (err: any) {
            showSuccessToast(err?.message ?? "Create failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-md border p-10 bg-white border-[#C2C2C2] shadow-none space-y-6">
            <h2 className="text-[40px] text-[#1692EC] font-semibold border-b border-[#C2C2C2] pb-6">Create</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-2xl font-normal text-black pb-4">Concert Name</label>
                    <Input
                        className="border border-[#5C5C5C] py-3 px-4 h-12 text-black font-medium placeholder:text-[#C2C2C2]"
                        placeholder="Please input concert name"
                        value={form.name}
                        onChange={handleChange("name")}
                        disabled={submitting}
                    />
                    {errors.name && (
                        <p className="text-sm pt-2 text-[#E84E4E]">{errors.name}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-2xl font-normal text-black pb-4">Total of seat</label>
                    <div className="relative">
                        <Input
                            className="border border-[#5C5C5C] py-3 px-4 h-12 pr-10 text-black font-medium placeholder:text-[#C2C2C2]"
                            inputMode="numeric"
                            placeholder="0"
                            value={form.totalSeats || ""}
                            onChange={handleChange("totalSeats")}
                            disabled={submitting}
                        />
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
                    </div>
                    {errors.totalSeats && (
                        <p className="text-sm pt-2 text-[#E84E4E]">{errors.totalSeats}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-2xl font-normal text-black pb-4">Description</label>
                <Textarea
                    className="border border-[#5C5C5C] py-3 px-4 h-[100px] pr-10 text-black font-medium placeholder:text-[#C2C2C2]"
                    placeholder="Please input description"
                    value={form.description}
                    onChange={handleChange("description")}
                    disabled={submitting}
                    rows={4}
                />
                {errors.description && (
                    <p className="text-sm pt-2 text-[#E84E4E]">{errors.description}</p>
                )}
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    className="h-[60px] lg:min-w-[160px] w-full text-2xl bg-[#1692EC] hover:bg-[#147fc9] gap-4"
                    disabled={submitting}
                >
                    <SaveIcon className="size-6" />
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}


