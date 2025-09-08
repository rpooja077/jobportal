import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const getGuidance = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "accepted") {
    return "Your application has been accepted. The recruiter will contact you soon for the next round.";
  }
  if (s === "rejected") {
    return "Your application was not selected. Keep applying and sharpening your profile and skills.";
  }
  return "Your application is under review. Please wait for the recruiter's update via call or email.";
};

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.jobs);
  console.log("allAppliedJobs:", allAppliedJobs);
  return (
    <div>
      <Table>
        <TableCaption>Recent Applied Jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <span>You have not applied any job yet. </span>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.createdAt.split("T")[0]}</TableCell>
                <TableCell>{appliedJob.job?.title}</TableCell>
                <TableCell>{appliedJob.job?.company.name}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-500"
                        : appliedJob?.status === "accepted"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {appliedJob?.status}
                  </Badge>
                  <div className="text-muted mt-1" style={{fontSize: '0.8rem'}}>
                    {getGuidance(appliedJob?.status)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJob;
