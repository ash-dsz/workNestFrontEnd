import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import { Lock, Smartphone } from "lucide-react";

const LoginPage = () => {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!phone || !password) {
			toast.error("Please enter both mobile number and password.");
			return;
		}
		var data = { phone, password };

		try {
			const res = await API.post("/auth/authenticateuser", data);
			if (res.data._id && res.data.role) {
				sessionStorage.setItem("id", res.data._id);
				sessionStorage.setItem("role", res.data.role);
				toast.success("Login successful");
				navigate("/dashboard");
				window.location.reload();
			} else {
				toast.error(res.data.message || "Login failed");
			}
		} catch (error) {
			toast.error("Something went wrong while logging in.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-100">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
				<h1 className="text-3xl font-bold text-slate-800 text-center mb-6">
					<span className="text-blue-600">WorkNest</span>
				</h1>
				<p className="text-center text-sm text-gray-500 mb-6">
					Welcome back! Please login to continue.
				</p>
				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Mobile Number
						</label>
						<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
							<Smartphone className="h-5 w-5 text-gray-400 mr-2" />
							<input
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full outline-none text-sm"
								placeholder="Enter your mobile number"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
							<Lock className="h-5 w-5 text-gray-400 mr-2" />
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full outline-none text-sm"
								placeholder="Enter your password"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
