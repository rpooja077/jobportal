/**
 * CompaniesTable Component
 * 
 * A comprehensive table component for displaying and managing company information
 * in the admin dashboard. Provides search, filter, and action capabilities.
 * 
 * @component
 * @example
 * return <CompaniesTable />
 * 
 * @description
 * This component connects to the Redux store to access company data and search terms.
 * It provides a responsive table with the following features:
 * - Search functionality to filter companies by name
 * - Sortable columns
 * - Action menu for each company (Edit, Post Job, View Jobs)
 * - Empty state with call-to-action
 * - Responsive design for all screen sizes
 * 
 * @property {Array} companies - Array of company objects from Redux store
 * @property {string} searchCompanyByText - Current search term from Redux store
 * 
 * @state
 * @type {Array} filterCompany - Local state for filtered company list
 * 
 * @listens {Redux} companies - Watches for changes to companies data
 * @listens {Redux} searchCompanyByText - Watches for search term changes
 * 
 * @emits {navigate} - Uses React Router's navigate for page transitions
 */

import React, { useEffect, useState } from "react";
// UI Components from shadcn/ui
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
// State management and routing
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  // Get companies data and search term from Redux store
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();
  
  /**
   * Local state to store filtered companies
   * @type {[Array, Function]}
   */
  const [filterCompany, setFilterCompany] = useState(companies);

  /**
   * Filters companies based on search text
   * Updates filterCompany state whenever companies or search term changes
   */
  useEffect(() => {
    // Only proceed if companies data is available
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        // Return all companies if no search term is provided
        if (!searchCompanyByText) {
          return true;
        }
        // Filter companies by name (case-insensitive match)
        return company.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    // Update filtered companies in state
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);

  // Display loading state while fetching companies data
  if (!companies) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading companies...</p>
      </div>
    );
  }

  // Render the companies table with search and filter functionality
  return (
    <div className="table-responsive">
      <Table className="table table-hover mb-0">
        {/* Table caption showing total number of companies */}
        <TableCaption className="py-4 text-muted fw-medium">
          Your registered companies ({filterCompany?.length || 0} companies)
        </TableCaption>
        {/* Table Header */}
        <TableHeader>
          <TableRow className="table-light">
            <TableHead className="fw-semibold text-dark" style={{width: '80px'}}>Logo</TableHead>
            <TableHead className="fw-semibold text-dark">Company Name</TableHead>
            <TableHead className="fw-semibold text-dark">Created Date</TableHead>
            <TableHead className="fw-semibold text-dark">Status</TableHead>
            <TableHead className="text-end fw-semibold text-dark">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody>
          {/* Check if there are companies to display */}
          {filterCompany && filterCompany.length > 0 ? (
            // Map through each company and create a table row
            filterCompany.map((company) => (
              <TableRow key={company._id} className="align-middle">
                {/* Company Logo Cell */}
                <TableCell>
                  <div className="d-flex align-items-center justify-content-center">
                    {company.logo ? (
                      // Display company logo if available
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="rounded"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          border: '2px solid #e9ecef'
                        }}
                        // Handle image loading errors
                        onError={(e) => {
                          // Hide broken image and show fallback if image fails to load
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      // Fallback when no logo is available
                      <div 
                        className="rounded d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{
                          width: '50px',
                          height: '50px',
                          display: 'flex'
                        }}
                      >
                        <i className="bi bi-building fs-4"></i>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <h6 className="fw-semibold text-dark mb-1">{company.name}</h6>
                    <small className="text-muted">Company ID: {company._id?.slice(-8)}</small>
                  </div>
                </TableCell>
                <TableCell className="text-muted">
                  {company.createdAt ? 
                    new Date(company.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "N/A"
                  }
                </TableCell>
                <TableCell>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Active
                  </span>
                </TableCell>
                <TableCell className="text-end">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-three-dots"></i>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-3" style={{minWidth: '150px'}}>
                      <div className="mb-2">
                        <h6 className="fw-medium text-dark mb-2">Actions</h6>
                        <button
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          className="btn btn-link text-decoration-none p-2 w-100 text-start"
                        >
                          <i className="bi bi-pencil me-2 text-primary"></i>
                          Edit Company
                        </button>
                        <button
                          onClick={() => navigate(`/admin/jobs/create?company=${company._id}`)}
                          className="btn btn-link text-decoration-none p-2 w-100 text-start"
                        >
                          <i className="bi bi-briefcase me-2 text-success"></i>
                          Post Job
                        </button>
                        <button
                          onClick={() => navigate(`/admin/companies/${company._id}/jobs`)}
                          className="btn btn-link text-decoration-none p-2 w-100 text-start"
                        >
                          <i className="bi bi-list-ul me-2 text-info"></i>
                          View Jobs
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-5 text-muted">
                <div className="d-flex flex-column align-items-center gap-3">
                  <i className="bi bi-building text-muted" style={{fontSize: '3rem'}}></i>
                  <h5 className="fw-medium">No companies found</h5>
                  <p className="small mb-0">
                    {searchCompanyByText ? 
                      `No companies match "${searchCompanyByText}"` : 
                      "Start by creating your first company"
                    }
                  </p>
                  {!searchCompanyByText && (
                    <button 
                      onClick={() => navigate("/admin/companies/create")}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Company
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
