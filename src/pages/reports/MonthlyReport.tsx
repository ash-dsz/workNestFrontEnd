// Redesigned MonthlyReport.tsx
import React, { useEffect, useState } from "react";
import { BarChart3, CalendarDays, UserX, UserCheck } from "lucide-react";
import API from "../../services/api";

const colorMap: Record<string, string> = {
	blue: "bg-blue-50 text-blue-600",
	red: "bg-red-50 text-red-600",
	green: "bg-green-50 text-green-600",
};

const StatCard = ({
	icon: Icon,
	label,
	value,
	color = "blue",
}: {
	icon: React.ElementType;
	label: string;
	value: string | number;
	color?: string;
}) => {
	const colors = colorMap[color] || colorMap.blue;
	const [bgColor, textColor] = colors.split(" ");

	return (
		<div className="flex-1 bg-white p-5 rounded-xl shadow border border-gray-100 min-w-[220px]">
			<div className="flex justify-between items-center">
				<div>
					<p className="text-sm text-gray-500">{label}</p>
					<p className="text-2xl font-bold text-gray-900">{value}</p>
				</div>
				<div className={`p-3 rounded-full ${bgColor}`}>
					<Icon className={`h-6 w-6 ${textColor}`} />
				</div>
			</div>
		</div>
	);
};

const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

const MonthlyReport: React.FC = () => {
	const today = new Date().toISOString().split("T")[0];
	const [selectedDate, setSelectedDate] = useState<string>(today);
	const [leaves, setLeaves] = useState<any[]>([]);
	const [absents, setAbsents] = useState<any[]>([]);
	const [totalDays, setTotalDays] = useState<number>(0);

	const fetchData = async () => {
		try {
			const leaveRes = await API.get(
				`/leaves/getmonthlyleaverequest/${selectedDate}`
			);
			setLeaves(leaveRes.data || []);

			const absentRes = await API.get(
				`/attendance/getabsenteesforthismonth/${selectedDate}`
			);
			setAbsents(absentRes.data || []);

			const date = new Date(selectedDate);
			const year = date.getFullYear();
			const month = date.getMonth();
			setTotalDays(new Date(year, month + 1, 0).getDate());
		} catch (err) {
			console.error("Error fetching report data:", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, [selectedDate]);

	const selectedMonthName = new Date(selectedDate).toLocaleString("default", {
		month: "long",
		year: "numeric",
	});

	return (
		<div className="p-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Monthly Report</h1>
					<p className="text-gray-500">
						Overview for:{" "}
						<span className="font-semibold">{selectedMonthName}</span>
					</p>
				</div>
				<input
					type="date"
					value={selectedDate}
					onChange={(e) => setSelectedDate(e.target.value)}
					className="border rounded-md px-3 py-2 text-sm"
				/>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<StatCard icon={CalendarDays} label="Total Days" value={totalDays} />
				<StatCard
					icon={UserX}
					label="Total Absents"
					value={absents.length}
					color="red"
				/>
				<StatCard
					icon={UserCheck}
					label="Total Leaves"
					value={leaves.length}
					color="green"
				/>
				<StatCard icon={BarChart3} label="Month" value={selectedMonthName} />
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<UserX className="h-5 w-5 text-red-500" /> Absent Employees
				</h2>
				{absents.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{absents.map((emp, idx) => (
							<div
								key={idx}
								className="bg-white rounded-lg shadow-md border p-4 flex items-center space-x-4"
							>
								<div className="bg-red-100 text-red-600 rounded-full p-2">
									<UserX className="w-6 h-6" />
								</div>
								<div>
									<p className="font-medium text-gray-800">
										{emp.employeeName}
									</p>
									<p className="text-sm text-gray-500">
										Absent on {formatDate(emp.date)}
									</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">No absentees recorded for this date.</p>
				)}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<UserCheck className="h-5 w-5 text-green-500" /> Leave Records
				</h2>
				{leaves.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
							<thead className="bg-gray-100 text-gray-700 text-left">
								<tr>
									<th className="px-5 py-3">Employee</th>
									<th className="px-5 py-3">Leave Type</th>
									<th className="px-5 py-3">Start - End</th>
									<th className="px-5 py-3">Total Days</th>
									<th className="px-5 py-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{leaves.map((record, idx) => (
									<tr
										key={idx}
										className="hover:bg-gray-50 transition duration-200"
									>
										<td className="px-5 py-3 font-medium text-gray-800">
											{record.employeeName}
										</td>
										<td className="px-5 py-3">
											<span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
												{record.leaveType === "0.5" ? "Half-Day" : "Full-Day"}
											</span>
										</td>
										<td className="px-5 py-3 text-gray-600">
											{formatDate(record.startDate)} →{" "}
											{formatDate(record.endDate)}
										</td>
										<td className="px-5 py-3 text-gray-600">
											{record.totalLeaveDays}
										</td>
										<td className="px-5 py-3 text-gray-600">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
      ${record.status === "Approved" ? "bg-green-100 text-green-600" : ""}
      ${record.status === "Rejected" ? "bg-red-100 text-red-600" : ""}
      ${record.status === "Pending" ? "bg-yellow-100 text-yellow-600" : ""}
    `}
											>
												{record.status}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500">No leave records found for this date.</p>
				)}
			</div>
		</div>
	);
};

export default MonthlyReport;
