"use client";

import { AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from "@/components/ui/alert-dialog";

interface RequiredAlertProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function RequiredAlert({
  isOpen,
  onOpenChange,
}: RequiredAlertProps) {

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Warning: Adding Required Attribute
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Adding a required attribute to this category will hide all products
            that do not have this attribute set. This may significantly reduce
            the number of visible products in this category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={ () => onOpenChange(false)}>
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
