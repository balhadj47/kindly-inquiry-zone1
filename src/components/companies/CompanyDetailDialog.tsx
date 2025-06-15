
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Calendar, Users, ArrowRight } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {company.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Created on {new Date(company.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1">
              {company.branches.length} {company.branches.length === 1 ? 'Branch' : 'Branches'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
          {/* Company Information Card */}
          <Card className="h-fit">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">
                      {company.address || <span className="italic text-gray-400">No address provided</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <p className="text-gray-900">
                      {company.phone || <span className="italic text-gray-400">No phone provided</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Address</p>
                    <p className="text-gray-900">
                      {company.email || <span className="italic text-gray-400">No email provided</span>}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branches Card */}
          <Card className="h-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Branches</h3>
              </div>
              
              {company.branches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No branches available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {company.branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                      onClick={() => onBranchClick && onBranchClick(branch.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                            {branch.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Created {new Date(branch.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      
                      {/* Branch contact info preview */}
                      <div className="text-xs text-gray-500 space-y-1">
                        {branch.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{branch.address}</span>
                          </div>
                        )}
                        {branch.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{branch.phone}</span>
                          </div>
                        )}
                        {branch.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{branch.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{company.branches.length}</div>
              <div className="text-sm text-gray-600">Total Branches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-gray-600">Company Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date().getFullYear() - new Date(company.created_at).getFullYear() || '< 1'}
              </div>
              <div className="text-sm text-gray-600">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {company.branches.length > 0 ? 'Multi' : 'Single'}
              </div>
              <div className="text-sm text-gray-600">Branch Type</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDetailDialog;
