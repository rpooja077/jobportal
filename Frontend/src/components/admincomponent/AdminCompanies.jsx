import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CompaniesTable from './CompaniesTable';
import useGetAllCompanies from '@/hooks/usegetAllCompanies';

const AdminCompanies = () => {
  useGetAllCompanies();
  const { companies } = useSelector((store) => store.company);

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        {/* Header Section */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-5">
            <div className="d-flex align-items-center gap-4 mb-4">
              <div className="w-25 h-25 bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center">
                <i className="bi bi-building text-white fs-1"></i>
              </div>
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">Manage Companies</h1>
                <p className="lead text-muted mb-0">Create and manage your company profiles</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3">
              <Link to="/admin/companies/create" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-plus-circle me-2"></i>
                Create New Company
              </Link>
              <Link to="/admin" className="btn btn-outline-secondary btn-lg px-4">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="card shadow-lg border-0">
          <div className="card-body p-0">
            <CompaniesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCompanies;
