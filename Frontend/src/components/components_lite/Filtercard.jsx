import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    icon: "bi-geo-alt",
    array: [
      "Delhi",
      "Mumbai",
      "Kolhapur",
      "Pune",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Remote",
    ],
  },
  {
    filterType: "Technology",
    icon: "bi-code-slash",
    array: [
      "Mern",
      "React",
      "Data Scientist",
      "Fullstack",
      "Node",
      "Python",
      "Java",
      "Frontend",
      "Backend",
      "Mobile",
      "Desktop",
    ],
  },
  {
    filterType: "Experience",
    icon: "bi-briefcase",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    icon: "bi-currency-dollar",
    array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
  },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center">
            <i className="bi bi-funnel text-white fs-5"></i>
          </div>
          <div>
            <h3 className="fw-bold text-dark mb-1">Filter Jobs</h3>
            <p className="text-muted small mb-0">Find your perfect job match</p>
          </div>
        </div>
        
        {/* Filter Options */}
        <div className="mb-4">
          <RadioGroup value={selectedValue} onValueChange={handleChange}>
            {filterData.map((data, index) => (
              <div key={index} className="mb-4 pb-4 border-bottom border-light">
                <h5 className="fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className={`bi ${data.icon} text-primary`}></i>
                  {data.filterType}
                </h5>

                <div className="row g-2">
                  {data.array.map((item, indx) => {
                    const itemId = `filter-${index}-${indx}`;
                    return (
                      <div key={itemId} className="col-12">
                        <div className="form-check">
                          <RadioGroupItem 
                            value={item} 
                            id={itemId}
                            className="form-check-input"
                          />
                          <label 
                            htmlFor={itemId} 
                            className="form-check-label text-muted fw-medium cursor-pointer"
                          >
                            {item}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Active Filter Display */}
        {selectedValue && (
          <div className="alert alert-primary border-0 mb-0">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-primary"></i>
              <span className="fw-medium">Active Filter:</span>
              <span className="fw-bold">{selectedValue}</span>
              <button 
                onClick={() => setSelectedValue("")}
                className="btn btn-sm btn-outline-primary ms-auto"
              >
                <i className="bi bi-x"></i>
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-top border-light">
          <div className="row text-center">
            <div className="col-4">
              <div className="text-primary fw-bold fs-5">150+</div>
              <div className="text-muted small">Jobs Available</div>
            </div>
            <div className="col-4">
              <div className="text-success fw-bold fs-5">50+</div>
              <div className="text-muted small">Companies</div>
            </div>
            <div className="col-4">
              <div className="text-info fw-bold fs-5">25+</div>
              <div className="text-muted small">Locations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
