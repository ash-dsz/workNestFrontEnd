// ...imports remain the same
import React, { useState, useEffect } from "react";
import {
	User,
	Calendar,
	FileText,
	Clock,
	CheckCircle,
	XCircle,
	Hourglass,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";
import { LeaveRequest } from "../../Interface/Leaves/ILeave.ts";

const ApproveLeave: React.FC = () => {
	const [leaves, setleaves] = useState<LeaveRequest[]>([]);

	const fetchleaves = async () => {
		try {
			const res = await API.get(`/leaves/getpendingleaverequest`);
			const mapped: LeaveRequest[] = res.data.map((emp: any) => ({
				id: emp._id,
				employeeName: emp.employeeName,
				startdate: emp.startDate,
				enddate: emp.endDate,
				leaveTitle: emp.leaveTitle,
				leaveType: emp.leaveType,
				reason: emp.reason,
				totalLeaveDays: emp.totalLeaveDays,
				status: emp.status,
			}));
			setleaves(mapped);
		} catch (error) {
			console.error("Error fetching leaves:", error);
		}
	};

	useEffect(() => {
		fetchleaves();
	}, []);

	const handleAction = async (
		id: number,
		newStatus: "Approved" | "Rejected"
	) => {
		try {
			// Update status on the backend
			var data = {
				leaveid: id,
				markedBy: "67fb84a2d36008a148091432",
				status: newStatus,
			};
			console.log(data);
			const res = await API.put(`/leaves/updateleavestatus`, data);
			if (res.data.success) {
				// If backend update is successful, update the local state
				const updated = leaves.map((req) =>
					req.id === id ? { ...req, status: newStatus } : req
				);
				setleaves(updated);

				const updatedReq = updated.find((req) => req.id === id);
				if (updatedReq) {
					toast.success(
						`${newStatus} for ${updatedReq.employeeName}'s leave request!`
					);
				}
			} else {
				toast.error(
					res.data.message || "Something went wrong while updating status."
				);
			}
		} catch (error) {
			console.error("Error updating leave status:", error);
			toast.error("Error updating leave status.");
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<Clock className="text-indigo-600" />
				Leave Approval Dashboard
			</h1>

			{leaves.length === 0 ? (
				<div className="text-center text-gray-500 text-lg mt-10">
					🚫 No leave requests found.
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
					{leaves.map((request) => (
						<div
							key={request.id}
							className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between"
						>
							{/* Header with Name & Status */}
							<div className="flex justify-between items-start mb-4 flex-wrap gap-2">
								<h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
									<User className="w-5 h-5 text-indigo-500" />
									{request.employeeName}
								</h2>
								<div className="flex flex-col items-end gap-2">
									<div className="flex items-center gap-1">
										<span
											className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
												request.status === "Approved"
													? "bg-green-100 text-green-700"
													: request.status === "Rejected"
													? "bg-red-100 text-red-700"
													: "bg-yellow-100 text-yellow-700"
											}`}
										>
											{request.status === "Approved" && (
												<CheckCircle className="w-4 h-4" />
											)}
											{request.status === "Rejected" && (
												<XCircle className="w-4 h-4" />
											)}
											{request.status === "Pending" && (
												<Hourglass className="w-4 h-4" />
											)}
											{request.status}
										</span>
									</div>
								</div>
							</div>

							{/* All info in one line */}
							<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-700">
								<div className="flex items-center gap-1">
									<Calendar className="w-4 h-4 text-gray-500" />
									<span>
										<span className="font-medium">From:</span>{" "}
										{request.startdate}
									</span>
									<span className="mx-1">→</span>
									<span>
										<span className="font-medium">To:</span> {request.enddate}
									</span>
								</div>

								<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
									{/* Type Info */}
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4 text-gray-500" />
										<span>
											<span className="font-medium">Type:</span>{" "}
											{request.leaveType === "1"
												? "Full Day"
												: request.leaveType === "0.5"
												? "Half Day"
												: request.leaveType}
										</span>
										<span className="mx-1">→</span>
										<span className="flex gap-1">
											<Calendar className="w-4 h-4 text-indigo-400" />
											<span>{request.totalLeaveDays} Day(s)</span>
										</span>
									</div>
								</div>

								<div className="flex items-center gap-1">
									<FileText className="w-4 h-4 text-gray-500" />
									<span>
										<span className="font-medium">Reason:</span>{" "}
										{request.reason}
									</span>
								</div>
							</div>

							{/* Buttons for Pending Status */}
							{request.status === "Pending" && (
								<div className="flex gap-3 mt-4 border-t pt-3">
									<button
										onClick={() => handleAction(request.id, "Approved")}
										className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm transition"
									>
										<CheckCircle className="w-4 h-4" />
										Approve
									</button>
									<button
										onClick={() => handleAction(request.id, "Rejected")}
										className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition"
									>
										<XCircle className="w-4 h-4" />
										Reject
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			<ToastContainer />
		</div>
	);
};

export default ApproveLeave;
