import { useState, useMemo, useEffect } from "react";
import Pagination from "../../components/table/Pagination";
import API from "../../services/api";
import { Employee } from "../../Interface/Employee/IEmployee.ts";
import fallbackimage from "../../Assets/Images/fallBackProfilePic.jpg";
import { ClipboardPen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const navigate = useNavigate();

	const fetchEmployees = async () => {
		try {
			const res = await API.get("/employees");
			const mapped = res.data.map((emp: any, idx: number) => ({
				id: emp._id,
				name: emp.name,
				role: emp.role,
				email: emp.email || "-",
				phone: emp.phone,
				salary: parseInt(emp.monthlySalary || "0"),
				image: emp.profilePic
					? `${import.meta.env.VITE_API_URL}/${emp.profilePic}`
					: fallbackimage,
			}));
			setEmployees(mapped);
		} catch (error) {
			console.error("Error fetching employees:", error);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const itemsPerPage = 5;

	const filteredEmployees = useMemo(() => {
		return employees.filter(
			(emp) =>
				emp.name?.toLowerCase().includes(search.toLowerCase()) ||
				emp.role?.toLowerCase().includes(search.toLowerCase()) ||
				emp.email?.toLowerCase().includes(search.toLowerCase())
		);
	}, [search, employees]);

	const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
	const currentItems = filteredEmployees.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage
	);

	const handlePageChange = (pageNum: number) => {
		if (pageNum >= 1 && pageNum <= totalPages) {
			setPage(pageNum);
		}
	};

	const handleEditRequest = (
		e: React.MouseEvent<HTMLButtonElement>,
		id: string
	) => {
		e.preventDefault();
		navigate(`/employees/edit/${id}`);
	};
	return (
		<div className="p-4 sm:p-6 max-w-6xl mx-auto">
			<h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
				Employee List
			</h1>

			<div className="mb-4">
				<input
					type="text"
					placeholder="Search employees..."
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(1);
					}}
					className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="max-h-[600px] overflow-x-auto bg-white shadow-md rounded">
				<table className="min-w-[640px] w-full text-sm text-left text-gray-700">
					<thead className="bg-gray-100 text-xs uppercase">
						<tr>
							<th className="px-4 sm:px-6 py-3">#</th>
							<th className="px-4 sm:px-6 py-3">Name</th>
							<th className="px-4 sm:px-6 py-3">Role</th>
							<th className="px-4 sm:px-6 py-3">Email</th>
							<th className="px-4 sm:px-6 py-3">Phone</th>
							<th className="px-4 sm:px-6 py-3">Salary</th>
							<th className="px-4 sm:px-6 py-3">Edit</th>
							<th className="px-4 sm:px-6 py-3">Details</th>
						</tr>
					</thead>
					<tbody>
						{currentItems.map((emp, i) => (
							<tr key={emp.id} className="border-b hover:bg-gray-50">
								<td className="px-4 sm:px-6 py-4">
									{(page - 1) * itemsPerPage + i + 1}
								</td>
								<td className="px-4 sm:px-6 py-4 flex items-center gap-2">
									<img
										src={emp.image}
										alt={emp.name}
										className="w-10 h-10 rounded-full object-cover"
									/>
									<span className="whitespace-nowrap">{emp.name}</span>
								</td>
								<td className="px-4 sm:px-6 py-4 capitalize">{emp.role}</td>
								<td className="px-4 sm:px-6 py-4">{emp.email}</td>
								<td className="px-4 sm:px-6 py-4">{emp.phone}</td>
								<td className="px-4 sm:px-6 py-4">₹{emp.salary}</td>
								<td className="px-4 sm:px-6 py-4">
									<button
										className="text-blue-600 hover:text-blue-800 transition-all duration-200"
										onClick={(e) => handleEditRequest(e, emp.id)}
									>
										<ClipboardPen size={20} strokeWidth={2} />
									</button>
								</td>
								<td className="px-4 sm:px-6 py-4">
									<button
										onClick={() =>
											navigate(`/reports/employeereportmanage/${emp.id}`)
										}
										className="text-green-600 hover:text-green-800 transition-all duration-200"
										title="View Details"
									>
										<Eye size={20} strokeWidth={2} />
									</button>
								</td>
							</tr>
						))}

						{currentItems.length === 0 && (
							<tr>
								<td colSpan={7} className="text-center py-4 text-gray-500">
									No employees found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<Pagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={(newPage) => setPage(newPage)}
			/>
		</div>
	);
};

export default EmployeeList;
