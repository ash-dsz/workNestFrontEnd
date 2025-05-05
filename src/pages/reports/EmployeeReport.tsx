// Redesigned EmployeeReport.tsx
import React, { useEffect, useState } from "react";
import { BarChart3, CalendarDays, UserX, UserCheck } from "lucide-react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const colorMap: Record<string, string> = {
	blue: "bg-blue-50 text-blue-600",
	red: "bg-red-50 text-red-600",
	green: "bg-green-50 text-green-600",
	yellow: "bg-yellow-50 text-yellow-600",
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

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

const EmployeeMonthlyReport: React.FC = () => {
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth()
	);
	const [selectedYear, setSelectedYear] = useState<number>(
		new Date().getFullYear()
	);
	const [absents, setAbsents] = useState<any[]>([]);
	const [leaves, setLeaves] = useState<any[]>([]);
	const [totalDays, setTotalDays] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	const currentEmployeeId = sessionStorage.getItem("id");
	if (!currentEmployeeId) {
		const navigate = useNavigate();
		navigate("/");
	}
	useEffect(() => {
		fetchEmployeeData();
	}, [selectedMonth, selectedYear]);

	const fetchEmployeeData = async () => {
		setLoading(true);
		try {
			const year = selectedYear;
			const month = String(selectedMonth + 1).padStart(2, "0");
			setTotalDays(new Date(year, selectedMonth + 1, 0).getDate());

			const absentRes = await API.get("/attendance/getabsenteesbymonthandid", {
				params: {
					year,
					month: selectedMonth + 1,
					employeeId: currentEmployeeId,
				},
			});
			setAbsents(absentRes.data || []);

			const leaveRes = await API.get("/leaves/getleavebymonthandid", {
				params: {
					year,
					month: selectedMonth + 1,
					employeeId: currentEmployeeId,
				},
			});
			setLeaves(leaveRes.data || []);
		} catch (err) {
			console.error("Error fetching employee data:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Your Monthly Report
					</h1>
					<p className="text-gray-500">
						Attendance overview for {monthNames[selectedMonth]} {selectedYear}
					</p>
				</div>
				<div className="flex gap-3">
					<select
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
						className="border rounded-md px-3 py-2 text-sm"
					>
						{monthNames.map((month, index) => (
							<option key={index} value={index}>
								{month}
							</option>
						))}
					</select>
					<select
						value={selectedYear}
						onChange={(e) => setSelectedYear(parseInt(e.target.value))}
						className="border rounded-md px-3 py-2 text-sm"
					>
						{Array.from(
							{ length: 3 },
							(_, i) => new Date().getFullYear() - 1 + i
						).map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<StatCard icon={CalendarDays} label="Total Days" value={totalDays} />
				<StatCard
					icon={UserX}
					label="Your Absents"
					value={absents.length}
					color="red"
				/>
				<StatCard
					icon={UserCheck}
					label="Your Leaves"
					value={leaves.length}
					color="green"
				/>
				<StatCard
					icon={BarChart3}
					label="Month"
					value={`${monthNames[selectedMonth]} ${selectedYear}`}
				/>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<UserX className="h-5 w-5 text-red-500" /> Absents
				</h2>
				{loading ? (
					<p className="text-gray-500">Loading your absence data...</p>
				) : absents.length > 0 ? (
					<ul className="space-y-3">
						{absents.map((absent, idx) => (
							<li key={idx} className="flex items-center gap-3">
								<div className="bg-red-100 text-red-600 rounded-full p-2">
									<UserX className="w-5 h-5" />
								</div>
								<div>
									<p className="text-gray-800 font-medium">
										Absent on {formatDate(absent.date)}
									</p>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500">You have no absents this month.</p>
				)}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
					<UserCheck className="h-5 w-5 text-green-500" /> Leave Records
				</h2>
				{loading ? (
					<p className="text-gray-500">Loading your leave data...</p>
				) : leaves.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm border border-gray-200 rounded-md">
							<thead className="bg-gray-100 text-left text-gray-700">
								<tr>
									<th className="px-5 py-3">Leave Type</th>
									<th className="px-5 py-3">From</th>
									<th className="px-5 py-3">To</th>
									<th className="px-5 py-3">Days</th>
									<th className="px-5 py-3">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{leaves.map((leave, idx) => (
									<tr key={idx} className="hover:bg-gray-50">
										<td className="px-5 py-3">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
													leave.leaveType === "1"
														? "bg-red-100 text-red-600"
														: leave.leaveType === "0.5"
														? "bg-yellow-100 text-yellow-600"
														: "bg-green-100 text-green-600"
												}`}
											>
												{leave.leaveType === "1"
													? "Full Day"
													: leave.leaveType === "0.5"
													? "Half Day"
													: leave.leaveType}
											</span>
										</td>
										<td className="px-5 py-3 text-gray-600">
											{formatDate(leave.startDate)}
										</td>
										<td className="px-5 py-3 text-gray-600">
											{formatDate(leave.endDate)}
										</td>
										<td className="px-5 py-3 text-gray-600">
											{leave.totalLeaveDays}
										</td>
										<td className="px-5 py-3">
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
													leave.status === "Approved"
														? "bg-green-100 text-green-600"
														: leave.status === "Rejected"
														? "bg-red-100 text-red-600"
														: "bg-yellow-100 text-yellow-600"
												}`}
											>
												{leave.status || "Pending"}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-gray-500">
						You haven't taken any leaves this month.
					</p>
				)}
			</div>
		</div>
	);
};

export default EmployeeMonthlyReport;
