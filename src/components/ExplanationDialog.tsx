// components/AnalysisIntroDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AnalysisIntroDialogProps = {
  explanation: string;
  onProceed?: () => void; // optional callback (e.g., scroll to today's routine)
  title?: string;         // optional, defaults below
};

export default function AnalysisIntroDialog({
  explanation,
  onProceed,
  title = "Your Skin Analysis",
}: AnalysisIntroDialogProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleProceed = () => {
    setOpen(false);
    onProceed?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground">
              {/* Preserve newlines if any */}
              <p className="whitespace-pre-line leading-6">
                {explanation}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={handleProceed}>
            Get into today&apos;s routine!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
