import React, { useState, useEffect } from "react";
import {
	CalendarRange,
	Clock,
	User,
	UserCheck,
	FileText,
	StickyNote,
	CheckCircle,
	XCircle,
} from "lucide-react";
import API from "../../services/api"; // Make sure API instance is configured correctly

type LeaveRequest = {
	_id: string;
	employeeName: string;
	leaveType: string;
	startDate: string;
	endDate: string;
	totalLeaveDays: string;
	reason: string;
	status: "Pending" | "Approved" | "Rejected";
	markedByName: string;
};

const statusStyle = {
	Pending: "bg-yellow-100 text-yellow-800",
	Approved: "bg-green-100 text-green-800",
	Rejected: "bg-red-100 text-red-800",
};

const statusIcon = {
	Pending: <Clock className="w-4 h-4" />,
	Approved: <CheckCircle className="w-4 h-4" />,
	Rejected: <XCircle className="w-4 h-4" />,
};

const LeaveRequests: React.FC = () => {
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState<string>(
		today.toISOString().split("T")[0]
	);
	const [filter, setFilter] = useState<
		"All" | "Pending" | "Approved" | "Rejected"
	>("All");
	const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

	const fetchLeaves = async (date: string) => {
		try {
			const res = await API.get(`/leaves/getmonthlyleaverequest/${date}`);
			console.log(res.data);
			setLeaveRequests(res.data);
		} catch (error) {
			console.error("Error fetching leave data:", error);
		}
	};

	useEffect(() => {
		fetchLeaves(selectedDate);
	}, [selectedDate]);

	const selected = new Date(selectedDate);
	const selectedMonth = selected.getMonth();
	const selectedYear = selected.getFullYear();

	const filteredByMonth = leaveRequests.filter((req) => {
		const reqDate = new Date(req.startDate);
		return (
			reqDate.getMonth() === selectedMonth &&
			reqDate.getFullYear() === selectedYear
		);
	});

	const filtered =
		filter === "All"
			? filteredByMonth
			: filteredByMonth.filter((r) => r.status === filter);

	return (
		<div className="p-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
					<p className="text-sm text-gray-600 mt-1">
						Showing leaves for:{" "}
						<span className="font-semibold">
							{new Date(selectedDate).toLocaleString("default", {
								month: "long",
								year: "numeric",
							})}
						</span>
					</p>
				</div>
				<input
					type="date"
					value={selectedDate}
					onChange={(e) => setSelectedDate(e.target.value)}
					className="border rounded-md px-3 py-2 text-sm"
				/>
			</div>

			<div className="flex flex-wrap gap-3 mb-6">
				{["All", "Pending", "Approved", "Rejected"].map((s) => (
					<button
						key={s}
						onClick={() => setFilter(s as any)}
						className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
							filter === s
								? "bg-blue-600 text-white"
								: "bg-white text-gray-700 hover:bg-gray-100"
						}`}
					>
						{s}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<p className="text-gray-500">No leave requests for this month.</p>
			) : (
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{filtered.map((req) => (
						<div
							key={req._id}
							className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
									<User className="w-5 h-5 text-blue-600" />
									{req.employeeName}
								</div>
								<span
									className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
										statusStyle[req.status]
									}`}
								>
									{statusIcon[req.status]} {req.status}
								</span>
							</div>

							<div className="space-y-2 text-sm text-gray-700">
								<div className="flex items-center gap-2">
									<FileText className="w-4 h-4 text-indigo-500" />
									<span className="font-medium">Leave Type:</span>{" "}
									{req.leaveType}
								</div>

								<div className="flex items-center gap-2">
									<CalendarRange className="w-4 h-4 text-emerald-500" />
									<span className="font-medium">Date:</span>
									<div className="flex items-center gap-1 text-[13px] bg-gray-100 rounded-md px-2 py-0.5">
										{req.startDate}
										<span className="mx-1">→</span>
										{req.endDate}
									</div>
								</div>

								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4 text-yellow-600" />
									<span className="font-medium">Days:</span>{" "}
									{req.totalLeaveDays}
								</div>

								<div className="flex items-start gap-2">
									<StickyNote className="w-4 h-4 text-gray-500 mt-0.5" />
									<div>
										<span className="font-medium">Reason:</span>{" "}
										<span className="italic">{req.reason}</span>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<UserCheck className="w-4 h-4 text-purple-600" />
									<span className="font-medium">Marked By:</span>{" "}
									{req.markedByName}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default LeaveRequests;
