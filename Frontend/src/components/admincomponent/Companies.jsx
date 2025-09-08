/**
 * Companies Component
 * 
 * This is the main component for the Companies page that displays and manages
 * the list of companies in the admin dashboard.
 * 
 * Key Features:
 * - Fetches and displays a list of all companies
 * - Provides search functionality to filter companies
 * - Allows adding new companies
 * - Renders the CompaniesTable component
 */

import React, { useEffect, useState } from "react";
// UI Components
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// Custom Components
import CompaniesTable from "./CompaniesTable";
// Routing
import { useNavigate } from "react-router-dom";
// Custom Hooks
import useGetAllCompanies from "@/hooks/usegetAllCompanies";
// Redux
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companyslice";

const Companies = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Custom hook to fetch all companies data
  useGetAllCompanies();
  
  // Local state for search input
  const [input, setInput] = useState("");
  
  // Redux dispatch function
  const dispatch = useDispatch();

  // Effect to update search text in Redux store when input changes
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* Header Card with Search and Add Button */}
            <div className="card shadow-lg border-0 mb-4">
              <div className="card-body p-4">
                {/* Flex container for responsive layout */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  {/* Page Title and Description */}
                  <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Companies</h1>
                    <p className="text-muted mb-0">
                      Manage your registered companies and their details
                    </p>
                  </div>
                  
                  {/* Search and Action Buttons */}
                  <div className="d-flex gap-2">
                    {/* Search Input */}
                    <div className="position-relative">
                      <Input
                        type="text"
                        placeholder="Search companies..."
                        className="form-control ps-5"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    </div>
                    
                    {/* Add Company Button */}
                    <Button
                      className="btn btn-primary"
                      onClick={() => navigate("/admin/companies/add")}
                    >
                      <i className="bi bi-plus-lg me-2"></i> Add Company
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies Table Card */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-0">
                {/* CompaniesTable Component */}
                <CompaniesTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
