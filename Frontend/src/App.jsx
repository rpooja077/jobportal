import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import Navbar from "./components/components_lite/Navbar";
import Home from "./components/components_lite/Home";
import Footer from "./components/components_lite/Footer";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import EmailVerification from "./components/authentication/EmailVerification";
import Profile from "./components/components_lite/Profile";
import RecruiterProfile from "./components/components_lite/RecruiterProfile";
import Description from "./components/components_lite/Description";
import Browse from "./components/components_lite/Browse";
import JobsPage from "./components/components_lite/JobsPage";
import SavedJobs from "./components/components_lite/SavedJobs";
import ProtectedRoute from "./components/authentication/ProtectedRoute";

// Admin Components
import AdminJobs from "./components/admincomponent/AdminJobs";
import AdminCompanies from "./components/admincomponent/AdminCompanies";
import AdminJobsTable from "./components/admincomponent/AdminJobsTable";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import ApplicantDetails from "./components/admincomponent/ApplicantDetails";
import AboutUsPage from "./components/creator/AboutUsPage";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position="top-center" richColors />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/creator" element={<AboutUsPage />} />
          <Route path="/Creator" element={<AboutUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/About" element={<AboutUsPage />} />
          
          {/* Protected Routes */}
          <Route path="/browse" element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } />
          <Route path="/Browse" element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          } />
          <Route path="/Jobs" element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/recruiter-profile" element={
            <ProtectedRoute>
              <RecruiterProfile />
            </ProtectedRoute>
          } />
          <Route path="/job/:id" element={
            <ProtectedRoute>
              <Description />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute><AdminCompanies /></ProtectedRoute>} />
          <Route path="/admin/companies/create" element={<ProtectedRoute><CompanyCreate /></ProtectedRoute>} />
          <Route path="/admin/companies/:id" element={<ProtectedRoute><CompanySetup /></ProtectedRoute>} />
          <Route path="/admin/companies/:id/jobs" element={<ProtectedRoute><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute><AdminJobsTable /></ProtectedRoute>} />
          <Route path="/admin/jobs/create" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id/edit" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoute><Applicants /></ProtectedRoute>} />
          <Route path="/admin/applications/:id" element={<ProtectedRoute><ApplicantDetails /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
