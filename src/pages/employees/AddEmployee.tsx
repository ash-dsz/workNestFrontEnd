import React, { useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify"; // Importing toast library
import emailValidator from "email-validator";
import { Save } from "lucide-react";

const AddEmployee = () => {
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		aadhar: "",
		pan: "",
		upi: "",
		salary: "",
		role: "employee",
		profilePic: null,
		documents: null,
		joindate: "",
		password: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const target = e.target as HTMLInputElement;
		const { name, value, files } = target;

		if (files && files.length > 0) {
			setFormData((prev) => ({ ...prev, [name]: files[0] }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation for mandatory fields
		if (
			!formData.name ||
			!formData.phone ||
			!formData.aadhar ||
			!formData.salary ||
			!formData.joindate ||
			!formData.password
		) {
			toast.error("Please fill in all required fields.");
			return;
		}

		// Email validation
		if (formData.email && !emailValidator.validate(formData.email)) {
			toast.error("Invalid email address.");
			return;
		}

		const data = new FormData();
		data.append("name", formData.name);
		data.append("phone", formData.phone);
		data.append("email", formData.email);
		data.append("aadhar", formData.aadhar);
		data.append("pan", formData.pan);
		data.append("upi", formData.upi);
		data.append("salary", formData.salary);
		data.append("role", formData.role);
		data.append("joindate", formData.joindate);
		data.append("password", formData.password);

		if (formData.profilePic) {
			data.append("profilePic", formData.profilePic);
		}

		if (formData.documents) {
			data.append("documents", formData.documents);
		}

		try {
			const response = await API.post("/employees", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// Check if response success is false
			if (response.data.success === false) {
				toast.error(response.data.message); // Display error message sent by backend
				return;
			}

			if (response.data.success) {
				toast.success("Employee added successfully!");
				// Clear the form fields after successful submission
				setFormData({
					name: "",
					phone: "",
					email: "",
					aadhar: "",
					pan: "",
					upi: "",
					salary: "",
					role: "employee",
					profilePic: null,
					documents: null,
					joindate: "",
					password: "",
				});
			}
		} catch (error) {
			toast.error("Error occurred: " + error);
		}
	};

	const calculateDailySalary = () => {
		const monthly = parseFloat(formData.salary || "0");
		return (monthly / 30).toFixed(2);
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-8 text-gray-800">
				Add New Employee
			</h1>

			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
			>
				{/* NAME */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Full Name <span className="text-red-600">*</span>
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>

				{/* PHONE */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Phone Number <span className="text-red-600">*</span>
					</label>
					<input
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>

				{/* EMAIL */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Email
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>

				{/* AADHAR */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Aadhar Number <span className="text-red-600">*</span>
					</label>
					<input
						type="text"
						name="aadhar"
						value={formData.aadhar}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>

				{/* PAN */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						PAN Number
					</label>
					<input
						type="text"
						name="pan"
						value={formData.pan}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>

				{/* UPI */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						UPI ID
					</label>
					<input
						type="text"
						name="upi"
						value={formData.upi}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>

				{/* SALARY */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Monthly Salary (₹) <span className="text-red-600">*</span>
					</label>
					<input
						type="number"
						name="salary"
						value={formData.salary}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
					{formData.salary && (
						<p className="text-xs text-gray-500 mt-1">
							Daily Salary: ₹{calculateDailySalary()}
						</p>
					)}
				</div>

				{/* ROLE */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Role
					</label>
					<select
						name="role"
						value={formData.role}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					>
						<option value="owner">Owner</option>
						<option value="manager">Manager</option>
						<option value="employee">Employee</option>
					</select>
				</div>

				{/* JOINDATE */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Join Date <span className="text-red-600">*</span>
					</label>
					<input
						type="date"
						name="joindate"
						value={formData.joindate}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>
				{/* PASSWORD */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Password <span className="text-red-600">*</span>
					</label>
					<input
						type="text"
						name="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
					/>
				</div>
				{/* PROFILE PIC */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Profile Picture
					</label>
					<input
						type="file"
						name="profilePic"
						onChange={handleChange}
						accept="image/png, image/jpeg, image/jpg"
						className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					{formData.profilePic && (
						<img
							src={URL.createObjectURL(formData.profilePic)}
							alt="Preview"
							className="w-24 h-24 rounded-full object-cover mt-2"
						/>
					)}
				</div>

				{/* DOCUMENTS */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Documents (Aadhar/PAN)
					</label>
					<input
						type="file"
						name="documents"
						onChange={handleChange}
						accept="image/png, image/jpeg, image/jpg"
						className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					{formData.documents && (
						<img
							src={URL.createObjectURL(formData.documents)}
							alt="Preview"
							className="w-24 h-24 rounded-full object-cover mt-2"
						/>
					)}
				</div>

				{/* SUBMIT */}
				<div className="col-span-1 md:col-span-2">
					<button
						type="submit"
						className="w-36 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
					>
						<Save className="w-4 h-4" />
						Add Employee
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddEmployee;
