import React, { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ApplyLeave: React.FC = () => {
	const [form, setForm] = useState({
		leaveType: "",
		attendanceStatus: "",
		startDate: "",
		endDate: "",
		reason: "",
	});
	const [totalDays, setTotalDays] = useState<number | null>(0);

	const employeeId = sessionStorage.getItem("id");
	if (!employeeId) {
		const navigate = useNavigate();
		navigate("/");
	}
	const todayDate = new Date().toISOString().split("T")[0];

	// Calculate total leave days
	const calculateLeaveDays = (start: string, end: string, status: string) => {
		if (start && end) {
			const startDate = new Date(start);
			const endDate = new Date(end);
			const timeDiff = endDate.getTime() - startDate.getTime();

			if (timeDiff >= 0) {
				const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
				const attendance = parseFloat(status || "1");
				const total = dayDiff * attendance;
				setTotalDays(total);
			} else {
				setTotalDays(null);
			}
		} else {
			setTotalDays(null);
		}
	};

	// Handle input change
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;

		if (name === "reason" && value.length > 100) return;

		const updatedForm = { ...form, [name]: value };
		setForm(updatedForm);

		// Recalculate total days
		calculateLeaveDays(
			updatedForm.startDate,
			updatedForm.endDate,
			updatedForm.attendanceStatus
		);
	};

	// Reset form
	const handleReset = () => {
		setForm({
			leaveType: "",
			attendanceStatus: "",
			startDate: "",
			endDate: "",
			reason: "",
		});
		setTotalDays(0);
	};

	// Submit leave request
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { startDate, endDate, leaveType, attendanceStatus, reason } = form;
		const today = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);
		const todayOnlyDate = new Date(today.toISOString().split("T")[0]); // Midnight version of today

		if (!leaveType || !attendanceStatus || !startDate || !endDate || !reason) {
			toast.error("Please fill all required fields.");
			return;
		}

		if (start < todayOnlyDate || end < todayOnlyDate) {
			toast.error("Leave cannot be applied for today or past dates.");
			return;
		}

		if (end < start) {
			toast.error("End date must be after start date.");
			return;
		}

		try {
			const payload = {
				employeeId,
				startdate: startDate,
				endate: endDate,
				leaveTitle: leaveType,
				leaveType: attendanceStatus,
				reason,
			};

			const res = await API.post("/leaves/addnewleaverrequest", payload);

			if (res.data.success) {
				toast.success("Leave request submitted successfully!");
				handleReset();
			} else {
				toast.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			console.error("Submission Error:", error);
			toast.error("Server error while submitting.");
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h1>

			<div className="bg-white rounded-xl shadow-md p-6">
				<form className="space-y-6" onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label
								htmlFor="leaveType"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Leave Type <span className="text-red-600">*</span>
							</label>
							<select
								id="leaveType"
								name="leaveType"
								value={form.leaveType}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								<option value="">-- Select Leave Type --</option>
								<option>Casual Leave</option>
								<option>Sick Leave</option>
								<option>Annual Leave</option>
								<option>Other</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="attendanceStatus"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Attendance Status <span className="text-red-600">*</span>
							</label>
							<select
								id="attendanceStatus"
								name="attendanceStatus"
								value={form.attendanceStatus}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								<option value="">-- Select Status --</option>
								<option value="1">Full Day Absent</option>
								<option value="0.5">Half Day Absent</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label
								htmlFor="startDate"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Start Date <span className="text-red-600">*</span>
							</label>
							<input
								type="date"
								id="startDate"
								name="startDate"
								value={form.startDate}
								onChange={handleChange}
								min={todayDate}
								className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>

						<div>
							<label
								htmlFor="endDate"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								End Date <span className="text-red-600">*</span>
							</label>
							<input
								type="date"
								id="endDate"
								name="endDate"
								value={form.endDate}
								onChange={handleChange}
								min={form.startDate || todayDate}
								className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="reason"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Reason <span className="text-red-600">*</span>
						</label>
						<textarea
							id="reason"
							name="reason"
							rows={4}
							value={form.reason}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
							placeholder="Please provide a reason for your leave request (max 100 characters)..."
						/>
						<p className="text-sm text-gray-500 mt-1">
							Character Count: {form.reason.length} / 100
						</p>
					</div>

					<div className="mt-4">
						<p className="text-sm font-medium text-blue-600">
							Total Leave Days: {totalDays ?? "--"}
						</p>
					</div>

					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={handleReset}
							className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
						>
							Reset
						</button>
						<button
							type="submit"
							className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Submit Request
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ApplyLeave;
