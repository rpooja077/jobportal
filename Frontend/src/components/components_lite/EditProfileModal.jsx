import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";

const EditProfileModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
    profilePhoto: null,
  });

  // Update input when user data changes
  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null,
        profilePhoto: null,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile photo must be less than 5MB");
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, JPEG, PNG, GIF, or WebP)");
        e.target.value = '';
        return;
      }
      
      console.log('✅ Valid profile photo selected:', file.name, file.type, file.size);
      setInput({ ...input, profilePhoto: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.file) {
      formData.append("resume", input.file);
    }

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${USER_API_ENDPOINT}/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        console.log('Profile update response:', res.data);
        console.log('Updated user data:', res.data.user);
        console.log('Profile photo URL:', res.data.user?.profile?.profilePhoto);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">
              <i className="bi bi-pencil-square text-primary me-2"></i>
              Edit Profile
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setOpen(false)}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-person me-2 text-primary"></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={input.fullname}
                    name="fullname"
                    onChange={changeEventHandler}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={input.email}
                    name="email"
                    onChange={changeEventHandler}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Bio / Expertise */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-chat-text me-2 text-primary"></i>
                    {user?.role === 'Recruiter' ? 'Expertise' : 'Bio'}
                  </label>
                  <textarea
                    className="form-control"
                    value={input.bio}
                    name="bio"
                    onChange={changeEventHandler}
                    placeholder={user?.role === 'Recruiter' ? 'Describe your expertise and focus areas' : 'Tell us about yourself'}
                    rows="3"
                  ></textarea>
                </div>

                {/* Skills */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-tools me-2 text-primary"></i>
                    Skills
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={input.skills}
                    name="skills"
                    onChange={changeEventHandler}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  <small className="text-muted">Separate skills with commas</small>
                </div>

                {/* Resume Upload - Students only */}
                {user?.role === 'Student' && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                      Resume
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    <small className="text-muted">PDF, DOC, or DOCX files only</small>
                  </div>
                )}

                {/* Profile Photo Upload */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-camera me-2 text-primary"></i>
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="profilePhoto"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    onChange={handleProfilePhotoChange}
                  />
                  <small className="text-muted">JPG, JPEG, PNG, GIF, or WebP files only (Max: 5MB)</small>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
