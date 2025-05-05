import React, { useEffect, useState } from "react";
import {
	Clock,
	User,
	CheckCircle,
	XCircle,
	FileText,
	Calendar,
	Trash2,
} from "lucide-react";
import API from "../../services/api";
import { EmployeeLog } from "../../Interface/Employee/IEmployeeLog";
import { toast } from "react-toastify";

const AutoLogs: React.FC = () => {
	const [search, setSearch] = useState<string>("");
	const [employees, setEmployees] = useState<EmployeeLog[]>([]);
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0]
	);

	const fetchEmployees = async (date: string) => {
		try {
			const res = await API.get(`/attendance/getabsenteesforthismonth/${date}`);
			const mapped = res.data.map((emp: any) => ({
				id: emp._id,
				employeeName: emp.employeeName,
				date: emp.date,
				absentType: emp.absentType,
				reason: emp.reason,
				markedByName: emp.markedByName,
			}));
			setEmployees(mapped);
		} catch (error) {
			console.error("Error fetching employees:", error);
		}
	};

	useEffect(() => {
		fetchEmployees(selectedDate);
	}, [selectedDate]);

	const handleDelete = async (id: String, index: number) => {
		try {
			const res = await API.put(`attendance/deleteabsentrecord/${id}`);
			if (res.data.success === false) {
				toast.error(res.data.message || "Failed to update employee.");
				return;
			}
			// Show success message
			toast.success("User Deleted");
			const updated = [...employees];
			updated.splice(index, 1);
			setEmployees(updated);
		} catch (error) {
			console.error("Error fetching employee:", error);
		}
	};

	const filteredLogs = employees.filter((log) =>
		log.employeeName.toLowerCase().includes(search.toLowerCase())
	);

	const confirmDelete = (id: String, index: number) => {
		toast.info(
			({ closeToast }) => (
				<div className="flex flex-col gap-2">
					<p>Are you sure you want to delete this employee?</p>
					<div className="flex gap-2 justify-end">
						<button
							onClick={() => {
								closeToast();
								handleDelete(id, index);
							}}
							className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
						>
							Delete
						</button>
						<button
							onClick={closeToast}
							className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
						>
							Cancel
						</button>
					</div>
				</div>
			),
			{
				autoClose: false,
				closeOnClick: false,
			}
		);
	};
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
				<Clock className="w-6 h-6 text-indigo-600" />
				Monthly Absentees Log - Total Logs: {filteredLogs.length}
			</h1>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<input
						type="text"
						placeholder="Search employee..."
						className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<input
						type="date"
						className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredLogs.length === 0 ? (
						<div className="col-span-full text-center py-6 text-gray-500">
							No matching logs found
						</div>
					) : (
						filteredLogs.map((log, index) => (
							<div
								key={index}
								className="bg-white border rounded-xl shadow-md p-5 flex flex-col justify-between gap-4 relative"
							>
								{/* Header: Marked By & Delete */}
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<CheckCircle className="w-5 h-5 text-green-500" />
										<span>Marked by: {log.markedByName}</span>
									</div>
									<button
										onClick={() => confirmDelete(log.id, index)}
										className="text-red-600 hover:text-red-800 transition"
										title="Delete log"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>

								{/* Employee Info */}
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<User className="w-4 h-4 text-indigo-500" />
										<span className="font-semibold text-lg text-gray-800">
											{log.employeeName}
										</span>
									</div>
									<div className="text-sm text-gray-500 flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										<b>
											{new Date(log.date).toLocaleDateString("en-GB", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</b>
									</div>
								</div>

								{/* Absent Type */}
								<div className="flex items-center gap-2 text-sm">
									<XCircle className="w-4 h-4 text-red-500" />
									<span className="text-gray-600">Absent Type:</span>
									<span
										className={`font-medium ${
											log.absentType === "0.5"
												? "text-green-600"
												: log.absentType === "Exit"
												? "text-yellow-600"
												: "text-blue-600"
										}`}
									>
										{log.absentType === "0.5"
											? "Half Day Absent"
											: "Full Day Absent"}
									</span>
								</div>

								{/* Reason */}
								<div className="flex items-center gap-2 text-sm">
									<FileText className="w-4 h-4 text-blue-500" />
									<span className="text-gray-600">Reason:</span>
									<span className="text-gray-800">
										{log.reason === "Successful" ? "Present" : log.reason}
									</span>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default AutoLogs;
