import React, { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

interface LayoutProps {
	children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex flex-col min-h-screen">
			<Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
			<div className="flex flex-1">
				<Sidebar
					isMobileOpen={sidebarOpen}
					onCloseMobile={() => setSidebarOpen(false)}
				/>
				<main className="flex-1 p-6 overflow-auto bg-gray-50">{children}</main>
			</div>
		</div>
	);
};
