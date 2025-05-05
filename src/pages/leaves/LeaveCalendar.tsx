import React from 'react';

const LeaveCalendar: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leave Calendar</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Month
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Week
              </button>
              <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg">
                Today
              </button>
            </div>
          </div>
          <p className="text-gray-600">Calendar view will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;