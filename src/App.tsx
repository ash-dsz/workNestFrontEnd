import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { Loader } from "./components/Loader";
import { Toast } from "./components/Toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Lazy load pages
const DashboardPage = React.lazy(
	() => import("./pages/dashboard/DashboardPage")
);
const EmployeeList = React.lazy(() => import("./pages/employees/EmployeeList"));
const AddEmployee = React.lazy(() => import("./pages/employees/AddEmployee"));
const EditEmployee = React.lazy(() => import("./pages/employees/EditEmployee"));
const EmployeeProfile = React.lazy(
	() => import("./pages/employees/EmployeeProfile")
);
const AttendanceOverview = React.lazy(
	() => import("./pages/attendance/Overview")
);
const AutoLogs = React.lazy(() => import("./pages/attendance/AutoLogs"));
const ManualAdjust = React.lazy(
	() => import("./pages/attendance/ManualAdjust")
);
const LeaveRequests = React.lazy(() => import("./pages/leaves/LeaveRequests"));
const ApplyLeave = React.lazy(() => import("./pages/leaves/ApplyLeave"));
const LeaveCalendar = React.lazy(() => import("./pages/leaves/LeaveCalendar"));
const ApproveLeave = React.lazy(() => import("./pages/leaves/ApproveLeave"));

const SalaryOverview = React.lazy(
	() => import("./pages/salary/SalaryOverview")
);
const SalarySlip = React.lazy(() => import("./pages/salary/SalarySlip"));
const DocumentUpload = React.lazy(
	() => import("./pages/documents/DocumentUpload")
);
const MonthlyReport = React.lazy(() => import("./pages/reports/MonthlyReport"));
const SummaryReport = React.lazy(() => import("./pages/reports/SummaryReport"));
const EmployeeReport = React.lazy(
	() => import("./pages/reports/EmployeeReport")
);
const LoginPage = React.lazy(() => import("./pages/login/loginpage"));

function App() {
	return (
		<Router>
			<ToastContainer />
			<Suspense fallback={<Loader />}>
				<Routes>
					{/* Public Route (no sidebar) */}
					<Route path="/" element={<LoginPage />} />

					{/* Protected Routes (with sidebar/layout) */}
					<Route
						path="/*"
						element={
							<Layout>
								<Routes>
									<Route path="dashboard" element={<DashboardPage />} />
									<Route path="employees" element={<EmployeeList />} />
									<Route path="employees/add" element={<AddEmployee />} />
									<Route path="employees/edit/:id" element={<EditEmployee />} />
									<Route path="employees/:id" element={<EmployeeProfile />} />
									<Route path="attendance" element={<AttendanceOverview />} />
									<Route path="attendance/auto-logs" element={<AutoLogs />} />
									<Route
										path="attendance/manual-adjust"
										element={<ManualAdjust />}
									/>
									<Route path="leaves/requests" element={<LeaveRequests />} />
									<Route path="leaves/apply" element={<ApplyLeave />} />
									<Route path="leaves/calendar" element={<LeaveCalendar />} />
									<Route path="leaves/approve" element={<ApproveLeave />} />
									<Route path="salary" element={<SalaryOverview />} />
									<Route path="salary/slip/:id" element={<SalarySlip />} />
									<Route path="documents" element={<DocumentUpload />} />
									<Route path="reports/monthly" element={<MonthlyReport />} />
									<Route path="reports/summary" element={<SummaryReport />} />
									<Route
										path="reports/employeereport"
										element={<EmployeeReport />}
									/>
								</Routes>
							</Layout>
						}
					/>
				</Routes>
			</Suspense>
			<Toast />
		</Router>
	);
}

export default App;
