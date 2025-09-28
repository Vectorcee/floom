import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface StakeComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StakeComingSoonModal({ isOpen, onClose }: StakeComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <Zap className="w-5 h-5 text-floom-accent" />
            Staking Feature
          </DialogTitle>
          <DialogDescription className="font-body">
            We're working hard to bring you the ability to stake FUUM Points on quality content. This feature will allow you to earn rewards by backing high-quality posts and creators.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}