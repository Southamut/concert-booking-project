"use client";

import {
    AlertDialog as RadixAlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { XIcon } from "lucide-react";
import React from "react";

type ConfirmDialogProps = {
    trigger: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
};

export function ConfirmDeleteDialog({
    trigger,
    title = "Are you sure?",
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        const result = onConfirm?.();
        // fire-and-forget; callers handle async if needed
        if (result && typeof (result as Promise<void>).then === "function") {
            (result as Promise<void>).catch(() => { });
        }
    };

    return (
        <RadixAlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex items-center justify-center bg-[#E63946] h-12 w-12 rounded-full p-2">
                        <XIcon className="text-white font-bold h-8 w-8" />
                    </div>
                    <AlertDialogHeader className="text-center">
                        <AlertDialogTitle className="text-xl text-black font-bold">{title}</AlertDialogTitle>
                        {description ? (
                            <AlertDialogDescription className="text-xl text-center text-black font-bold">
                                {description}
                            </AlertDialogDescription>
                        ) : null}
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:grid sm:grid-cols-2 gap-4 w-full">
                        <AlertDialogCancel className="h-12 px-8 text-base font-medium text-[#262626] border border-[#C4C4C4]!" onClick={onCancel}>
                            {cancelLabel}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="h-12 px-8 text-base font-medium text-white bg-[#E63946] hover:bg-[#d14343]"
                            onClick={handleConfirm}
                        >
                            {confirmLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </RadixAlertDialog>
    );
}