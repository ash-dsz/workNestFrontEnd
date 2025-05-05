import React from 'react';
import { PieChart } from 'lucide-react';

const StatCard = ({ icon: Icon, label }: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Summary</p>
        <p className="text-2xl font-semibold mt-2">{label}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const SummaryReport: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Summary Report</h1>
      <p className="text-gray-500 mb-6">Get a quick view of overall stats</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={PieChart} label="Q1 2025 Summary" />
      </div>
    </div>
  );
};

export default SummaryReport;
