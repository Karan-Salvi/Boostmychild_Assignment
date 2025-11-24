import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Attendance from "./Attendance";
import { useGetAttendanceByDateQuery } from "../store/api/attendanceApi";
import AddStudent from "./AddStudent";

const Calender = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const {
    data: attendanceData,
    refetch: refetchAttendance,
    isLoading: attendanceLoading,
  } = useGetAttendanceByDateQuery(selectedDate, {
    skip: !selectedDate,
  });

  const handleDateClick = (arg) => {
    console.log(arg);
    const picked = arg.date.toLocaleDateString("en-CA");
    setSelectedDate(picked);
    setOpenModal(true);
  };
  return (
    <div className="overflow-hidden p-5 m-2 border border-gray-200 rounded-md shadow-sm ">
      <FullCalendar
        className="scheduler-header"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        dayCellContent={(info) => {
          const dateStr = info.date.toLocaleDateString("en-CA");

          const record = attendanceData?.monthSummary?.find(
            (rec) => rec.date === dateStr
          );

          console.log("Record for", dateStr, ":", record);

          if (!record) {
            return {
              html: `<div style="font-size: 14px; font-weight: 600; color: #1e293b;">${info.dayNumberText}</div>`,
            };
          }

          const totalAbsentOrLeave = record.absent + record.leave;
          let bgColor = "transparent";

          if (record.present > totalAbsentOrLeave) {
            bgColor = "#d1fae5";
          } else if (record.present < totalAbsentOrLeave) {
            bgColor = "#fee2e2";
          }

          return {
            html: `
      <div style="
        width: 100%;
        height: 100%;
        background: transparent;
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        flex-direction: column;
        gap: 2px;
      ">
      <div style="display: flex; align-items: center; gap: 4px;"> <div style="
          width: 10px;
          height: 10px;
          border-radius: 6px;
          background: ${
            bgColor === "#d1fae5"
              ? "#065f46"
              : bgColor === "#fee2e2"
              ? "#991b1b"
              : "#475569"
          };
        "></div>
        <div style="
          color: #1e293b;
          font-weight: 600;
          font-size: 14px;
        ">${info.dayNumberText}</div></div>
       
        <div style="
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: start;
          font-size: 12px;
          color: ${
            bgColor === "#d1fae5"
              ? "#065f46"
              : bgColor === "#fee2e2"
              ? "#991b1b"
              : "#475569"
          };
          line-height: 1.3;
          white-space: pre-line;
        ">
        
        
        <p>P:${record.present}</p> 
        <p>A:${record.absent}</p> 
        <p>L:${record.leave} </p>
            </div>
      </div>
    `,
          };
        }}
        headerToolbar={{
          left: "prev next",
          center: "title",
          right: "today dayGridMonth",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        height="auto"
        dayMaxEvents={true}
      />
      <Attendance
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedDate={selectedDate}
        refetchAttendance={refetchAttendance}
      />
    </div>
  );
};

export default Calender;
