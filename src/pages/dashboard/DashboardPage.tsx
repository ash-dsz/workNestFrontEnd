"use client";
import {
	JSXElementConstructor,
	Key,
	ReactElement,
	ReactNode,
	ReactPortal,
	useEffect,
	useState,
} from "react";
import { Users, Clock, FileText, Wallet } from "lucide-react";
import API from "../../services/api"; // path same as EmployeeList.tsx

const StatCard = ({ icon: Icon, label, value }: any) => (
	<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm text-gray-500">{label}</p>
				<p className="text-2xl font-semibold mt-2">{value}</p>
			</div>
			<div className="p-3 bg-blue-50 rounded-full">
				<Icon className="h-6 w-6 text-blue-600" />
			</div>
		</div>
	</div>
);

const DashboardPage = () => {
	const [role, setRole] = useState<string | null>(null);
	const [employeeData, setEmployeeData] = useState<any>(null);
	const [managerData, setManagerData] = useState<any>(null);

	useEffect(() => {
		const userRole = sessionStorage.getItem("role");
		const userId = sessionStorage.getItem("id");
		setRole(userRole);

		const today = new Date();
		const year = today.getFullYear().toString();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		var data = {
			id: userId,
			year,
			month,
		};
		if (userRole === "employee") {
			API.post("/dashboard/employee", data)
				.then((res) => {
					setEmployeeData(res.data);
					console.log(res.data);
				})
				.catch((err) => {
					console.error("Failed to fetch employee dashboard data:", err);
				});
		} else {
			API.get("/dashboard/manager")
				.then((res) => {
					setManagerData(res.data);
					console.log(res.data);
				})
				.catch((err) => {
					console.error("Failed to fetch manager dashboard data:", err);
				});
		}
	}, []);

	if (!role) return <p>Loading...</p>;

	return (
		<div className="space-y-8">
			<h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>

			{role === "employee" && employeeData && (
				<>
					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<StatCard
							icon={FileText}
							label="Total Leaves (This Month)"
							value={employeeData.totalLeaves}
						/>
						<StatCard
							icon={Clock}
							label="Total Absents (This Month)"
							value={employeeData.totalAbsents}
						/>
					</div>

					{/* Recent Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<FileText className="text-blue-600" /> Recent Leaves
							</h3>
							<ul className="mt-4 space-y-2 text-sm text-gray-700">
								{employeeData.recentLeaves.map((leave: { leaveTitle: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; startDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; endDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
									<li key={index}>
										{leave.leaveTitle} — {leave.startDate} to {leave.endDate}
									</li>
								))}
							</ul>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<Clock className="text-blue-600" /> Recent Absents
							</h3>
							<ul className="mt-4 space-y-2 text-sm text-gray-700">
								{employeeData.recentAbsents.map((absent: { absentType: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
									<li key={index}>
										{absent.absentType} — {absent.date}
									</li>
								))}
							</ul>
						</div>
					</div>
				</>
			)}

			{role !== "employee" && managerData && (
				<>
					{/* Manager Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						<StatCard
							icon={Users}
							label="Total Employees"
							value={managerData.totalEmployees}
						/>
						<StatCard
							icon={FileText}
							label="Pending Leaves"
							value={managerData.pendingLeavesCount}
						/>
						<StatCard
							icon={Wallet}
							label="Monthly Payroll"
							value={`₹${managerData.monthlyPayroll}`}
						/>
						<StatCard
							icon={FileText}
							label="Leaves This Month"
							value={managerData.totalLeavesThisMonth}
						/>
						<StatCard
							icon={Clock}
							label="Absents This Month"
							value={managerData.totalAbsentsThisMonth}
						/>
					</div>

					{/* Manager Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<FileText className="text-blue-600" /> Recent Leaves
							</h3>
							<ul className="mt-4 space-y-2 text-sm text-gray-700">
								{managerData.recentLeaves.map((leave: { employeeName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; startDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; endDate: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
									<li key={index}>
										<strong>{leave.employeeName}</strong> — {leave.startDate} to{" "}
										{leave.endDate}
									</li>
								))}
							</ul>
						</div>

						<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
							<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<Clock className="text-blue-600" /> Recent Absents
							</h3>
							<ul className="mt-4 space-y-2 text-sm text-gray-700">
								{managerData.recentAbsents.map((absent: { employeeName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
									<li key={index}>
										<strong>{absent.employeeName}</strong> — {absent.date}
									</li>
								))}
							</ul>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DashboardPage;
