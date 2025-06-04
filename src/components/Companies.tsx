
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building2 } from 'lucide-react';
import CompanyModal from './CompanyModal';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Mock data - in a real app, this would come from your backend
  const companies = [
    {
      id: 1,
      name: 'ABC Corporation',
      branches: ['Downtown', 'Industrial Park', 'North Side'],
      totalTrips: 156,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      name: 'XYZ Logistics Ltd',
      branches: ['South Branch', 'East Terminal'],
      totalTrips: 89,
      lastActivity: '30 mins ago',
    },
    {
      id: 3,
      name: 'DEF Industries Inc',
      branches: ['West Warehouse', 'Central Hub', 'Port Office', 'Airport Branch'],
      totalTrips: 203,
      lastActivity: '1 hour ago',
    },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
        <Button onClick={handleAddCompany} className="mt-4 md:mt-0">
          Add New Company
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCompany(company);
                  }}
                >
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Branches ({company.branches.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {company.branches.slice(0, 3).map((branch, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {branch}
                    </Badge>
                  ))}
                  {company.branches.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{company.branches.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{company.totalTrips}</span> total trips
                </div>
                <div className="text-xs text-gray-500">
                  Active {company.lastActivity}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
      />
    </div>
  );
};

export default Companies;
