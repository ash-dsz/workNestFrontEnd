export interface LeaveRequest {
	id: number;
	employeeName: string;
	startdate: string;
	enddate: string;
	leaveTitle: string;
	leaveType: string;
	reason: string;
	totalLeaveDays: number;
	status: "Pending" | "Approved" | "Rejected";
}
