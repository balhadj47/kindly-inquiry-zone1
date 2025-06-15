
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Building2 } from "lucide-react";
import { Company } from "@/hooks/useCompanies";

interface CompanyDetailDialogProps {
  company: Company | null;
  open: boolean;
  onClose: () => void;
  onBranchClick?: (branchId: string) => void;
}

const CompanyDetailDialog: React.FC<CompanyDetailDialogProps> = ({ company, open, onClose, onBranchClick }) => {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span>{company.name}</span>
          </DialogTitle>
          <div className="text-gray-600 text-xs mt-1">
            Created on {new Date(company.created_at).toLocaleDateString()}
          </div>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <span className="font-semibold">Address:</span>{" "}
            <span>{company.address || <span className="italic text-gray-400">No address</span>}</span>
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            <span>{company.phone || <span className="italic text-gray-400">No phone</span>}</span>
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            <span>{company.email || <span className="italic text-gray-400">No email</span>}</span>
          </div>
          <div>
            <span className="font-semibold">Branches:</span>
            <ul className="list-disc list-inside mt-1">
              {company.branches.length === 0 && (
                <li className="italic text-gray-500">No branches</li>
              )}
              {company.branches.map((b) => (
                <li key={b.id}>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 underline underline-offset-2 text-base"
                    onClick={() => onBranchClick && onBranchClick(b.id)}
                  >
                    {b.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDetailDialog;

