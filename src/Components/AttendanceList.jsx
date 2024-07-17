import React, { useCallback, useMemo } from "react";
import { Table, tableFilters } from "@itwin/itwinui-react";
import TimeRangeFilter from "./TimeRangeFilter";
import "@itwin/itwinui-react/styles.css";
import "./Webcam.css";

const data = [
  {
    inTime: "",
    outTime: "",
    name: "Name1",
  },
  {
    inTime: "",
    outTime: "",
    name: "Name2",
  },
  {
    inTime: "",
    outTime: "",
    name: "Name3",
  },
  {
    inTime: "",
    outTime: "",
    name: "Name4",
  },
];

function AttendanceList() {
  const translatedLabels = useMemo(
    () => ({
      filter: "Filter",
      clear: "Clear",
      from: "From",
      to: "To",
    }),
    []
  );

  const formatter = useMemo(() => new Intl.DateTimeFormat("en-us"), []);

  const formatTime = useCallback((date) => {
    if (date) {
      const time = new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return time;
    }

    return "";
  }, []);

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
            accessor: (row) => (row.inTime ? row.inTime : ""),
            Cell: (props) => {
              const time = props.cell.row.original.inTime;
              return time ? time : "";
            },
            Filter: TimeRangeFilter,
            filter: "betweenTime",
            maxWidth: 120,
          },
          {
            Header: "Out Time",
            accessor: (row) => (row.outTime ? row.outTime : ""),
            Cell: (props) => {
              const time = props.cell.row.original.outTime;
              return time ? time : "";
            },
            // Filter: TimeRangeFilter,
            // filter: "betweenTime",
            maxWidth: 90,
          },
        ],
      },
    ],
    [translatedLabels, formatTime]
  );

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("site-id");
      navigate("/");
    }
  };

  return (
    <div className="contianer">
      <div className="header">
        <span className="back-btn">
          {" "}
          <i className="fa-solid fa-arrow-left"></i>
        </span>
        <span className="back-btn"> BAC भारत</span>
        <button className="logout-btn" onClick={logout}>
          Logout <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <div className="sub-container">
        <span>Today's Attendances :- {55}</span>
      </div>
      <div className="date-container">
        <span> Select Date:-</span>
        <input className="datepicker" type="date" name="" id="" />
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          data={data}
          emptyTableContent="No data."
          emptyFilteredTableContent="No results found. Clear or try another filter."
          isSortable
        />
      </div>
    </div>
  );
}

export default AttendanceList;
