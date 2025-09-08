import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const navigate = useNavigate();
  const [viewingResume, setViewingResume] = useState(null);

  // Debug function to log applicant data
  const debugApplicantData = (item) => {
    console.log("Applicant Data:", {
      fullname: item?.applicant?.fullname,
      email: item?.applicant?.email,
      profile: item?.applicant?.profile,
      resume: item?.applicant?.profile?.resume,
      hasProfile: !!item?.applicant?.profile,
      applicantData: item?.applicant
    });
  };

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh the page or update state to reflect changes
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleResumeView = (resumeUrl, applicantName, fileName) => {
    if (!resumeUrl) {
      toast.error("No resume available for this applicant");
      return;
    }
    if (!resumeUrl.startsWith('http://') && !resumeUrl.startsWith('https://')) {
      toast.error("Invalid resume URL");
      return;
    }
    try {
      // Open remote URLs directly to avoid proxy 401/403
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error opening resume:", error);
      toast.error("Failed to open resume. Please try download instead.");
    }
  };

  const handleResumeDownload = async (resumeUrl, applicantName, fileName) => {
    console.log("Attempting to download resume:", { resumeUrl, applicantName, fileName });
    
    if (!resumeUrl) {
      toast.error("No resume available for this applicant");
      return;
    }

    if (!resumeUrl.startsWith('http://') && !resumeUrl.startsWith('https://')) {
      toast.error("Invalid resume URL");
      return;
    }

    try {
      toast.info(`Downloading ${applicantName}'s resume...`);
      
      let downloadUrl = resumeUrl;
      // Normalize scheme
      if (downloadUrl.startsWith('//')) downloadUrl = 'https:' + downloadUrl;

      const isLocal = downloadUrl.includes('https://jobportal-k289.onrender.com/resume/');
      const isCloudinary = downloadUrl.includes('res.cloudinary.com');
      if (isLocal) {
        downloadUrl = downloadUrl.replace('/resume/', '/download/');
      } else if (isCloudinary) {
        // Ensure raw delivery for non-images
        downloadUrl = downloadUrl.replace('/image/upload/', '/raw/upload/');
        const name = fileName || `${applicantName}_Resume.pdf`;
        downloadUrl = downloadUrl.includes('?')
          ? `${downloadUrl}&fl_attachment=${encodeURIComponent(name)}`
          : `${downloadUrl}?fl_attachment=${encodeURIComponent(name)}`;
      }
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || `${applicantName}_Resume`;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${applicantName}'s resume download started!`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download ${applicantName}'s resume. Please try again or contact the applicant.`);
    }
  };

  const checkResumeAvailability = (resumeUrl) => {
    if (!resumeUrl) return false;
    if (!resumeUrl.startsWith('http://') && !resumeUrl.startsWith('https://')) return false;
    return true;
  };

  return (
    <div className="table-responsive">
      <Table className="table table-hover mb-0">
        <TableCaption className="py-4 text-muted fw-medium">
          A list of your recent applied users ({applicants?.applications?.length || 0} applicants)
        </TableCaption>
        <TableHeader>
          <TableRow className="table-light">
            <TableHead className="fw-semibold text-dark">Full Name</TableHead>
            <TableHead className="fw-semibold text-dark">Email</TableHead>
            <TableHead className="fw-semibold text-dark">Contact</TableHead>
            <TableHead className="fw-semibold text-dark">Resume</TableHead>
            <TableHead className="fw-semibold text-dark">Status</TableHead>
            <TableHead className="fw-semibold text-dark">Date</TableHead>
            <TableHead className="text-end fw-semibold text-dark">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants && applicants?.applications?.length > 0 ? (
            applicants.applications.map((item) => {
              // Get resume data from multiple possible sources
              const resumeUrl = item.applicant?.resumeUrl || 
                               item.applicant?.profile?.resume || 
                               item.applicant?.resume;
              const resumeFileName = item.applicant?.resumeFileName || 
                                   item.applicant?.profile?.resumeOriginalname || 
                                   item.applicant?.resumeOriginalname;
              
              // Check if resume exists using multiple methods
              const hasResume = item.applicant?.hasResume || 
                               checkResumeAvailability(resumeUrl) ||
                               (resumeUrl && resumeUrl.trim() !== "");
              
              // Debug log for all applicants to see resume data
              console.log('🔍 Resume check for', item.applicant?.fullname, ':', {
                resumeUrl,
                resumeFileName,
                hasResume,
                hasResumeFromBackend: item.applicant?.hasResume,
                profileResume: item.applicant?.profile?.resume,
                applicantData: item.applicant
              });
              
              return (
                <TableRow key={item._id} className="align-middle">
                  <TableCell className="fw-medium text-dark">
                    {item?.applicant?.fullname || "N/A"}
                  </TableCell>
                  <TableCell className="text-muted">
                    {item?.applicant?.email || "N/A"}
                  </TableCell>
                  <TableCell className="text-muted">
                    {item?.applicant?.phoneNumber || "N/A"}
                  </TableCell>
                  <TableCell>
                    {hasResume ? (
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleResumeDownload(resumeUrl, item.applicant.fullname, resumeFileName)}
                          className="btn btn-outline-success btn-sm"
                          title="View Resume"
                        >
                          <i className="bi bi-eye me-1"></i>
                          View Resume
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          No Resume
                        </span>
                        <small className="text-muted">(Contact applicant)</small>
                        <button 
                          onClick={() => debugApplicantData(item)}
                          className="btn btn-sm btn-outline-info"
                          title="Debug Info"
                        >
                          <i className="bi bi-info-circle"></i>
                        </button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`badge ${item.status === 'pending' ? 'bg-warning' : item.status === 'accepted' ? 'bg-success' : 'bg-danger'} text-white`}>
                      <i className={`bi ${item.status === 'pending' ? 'bi-clock' : item.status === 'accepted' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                      {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted">
                    {item?.applicant?.createdAt ? 
                      new Date(item.applicant.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "N/A"
                    }
                  </TableCell>
                  <TableCell className="text-end">
                    {/* Accept/Reject Buttons */}
                    <div className="d-flex gap-1">
                      <button
                        onClick={() => statusHandler("Accepted", item?._id)}
                        className="btn btn-success btn-sm"
                        title="Accept Application"
                        disabled={item.status === 'accepted'}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Accept
                      </button>
                      <button
                        onClick={() => statusHandler("Rejected", item?._id)}
                        className="btn btn-danger btn-sm"
                        title="Reject Application"
                        disabled={item.status === 'rejected'}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Reject
                      </button>
                      <button
                        onClick={() => navigate(`/admin/applications/${item?._id}`)}
                        className="btn btn-outline-secondary btn-sm"
                        title="View Details"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </button>
                    </div>
                    
                    {/* Alternative: Dropdown Menu */}
                    <div className="mt-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="btn btn-outline-secondary btn-sm">
                            <i className="bi bi-three-dots"></i>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-3" style={{minWidth: '200px'}}>
                          <div className="mb-3">
                            <h6 className="fw-medium text-dark mb-2">Update Status</h6>
                            {shortlistingStatus.map((status, index) => (
                              <button
                                key={index}
                                onClick={() => statusHandler(status, item?._id)}
                                className="btn btn-link text-decoration-none p-2 w-100 text-start"
                                disabled={item.status === status.toLowerCase()}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`status-${item._id}`}
                                    value={status}
                                    checked={item.status === status.toLowerCase()}
                                    className="text-primary"
                                  />
                                  <span className={status === "Accepted" ? "text-success" : "text-danger"}>
                                    {status}
                                  </span>
                                  {item.status === status.toLowerCase() && (
                                    <span className="badge bg-primary">Current</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-5 text-muted">
                <div className="d-flex flex-column align-items-center gap-3">
                  <i className="bi bi-file-earmark-text text-muted" style={{fontSize: '3rem'}}></i>
                  <h5 className="fw-medium">No applicants yet</h5>
                  <p className="small mb-0">Applications will appear here once candidates apply</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
