import React from "react";
import { UploadCloud } from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">Upload</p>
        <p className="text-2xl font-semibold mt-2">{label}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const DocumentUpload: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h1>
      <p className="text-gray-500 mb-6">Upload necessary files and documents</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={UploadCloud} label="Upload Employee Files" />
      </div>
    </div>
  );
};

export default DocumentUpload;
