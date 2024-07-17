import React, { useState } from "react";
import "./Webcam.css";

const TimeRangeFilter = ({
  column: { filterValue = [], setFilter },
  placeholder,
}) => {
  const [startTime, setStartTime] = useState(filterValue[0] || "");
  const [endTime, setEndTime] = useState(filterValue[1] || "");
  console.log(filterValue);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);

  const handleEndTimeChange = (e) => setEndTime(e.target.value);

  const handleFilter = () => setFilter([startTime, endTime]);
  const handleClearFilter = () => {
    setFilter([]);
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="timepicker-container">
      <span>From</span>
      <input
        className="time-input"
        type="time"
        value={startTime}
        onChange={handleStartTimeChange}
        placeholder={placeholder}
      />
      <span> To </span>
      <input
        className="time-input"
        type="time"
        value={endTime}
        onChange={handleEndTimeChange}
        placeholder={placeholder}
      />
      <button className="filter-btn" onClick={handleFilter}>
        Filter
      </button>
      <button className="clear-btn" onClick={handleClearFilter}>
        Clear
      </button>
    </div>
  );
};

export default TimeRangeFilter;
