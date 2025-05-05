import React, { useState } from 'react';
import { CalendarDays, User } from 'lucide-react';

const dummyAttendanceData = [
  {
    id: 1,
    name: 'Amit Kumar',
    date: '2025-04-01',
    status: 'Present',
    leaveType: '',
    perDaySalary: 1200,
  },
  {
    id: 2,
    name: 'Riya Mehra',
    date: '2025-04-01',
    status: 'Half Day',
    leaveType: 'Half Day',
    perDaySalary: 1000,
  },
  {
    id: 3,
    name: 'Manoj Singh',
    date: '2025-04-01',
    status: 'Leave',
    leaveType: 'Full Day',
    perDaySalary: 1100,
  },
];

const AttendanceOverview: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredData = dummyAttendanceData.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-blue-600" />
        Attendance Overview
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search employee..."
            className="border border-gray-300 rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-sm text-gray-500">
            Total Records: {filteredData.length}
          </span>
        </div>

        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Leave Type</th>
              <th className="px-4 py-2">Per Day Salary</th>
              <th className="px-4 py-2">Payable for Day</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No matching records found
                </td>
              </tr>
            ) : (
              filteredData.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    {emp.name}
                  </td>
                  <td className="px-4 py-3">{emp.date}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      emp.status === 'Present'
                        ? 'text-green-600'
                        : emp.status === 'Half Day'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }`}
                  >
                    {emp.status}
                  </td>
                  <td className="px-4 py-3">{emp.leaveType || '-'}</td>
                  <td className="px-4 py-3">₹{emp.perDaySalary}</td>
                  <td className="px-4 py-3">
                    ₹
                    {emp.status === 'Present'
                      ? emp.perDaySalary
                      : emp.status === 'Half Day'
                      ? emp.perDaySalary / 2
                      : 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceOverview;
