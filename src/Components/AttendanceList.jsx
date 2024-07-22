import React, { useEffect, useMemo, useState } from "react";
import { Table, tableFilters } from "@itwin/itwinui-react";
import TimeRangeFilter from "./TimeRangeFilter";
import "@itwin/itwinui-react/styles.css";
import "./Webcam.css";
import { useNavigate } from "react-router-dom";
import { getAttendances } from "../Constant/services";

function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const translatedLabels = useMemo(
    () => ({
      filter: "Filter",
      clear: "Clear",
      from: "From",
      to: "To",
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAttendances(selectedDate);
      console.log(res);
      setData(res.results);
    };

    fetchData();
  }, [selectedDate]);

  const columns = useMemo(
    () => [
      {
        Header: "Table",
        columns: [
          {
            Filter: tableFilters.TextFilter(translatedLabels),
            Header: "Name",
            accessor: "name",
            fieldType: "text",
            id: "name",
          },
          {
            Header: "In Time",
            accessor: (row) => (row.clock_in ? row.clock_in : ""),
            Cell: (props) => {
              const time = props.cell.row.original.clock_in;
              return time ? time : "-";
            },
            Filter: TimeRangeFilter,
            filter: "betweenTime",
            maxWidth: 120,
          },
          {
            Header: "Out Time",
            accessor: (row) => (row.clock_out ? row.clock_out : ""),
            Cell: (props) => {
              const time = props.cell.row.original.clock_out;
              return time ? time : "-";
            },
            maxWidth: 90,
          },
        ],
      },
    ],
    [translatedLabels]
  );

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("site-id");
      navigate("/");
    }
  };

  const betweenTime = (rows, id, filterValue) => {
    const [min, max] = filterValue;
    return rows.filter((row) => {
      const time = row.values[id];
      return time >= min && time <= max;
    });
  };

  const filterTypes = {
    betweenTime,
  };

  return (
    <div className="contianer">
      <div className="header">
        <span className="back-btn" onClick={() => navigate("/webcam")}>
          <i className="fa-solid fa-arrow-left"></i>
        </span>
        <span className="back-btn"> BAC भारत</span>
        <button className="logout-btn" onClick={logout}>
          Logout <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <div className="sub-container">
        <span>Today's Attendances :- {data.length || 0}</span>
      </div>
      <div className="date-container">
        <span> Select Date:-</span>
        <input
          className="datepicker"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          data={data}
          emptyTableContent="No data."
          emptyFilteredTableContent="No results found. Clear or try another filter."
          isSortable
          filterTypes={filterTypes}
        />
      </div>
    </div>
  );
}

export default AttendanceList;
