import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import { toast } from "sonner";

// Helper function to get proper profile photo URL
const getProfilePhotoUrl = (rawUrl) => {
  console.log('🖼️ Raw profile photo URL:', rawUrl);
  if (!rawUrl) {
    console.log('❌ No profile photo URL provided');
    return "";
  }
  
  // Check if URL is actually a resume file (PDF, DOC, etc.)
  if (rawUrl.includes('.pdf') || rawUrl.includes('.doc') || rawUrl.includes('.txt')) {
    console.log('⚠️ URL appears to be a resume file, not a profile photo');
    return ""; // Return empty string to show fallback icon
  }
  
  if (rawUrl.startsWith("http")) {
    console.log('✅ External URL detected:', rawUrl);
    return rawUrl;
  }
  // handle relative stored paths like /uploads/...
  const fullUrl = `http://localhost:4000${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
  console.log('🔗 Constructed full URL:', fullUrl);
  return fullUrl;
};

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const { user } = useSelector((store) => store.auth);
  
  // Compute profile strength (students only)
  const computeProfileStrength = () => {
    const items = [];
    let score = 0;
    // Weights: resume 40, skills 30, bio 20, photo 10
    const hasResume = !!(user?.profile?.resume && user.profile.resume.trim() !== "");
    const hasSkills = Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0;
    const hasBio = !!(user?.profile?.bio && user.profile.bio.trim().length >= 20);
    const hasPhoto = !!(user?.profile?.profilePhoto && user.profile.profilePhoto.trim() !== "");
    
    if (hasResume) score += 40; else items.push('Upload your resume');
    if (hasSkills) score += 30; else items.push('Add at least 3 skills');
    if (hasBio) score += 20; else items.push('Write a short bio (20+ chars)');
    if (hasPhoto) score += 10; else items.push('Add a profile photo');
    
    if (score > 100) score = 100;
    return { score, items };
  };

  // Debug: Log user data to see profile photo
  console.log('Profile component - User data:', user);
  console.log('Profile component - Profile photo URL:', user?.profile?.profilePhoto);

  // production cleanup: removed test backend function

  // Check if user has a resume
  const hasResume = user?.profile?.resume && user?.profile?.resume.trim() !== "";

  // production cleanup: removed console debug

  // production cleanup: removed simple test

  // Handle resume view - DISABLED PDF VIEWER
  // const handleResumeView = (resumeUrl, fileName) => {
  //   console.log("Attempting to view resume:", { resumeUrl, fileName });
    
  //   if (!resumeUrl) {
  //     toast.error("No resume available");
  //     return;
  //   }

  //   try {
  //     // DISABLED: PDF viewer causing 401 errors
  //     // Instead, show a simple message
  //     toast.info("Resume view disabled to prevent 401 errors. Use download instead.");
      
  //     // Alternative: Open in new tab with text content
  //     if (resumeUrl.includes('/test-text')) {
  //       window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  //       toast.success("Opening text resume in new tab...");
  //     } else {
  //       toast.warning("PDF viewer disabled. Please use download option.");
  //     }
  //   } catch (error) {
  //     console.error("Error opening resume:", error);
  //     toast.error("Failed to open resume. Please try download instead.");
  //   }
  // };

  // NEW CODE  -------------------
const handleResumeView = (resumeUrl, fileName) => {
  if (!resumeUrl) {
    toast.error("No resume available");
    return;
  }
  try {
    // Use the same robust download URL (works even when inline view fails)
    let downloadUrl = resumeUrl;
    const isLocal = resumeUrl.includes('http://localhost:4000/resume/');
    const isCloudinary = resumeUrl.includes('res.cloudinary.com');
    if (isLocal) {
      downloadUrl = resumeUrl.replace('/resume/', '/download/');
    } else if (isCloudinary) {
      const name = fileName || `${user?.fullname}_Resume.pdf`;
      downloadUrl = resumeUrl.includes('?')
        ? `${resumeUrl}&fl_attachment=${encodeURIComponent(name)}`
        : `${resumeUrl}?fl_attachment=${encodeURIComponent(name)}`;
    }
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error("Error opening resume:", error);
    toast.error("Failed to open resume. Please try download instead.");
  }
};

  // --------------------

  // Handle resume download - IMPROVED
  // const handleResumeDownload = async (resumeUrl, fileName) => {
  //   console.log("Attempting to download resume:", { resumeUrl, fileName });
    
  //   if (!resumeUrl) {
  //     toast.error("No resume available");
  //     return;
  //   }

  //   try {
  //     toast.info("Downloading resume...");
      
  //     // Convert view URL to download URL
  //     const downloadUrl = resumeUrl.replace('/resume/', '/download/');
      
  //     // Create download link
  //     const link = document.createElement('a');
  //     link.href = downloadUrl;
  //     link.download = fileName || `${user?.fullname}_Resume`;
  //     link.target = '_blank';
  //     link.style.display = 'none';
      
  //     // Add to DOM and trigger download
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
      
  //     toast.success("Resume download started!");
  //   } catch (error) {
  //     console.error("Download error:", error);
  //     toast.error("Failed to download resume. Please try again.");
  //   }
  // };


  const handleResumeDownload = (resumeUrl, fileName) => {
  if (!resumeUrl) {
    toast.error("No resume available");
    return;
  }
  try {
    let downloadUrl = resumeUrl;
    const isLocal = resumeUrl.includes('http://localhost:4000/resume/');
    const isCloudinary = resumeUrl.includes('res.cloudinary.com');
    if (isLocal) {
      downloadUrl = resumeUrl.replace('/resume/', '/download/');
    } else if (isCloudinary) {
      // Ask Cloudinary to serve as attachment with filename
      const name = fileName || `${user?.fullname}_Resume.pdf`;
      downloadUrl = resumeUrl.includes('?')
        ? `${resumeUrl}&fl_attachment=${encodeURIComponent(name)}`
        : `${resumeUrl}?fl_attachment=${encodeURIComponent(name)}`;
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || `${user?.fullname}_Resume`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading resume:", error);
    toast.error("Failed to download resume. Please try again.");
  }
};

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">


            {/* Profile Header Card */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-5">
                <div className="row align-items-center">
                  <div className="col-md-3 text-center mb-4 mb-md-0">
                    <div className="position-relative d-inline-block">
                      <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" 
                           style={{width: '120px', height: '120px'}}>
                        {user?.profile?.profilePhoto ? (
                          <img 
                            src={user?.profile?.profilePhoto} 
                            alt="Profile" 
                            className="rounded-circle img-fluid"
                            style={{width: '120px', height: '120px', objectFit: 'cover'}}
                          />
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center w-100 h-100"
                            style={{
                              fontSize: '3rem',
                              color: '#0d6efd'
                            }}
                          >
                            <i className="bi bi-person"></i>
                          </div>
                        )}
                      </div>
                      <button 
                        className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle"
                        onClick={() => setOpen(true)}
                        style={{width: '35px', height: '35px'}}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h1 className="display-6 fw-bold text-dark mb-2">{user?.fullname}</h1>
                        <p className="lead text-muted mb-3">
                          {user?.profile?.bio || "No bio available"}
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="badge bg-primary fs-6 px-3 py-2">
                            <i className="bi bi-person-badge me-2"></i>
                            {user?.role}
                          </span>
                          {user?.profile?.skills && user?.profile?.skills.length > 0 && (
                            <span className="badge bg-success fs-6 px-3 py-2">
                              <i className="bi bi-tools me-2"></i>
                              {user?.profile?.skills.length} Skills
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setOpen(true)}
                        className="btn btn-outline-primary btn-lg"
                        variant="outline"
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Strength (Students only) */}
            {user?.role === 'Student' && (() => { const ps = computeProfileStrength(); return (
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-bold text-dark">Profile Strength</div>
                    <small className="text-muted">{ps.score}%</small>
                  </div>
                  <div className="progress" role="progressbar" aria-label="Profile strength" aria-valuenow={ps.score} aria-valuemin="0" aria-valuemax="100">
                    <div className={`progress-bar ${ps.score < 40 ? 'bg-danger' : ps.score < 70 ? 'bg-warning' : 'bg-success'}`} style={{width: `${ps.score}%`}}></div>
                  </div>
                  {ps.items.length > 0 && (
                    <ul className="mt-3 mb-0 text-muted small">
                      {ps.items.slice(0,3).map((t,idx) => (<li key={idx}>{t}</li>))}
                    </ul>
                  )}
                </div>
              </div>
            ); })()}

            {/* Career Tip of the Day (Students only) */}
            {user?.role === 'Student' && (
              <div className="card shadow-sm border-0 mb-4" style={{cursor:'pointer'}} onClick={() => setShowTip(true)}>
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="bg-warning bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{width:'48px', height:'48px'}}>
                    <i className="bi bi-lightbulb text-warning" style={{fontSize:'1.2rem'}}></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Career Tip of the Day</div>
                    <small className="text-muted">
                      {(() => {
                        const tips = [
                          'Always customize your resume before applying.',
                          'Learn SQL basics – it helps across many IT roles.',
                          'Keep your LinkedIn updated with recent projects.',
                          'Practice DSA 30–45 mins daily for tech interviews.',
                          'Write a concise cover letter highlighting impact.',
                          'Build 2–3 small projects that show end‑to‑end skills.',
                          'Read the job description carefully and mirror keywords.',
                          'Network politely – referrals can boost visibility.',
                          'Quantify achievements: numbers make impact clear.',
                          'Revise Git basics and common terminal commands.'
                        ];
                        const idx = new Date().getDate() % tips.length;
                        return tips[idx];
                      })()}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Tip Modal */}
            {showTip && (
              <div className="modal fade show d-block" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-warning bg-opacity-10">
                      <h5 className="modal-title fw-bold text-dark"><i className="bi bi-lightbulb me-2 text-warning"></i>Career Tip</h5>
                      <button type="button" className="btn-close" onClick={() => setShowTip(false)}></button>
                    </div>
                    <div className="modal-body">
                      <p className="mb-0 text-muted">
                        Small actions daily make a big difference. Use this tip today and take one step towards your goal.
                      </p>
                    </div>
                    <div className="modal-footer border-0">
                      <Link to="/browse" className="btn btn-primary" onClick={() => setShowTip(false)}>
                        <i className="bi bi-search me-2"></i>Browse Jobs
                      </Link>
                      <Link to="/saved" className="btn btn-outline-secondary" onClick={() => setShowTip(false)}>
                        <i className="bi bi-bookmark me-2"></i>Saved Jobs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pb-0">
                <h4 className="fw-bold text-dark mb-0">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Contact Information
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-envelope text-primary fs-5"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Email</small>
                        <a href={`mailto:${user?.email}`} className="text-decoration-none fw-semibold text-dark">
                          {user?.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                        <i className="bi bi-telephone text-success fs-5"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Phone</small>
                        <a href={`tel:${user?.phoneNumber}`} className="text-decoration-none fw-semibold text-dark">
                          {user?.phoneNumber || "Not provided"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pb-0">
                <h4 className="fw-bold text-dark mb-0">
                  <i className="bi bi-tools text-primary me-2"></i>
                  Skills & Expertise
                </h4>
              </div>
              <div className="card-body">
                {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <Badge key={index} className="fs-6 px-3 py-2 bg-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-tools text-muted" style={{fontSize: '2rem'}}></i>
                    <p className="text-muted mt-2">No skills added yet</p>
                    <Button 
                      onClick={() => setOpen(true)}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Add Skills
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0 pb-0">
                <h4 className="fw-bold text-dark mb-0">
                  <i className="bi bi-file-earmark-text text-primary me-2"></i>
                  Resume
                </h4>
              </div>
              <div className="card-body">
                {/* production cleanup: removed debug/testing panel */}

                {hasResume ? (
                  <div className="d-flex flex-column gap-3">
                    {/* Resume Info */}
                    <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                          <i className="bi bi-file-earmark-text text-success fs-5"></i>
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold">Resume Available</h6>
                          {user?.profile?.resumeOriginalname && (
                            <small className="text-muted">{user.profile.resumeOriginalname}</small>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="d-flex gap-3 justify-content-center">
                      <button
                        onClick={() => handleResumeView(user?.profile?.resume, user?.profile?.resumeOriginalname)}
                        className="btn btn-primary btn-lg px-4"
                        title="View Resume"
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Resume
                      </button>
                      <button
                        onClick={() => handleResumeDownload(user?.profile?.resume, user?.profile?.resumeOriginalname)}
                        className="btn btn-success btn-lg px-4"
                        title="Download Resume"
                      >
                        <i className="bi bi-download me-2"></i>
                        Download Resume
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-file-earmark-text text-muted" style={{fontSize: '2rem'}}></i>
                    <p className="text-muted mt-2">No resume uploaded</p>
                    <div className="d-flex gap-2 justify-content-center mt-3">
                      <Button 
                        onClick={() => setOpen(true)}
                        className="btn btn-outline-success btn-sm"
                      >
                        Upload Resume
                      </Button>
                      
                      {/* production cleanup: removed test buttons */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Applied Jobs Section */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pb-0">
                <h4 className="fw-bold text-dark mb-0">
                  <i className="bi bi-briefcase text-primary me-2"></i>
                  Applied Jobs
                </h4>
              </div>
              <div className="card-body">
                <AppliedJob />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
