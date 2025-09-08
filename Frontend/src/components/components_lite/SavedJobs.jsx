import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";

const SavedJobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.jobs);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("savedJobs") || "[]";
    try {
      const ids = JSON.parse(raw);
      setSavedIds(Array.isArray(ids) ? ids : []);
    } catch {
      setSavedIds([]);
    }
  }, []);

  const savedJobs = useMemo(() => {
    console.log('SavedJobs - savedIds:', savedIds);
    console.log('SavedJobs - allJobs count:', allJobs?.length);
    
    const rawData = localStorage.getItem('savedJobsData');
    let cached = [];
    if (rawData) {
      try { 
        cached = JSON.parse(rawData) || []; 
        console.log('SavedJobs - cached data:', cached);
      } catch { cached = []; }
    }
    
    if (!savedIds.length && cached.length) {
      console.log('SavedJobs - returning cached data');
      return cached;
    }
    if (!savedIds.length) {
      console.log('SavedJobs - no saved IDs');
      return [];
    }
    
    const fromStore = allJobs.filter((job) => savedIds.includes(job._id));
    console.log('SavedJobs - fromStore:', fromStore);
    
    // fallback to cached if store is empty
    const result = fromStore.length ? fromStore : cached;
    console.log('SavedJobs - final result:', result);
    return result;
  }, [allJobs, savedIds]);

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />

      <div className="container py-5">
        <div className="text-center mb-5">
          <div className="bg-primary text-white rounded-4 p-5 mb-4">
            <h1 className="display-6 fw-bold mb-1">Saved Jobs</h1>
            <p className="mb-0">Review and apply to your shortlisted roles</p>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-white rounded-4 p-5 shadow-sm">
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="bi bi-bookmark text-muted" style={{ fontSize: "2rem" }}></i>
              </div>
              <h4 className="text-muted mb-2">No Saved Jobs</h4>
              <p className="text-muted mb-0">Use the Save button on a job to shortlist it</p>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {savedJobs.map((job, index) => (
              <div key={job._id || job.id || index} className="col">
                <Job1 job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;


