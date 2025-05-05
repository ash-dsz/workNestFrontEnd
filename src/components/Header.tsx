import { Settings, User, Menu, LogOut } from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
	const navigate = useNavigate();

	const LogOutUser = () => {
		sessionStorage.removeItem("id");
		sessionStorage.removeItem("role");
		navigate("/");
	};

	useEffect(() => {
		const employeeId = sessionStorage.getItem("id");
		const employeeRole = sessionStorage.getItem("role");
		// If no employee ID, redirect to login
		if (!employeeId || !employeeRole) {
			navigate("/"); // Redirect to the login page
		}
	}, [navigate]);
	return (
		<header className="bg-white border-b border-gray-200">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-4">
						{/* Hamburger - Mobile Only */}
						<button
							className="md:hidden p-2 text-gray-500 hover:text-gray-700"
							onClick={onToggleSidebar}
						>
							<Menu className="h-6 w-6" />
						</button>

						<h1 className="text-2xl font-semibold text-blue-600">
							<NavLink to={"/dashboard"}>WorkNest</NavLink>
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<button className="p-1 text-gray-400 hover:text-gray-500">
							<User className="h-6 w-6" />
						</button>
						<button className="p-1 text-gray-400 hover:text-gray-500">
							<Settings className="h-6 w-6" />
						</button>
						<button
							className="p-1 text-gray-400 hover:text-gray-500"
							onClick={LogOutUser}
						>
							<LogOut className="h-6 w-6" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};
