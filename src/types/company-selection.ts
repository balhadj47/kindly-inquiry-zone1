
export interface CompanyBranchSelection {
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;
}

export interface CompanySelectionFormData {
  selectedCompanies: CompanyBranchSelection[];
}
