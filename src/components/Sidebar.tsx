import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
	Users,
	Clock,
	BarChart3,
	Home,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	Calendar,
	X,
} from "lucide-react";

const role = sessionStorage.getItem("role");

const allMenuItems = [
	{
		icon: Home,
		label: "Dashboard",
		path: "/dashboard",
	},
	{
		icon: Users,
		label: "Employees",
		path: "/employees",
		children: [
			{ label: "Add Employee", path: "/employees/add" },
			{ label: "Manage Employees", path: "/employees" },
		],
	},
	{
		icon: Calendar,
		label: "Attendance",
		path: "/attendance",
		children: [
			{ label: "Mark Absent", path: "/attendance/manual-adjust" },
			{ label: "Absentees", path: "/attendance/auto-logs" },
		],
	},
	{
		icon: Clock,
		label: "Leaves",
		path: "/leaves",
		children: [
			{ label: "Apply Leave", path: "/leaves/apply" },
			{ label: "Approve Leave", path: "/leaves/approve" },
			{ label: "Leave Requests", path: "/leaves/requests" },
		],
	},
	{
		icon: BarChart3,
		label: "Reports",
		path: "/reports",
		children: [
			{ label: "Monthly Report", path: "/reports/monthly" },
			{ label: "Employee Report", path: "/reports/employeereport" },
		],
	},
];

const employeeMenuItems = [
	{ icon: Home, label: "Dashboard", path: "/dashboard" },

	{
		icon: Clock,
		label: "Leaves",
		path: "/leaves",
		children: [{ label: "Apply Leave", path: "/leaves/apply" }],
	},
	{
		icon: BarChart3,
		label: "Reports",
		path: "/reports",
		children: [{ label: "Employee Report", path: "/reports/employeereport" }],
	},
];

interface SidebarProps {
	isMobileOpen: boolean;
	onCloseMobile: () => void;
}
const menuItems = role === "employee" ? employeeMenuItems : allMenuItems;
export const Sidebar = ({ isMobileOpen, onCloseMobile }: SidebarProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleMenu = (label: string) => {
		setOpenMenus((prev) => ({
			...prev,
			[label]: !prev[label],
		}));
	};

	const handleItemClick = () => {
		if (isMobile) {
			onCloseMobile();
		}
	};

	const sidebarClass = isMobile
		? `fixed top-0 left-0 h-full bg-slate-900 z-50 transition-transform transform ${
				isMobileOpen ? "translate-x-0" : "-translate-x-full"
		  } w-64`
		: `bg-slate-900 text-white transition-all duration-300 ${
				isCollapsed ? "w-20" : "w-64"
		  }`;

	return (
		<aside className={sidebarClass}>
			<div className="flex justify-between items-center p-4">
				{!isMobile && (
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="p-2 hover:bg-slate-800 rounded-lg"
					>
						{isCollapsed ? (
							<ChevronRight className="h-5 w-5" />
						) : (
							<ChevronLeft className="h-5 w-5" />
						)}
					</button>
				)}

				{isMobile && (
					<button
						onClick={onCloseMobile}
						className="text-white p-2 hover:bg-slate-800 rounded-lg ml-auto"
					>
						<X className="h-5 w-5" />
					</button>
				)}
			</div>

			<nav className="mt-4">
				<ul className="space-y-2">
					{menuItems.map((item) => {
						const isOpen = openMenus[item.label];

						return (
							<li key={item.label}>
								{!item.children ? (
									<NavLink
										to={item.path}
										onClick={handleItemClick}
										className={({ isActive }) =>
											`flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-slate-800 hover:text-white ${
												isActive ? "text-white font-medium" : ""
											}`
										}
									>
										<item.icon className="h-5 w-5" />
										{!isCollapsed && (
											<span className="text-sm font-medium">{item.label}</span>
										)}
									</NavLink>
								) : (
									<>
										<div
											onClick={() => toggleMenu(item.label)}
											className="flex items-center justify-between px-6 py-3 text-gray-300 hover:bg-slate-800 hover:text-white cursor-pointer"
										>
											<div className="flex items-center gap-3">
												<item.icon className="h-5 w-5" />
												{!isCollapsed && (
													<span className="text-sm font-medium">
														{item.label}
													</span>
												)}
											</div>
											{!isCollapsed && (
												<span>
													{isOpen ? (
														<ChevronDown className="h-4 w-4" />
													) : (
														<ChevronLeft className="h-4 w-4" />
													)}
												</span>
											)}
										</div>

										{!isCollapsed && isOpen && (
											<ul className="ml-10 space-y-1 mt-1 text-sm text-gray-400">
												{item.children.map((child) => (
													<li key={child.label}>
														<NavLink
															to={child.path}
															onClick={handleItemClick}
															className={({ isActive }) =>
																`block py-1 hover:text-white ${
																	isActive ? "text-white font-medium" : ""
																}`
															}
														>
															{child.label}
														</NavLink>
													</li>
												))}
											</ul>
										)}
									</>
								)}
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
};
