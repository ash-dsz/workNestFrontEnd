import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Select from "react-select";
import { toast } from "react-toastify";

const ManualAdjust: React.FC = () => {
	const [form, setForm] = useState({
		employeeName: "",
		date: "",
		status: "",
		reason: "",
	});
	const [selectedEmployee, setSelectedEmployee] = useState<{
		value: string;
		label: string;
	} | null>(null);
	const [employees, setEmployees] = useState([]);
	// Map for react-select format
	const employeeOptions = employees.map((emp: any) => ({
		value: emp.id,
		label: emp.name,
	}));
	const loadEmployeeName = async () => {
		try {
			const res = await API.get("/employees/getemployeesname");
			const mapped = res.data.map((emp: any) => ({
				id: emp._id,
				name: emp.name,
			}));
			setEmployees(mapped);
		} catch (error) {
			console.error("Error fetching employees:", error);
		}
	};

	useEffect(() => {
		loadEmployeeName();
	}, []);
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleReset = () => {
		setForm({
			employeeName: "",
			date: "",
			status: "",
			reason: "",
		});
		setSelectedEmployee(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { employeeName, date, status, reason } = form;

		if (!employeeName || !date || !status || !reason.trim()) {
			toast.error("Please fill in all fields before submitting.");
			return;
		}

		try {
			const payload = {
				employeeId: employeeName,
				date,
				absentType: status,
				reason,
				markedBy: "67fb84a2d36008a148091432",
			};

			const res = await API.post("/attendance/addrecord", payload);

			if (res.data.success) {
				toast.success("Absent record added successfully!");
				handleReset();
			} else {
				toast.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			console.error("Error submitting absent record:", error);
			toast.error("Server error while submitting.");
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">
				Manual Attendance Adjustment-Mark Absent
			</h1>
			<div className="bg-white rounded-lg shadow p-6">
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-1 md:grid-cols-2 gap-6"
				>
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Employee Name <span className="text-red-600">*</span>
						</label>
						<Select
							options={employeeOptions}
							value={selectedEmployee}
							onChange={(selectedOption) => {
								setSelectedEmployee(selectedOption);
								setForm((prev) => ({
									...prev,
									employeeName: selectedOption?.value || "",
								}));
							}}
							isClearable
							placeholder="Search and select an employee"
							styles={{
								control: (base) => ({
									...base,
									padding: "2px",
									borderRadius: "0.5rem",
									borderColor: "#d1d5db",
								}),
							}}
						/>
					</div>

					{/* Date */}
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Date <span className="text-red-600">*</span>
						</label>
						<input
							type="date"
							name="date"
							value={form.date}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						/>
					</div>

					{/* Attendance Status */}
					<div>
						<label className="block text-gray-700 font-medium mb-1">
							Attendance Status <span className="text-red-600">*</span>
						</label>
						<select
							name="status"
							value={form.status}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						>
							<option value="" disabled>
								-- Select status --
							</option>
							<option value="0.5">Half Day Absent</option>
							<option value="1">Full Day Absent</option>
						</select>
					</div>

					{/* Reason */}
					<div className="md:col-span-2">
						<label className="block text-gray-700 font-medium mb-1">
							Reason for Adjustment <span className="text-red-600">*</span>
						</label>
						<textarea
							name="reason"
							value={form.reason}
							onChange={handleChange}
							rows={4}
							placeholder="e.g., Emergency leave, missed punch, etc."
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
						/>
					</div>

					{/* Buttons */}
					<div className="md:col-span-2 flex justify-end gap-4 mt-4">
						<button
							type="button"
							onClick={handleReset}
							className="px-5 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100"
						>
							Reset
						</button>
						<button
							type="submit"
							className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
						>
							Save Adjustment
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ManualAdjust;
