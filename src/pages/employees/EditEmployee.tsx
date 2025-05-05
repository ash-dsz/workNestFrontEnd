import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import fallbackimage from "../../Assets/Images/fallBackProfilePic.jpg";
import Docbackimage from "../../Assets/Images/documentFallBackImage.jpg";
import { toast } from "react-toastify"; // Importing toast library
import emailValidator from "email-validator";
import { Save, Trash } from "lucide-react";

const EditEmployee: React.FC = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();

	const [formData, setFormData] = useState<any>({
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

	const [preview, setPreview] = useState({
		profilePic: null as string | null,
		documents: null as string | null,
	});

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const res = await API.get(`employees/${id}`);
				const emp = res.data;
				setFormData({
					name: emp.name || "",
					phone: emp.phone || "",
					email: emp.email || "",
					aadhar: emp.aadhar || "",
					pan: emp.pan || "",
					upi: emp.upi || "",
					salary: emp.monthlySalary || "",
					role: emp.role || "employee",
					password: emp.password,
					joindate: emp.joinDate
						? (() => {
								const date = new Date(emp.joinDate);
								const day = String(date.getDate()).padStart(2, "0");
								const month = String(date.getMonth() + 1).padStart(2, "0");
								const year = date.getFullYear();
								return `${year}-${month}-${day}`;
						  })()
						: "",

					profilePic: emp.profilePic
						? `${import.meta.env.VITE_API_URL}/${emp.profilePic}`
						: fallbackimage,
					documents: emp.DocId
						? `${import.meta.env.VITE_API_URL}/${emp.DocId}`
						: Docbackimage,
				});
			} catch (error) {
				console.error("Error fetching employee:", error);
			}
		};

		fetchEmployees();
	}, [id]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, files } = e.target as HTMLInputElement;

		if (files && files.length > 0) {
			const file = files[0];
			setFormData((prev: any) => ({ ...prev, [name]: file }));

			const previewUrl = URL.createObjectURL(file);

			if (name === "profilePic" || name === "documents") {
				setPreview((prev) => ({ ...prev, [name]: previewUrl }));
			}
		} else {
			setFormData((prev: any) => ({ ...prev, [name]: value }));
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
			!formData.joindate
		) {
			toast.error("Please fill in all required fields.");
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
		if (formData.password) data.append("password", formData.password);

		if (formData.profilePic) data.append("profilePic", formData.profilePic);
		if (formData.documents) data.append("documents", formData.documents);
		// Email validation
		if (formData.email && !emailValidator.validate(formData.email)) {
			toast.error("Invalid email address.");
			return;
		}
		try {
			const response = await API.put(`/employees/edit/${id}`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (response.data.success === false) {
				toast.error(response.data.message || "Failed to update employee.");
				return;
			}

			toast.success("Employee updated successfully!");
		} catch (error) {
			toast.error("Error occurred while updating: " + error);
		}
	};

	const calculateDailySalary = () => {
		const monthly = parseFloat(formData.salary || "0");
		return (monthly / 30).toFixed(2);
	};

	const handleDelete = async () => {
		try {
			const res = await API.put(`employees/delete/${id}`);
			if (res.data.success === false) {
				toast.error(res.data.message || "Failed to update employee.");
				return;
			}
			// Show success message
			toast.success("User Deleted");
			navigate(`/employees`);
		} catch (error) {
			console.error("Error fetching employee:", error);
		}
	};

	const confirmDelete = () => {
		toast.info(
			({ closeToast }) => (
				<div className="flex flex-col gap-2">
					<p>Are you sure you want to delete this employee?</p>
					<div className="flex gap-2 justify-end">
						<button
							onClick={() => {
								closeToast();
								handleDelete();
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
		<div className="p-6 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Employee</h1>
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

				{/* JOIN DATE */}
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
				{/* PROFILE PICTURE */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Profile Picture
					</label>
					<input
						type="file"
						name="profilePic"
						accept="image/*"
						onChange={handleChange}
						className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					{preview.profilePic ? (
						<a
							href={formData.profilePic}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={preview.profilePic}
								alt="New Preview"
								className="w-24 h-24 rounded-full object-cover mt-2"
							/>
						</a>
					) : (
						typeof formData.profilePic === "string" && (
							<a
								href={formData.profilePic}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={formData.profilePic}
									alt="Existing Profile"
									className="w-24 h-24 rounded-full object-cover mt-2"
								/>
							</a>
						)
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
					{preview.documents ? (
						<a
							href={preview.documents!}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={preview.documents}
								alt="New Document Preview"
								className="w-24 h-24 rounded-full object-cover mt-2"
							/>
						</a>
					) : (
						typeof formData.documents === "string" && (
							<a
								href={formData.documents}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={formData.documents}
									alt="Existing Document"
									className="w-24 h-24 rounded-full object-cover mt-2"
								/>
							</a>
						)
					)}
				</div>

				{/* BUTTONS - SAME ROW */}
				<div className="md:col-span-2 flex items-center gap-4">
					<button
						type="submit"
						className="w-36 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
					>
						<Save className="w-4 h-4" />
						Update
					</button>

					<button
						type="button"
						onClick={confirmDelete}
						className="w-36 py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
					>
						<Trash className="w-4 h-4" />
						Delete
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditEmployee;
