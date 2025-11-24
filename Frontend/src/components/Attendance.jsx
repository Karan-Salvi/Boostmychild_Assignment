import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../store/api/userApi";
import {
  useGetAttendanceByDateQuery,
  useSaveBulkAttendanceMutation,
} from "../store/api/attendanceApi";
import Loader from "./Loader";

const Attendance = ({
  openModal,
  setOpenModal,
  selectedDate,
  refetchAttendance,
}) => {
  const [fetchAttendance, setFetchAttendance] = useState(false);
  const { data, isLoading, isError } = useGetUsersQuery();
  const { data: attendanceData, isLoading: attendanceLoading } =
    useGetAttendanceByDateQuery(selectedDate, {
      skip: !selectedDate,
    });

  console.log("Attendance Data:", attendanceData);

  const [saveBulkAttendance, { isLoading: saving }] =
    useSaveBulkAttendanceMutation();

  const [attendance, setAttendance] = useState({});

  const [editingRemark, setEditingRemark] = useState(null);

  const handleStatusChange = (userId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { ...(prev[userId] || {}), status: value },
    }));
  };

  const handleRemarkChange = (userId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { ...(prev[userId] || {}), remark: value },
    }));
  };

  const handleSave = async () => {
    if (!data?.users) return;

    setFetchAttendance(false);

    const payload = {
      date: selectedDate,
      records: data.users.map((u) => ({
        userId: u._id,
        status: attendance[u._id]?.status || "present",
        remark: attendance[u._id]?.remark || "",
      })),
    };

    console.log("Sending Payload:", payload);

    try {
      await saveBulkAttendance(payload).unwrap();
      refetchAttendance();
      console.log("Attendance saved successfully");
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  useEffect(() => {
    if (attendanceData?.records) {
      const obj = {};
      attendanceData.records.forEach((rec) => {
        obj[rec.userId._id] = {
          status: rec.status,
          remark: rec.remark,
        };
      });

      console.log("Constructed Attendance Object:", attendanceData);

      setAttendance(obj);
      console.log("Loaded Attendance from backend:", obj);
    } else if (fetchAttendance) {
      setAttendance({});
    }
  }, [attendanceData, fetchAttendance]);

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 p-4">
          <div className="relative w-full max-w-2xl">
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-sm md:text-lg font-semibold text-heading">
                  Mark Attendance
                  <br />
                  for {selectedDate.split("-")[2]}
                </h3>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 w-full">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="text-white bg-brand hover:bg-brand-strong border border-transparent shadow-xs rounded-base text-sm px-4 py-2.5 cursor-pointer flex items-center gap-1"
                    >
                      {saving ? (
                        <div className="flex items-center justify-center gap-2 md:min-w-36">
                          <Loader className="w-5 h-5" message="Saving" />
                          <span className="hidden md:block">Saving ...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 md:min-w-36">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            className="w-5 h-5"
                          >
                            <path
                              fill="#fafafa"
                              d="M3 5a2 2 0 0 1 2-2h8.379a2 2 0 0 1 1.414.586l1.621 1.621A2 2 0 0 1 17 6.621V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1v-4.5A1.5 1.5 0 0 1 6.5 10h7a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 0 1-1V6.621a1 1 0 0 0-.293-.707l-1.621-1.621A1 1 0 0 0 13.379 4H13v2.5A1.5 1.5 0 0 1 11.5 8h-4A1.5 1.5 0 0 1 6 6.5V4H5Zm2 0v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V4H7Zm7 12v-4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V16h8Z"
                            />
                          </svg>
                          <span className="hidden md:block">
                            Save Attendance
                          </span>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      className="text-body bg-neutral-secondary-medium border border-default-medium hover:bg-neutral-tertiary-medium rounded-base text-sm px-4 py-2.75 cursor-pointer flex items-center gap-2"
                      onClick={() => setFetchAttendance(true)}
                    >
                      <svg
                        width="200"
                        height="200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        className="w-5 h-5"
                      >
                        <g fill="none">
                          <path
                            fill="#d7e0ff"
                            d="M11.267 6.086q.046.053.116.075a2.73 2.73 0 0 1-.61 5.388H3.92c-.92 0-1.678-.225-2.315-.782a3.193 3.193 0 0 1 1.887-5.59a.23.23 0 0 0 .21-.126a3.868 3.868 0 0 1 7.508.91q.01.07.057.125"
                          />
                          <path
                            stroke="#4147d5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.5 11.32a3.194 3.194 0 0 1-.21-5.818a3.2 3.2 0 0 1 1.202-.324a.23.23 0 0 0 .213-.127a3.868 3.868 0 0 1 7.508.91a.25.25 0 0 0 .173.2A2.73 2.73 0 0 1 12 11.249"
                          />
                          <path
                            stroke="#4147d5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.45 10.5a2.5 2.5 0 1 0-.832 2.406"
                          />
                          <path
                            stroke="#4147d5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m10 9l-.55 1.5L8 10.25"
                          />
                        </g>
                      </svg>
                      <span className="hidden md:block">Refresh</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 inline-flex justify-center items-center cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                <div className="max-h-80 overflow-y-auto relative overflow-x-auto bg-neutral-primary shadow-xs rounded-base border border-default scrollbar-hide">
                  <table className="w-full  border-collapse text-sm text-left rtl:text-right text-body">
                    <thead className="sticky top-0 bg-neutral-secondary-soft z-10 text-sm text-body border-b border-default">
                      <tr>
                        <th className="px-6 py-3 bg-neutral-secondary-soft font-medium">
                          Student name
                        </th>
                        <th className="px-2 py-3 font-medium">Roll No</th>
                        <th className="px-6 py-3 bg-neutral-secondary-soft font-medium min-w-36">
                          Status
                        </th>
                        <th className="px-3 py-3 font-medium">Remark</th>
                      </tr>
                    </thead>

                    <tbody>
                      {fetchAttendance
                        ? attendanceData?.records?.map((record) => (
                            <tr
                              key={record?._id}
                              className="border-b border-default"
                            >
                              <th className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                                {record?.userId?.name}
                              </th>

                              <td className="px-6 py-4">
                                {record?.userId?.role_no}
                              </td>

                              <td className="px-6 py-4 bg-neutral-secondary-soft">
                                {record?.status?.toLowerCase() ===
                                  "present" && (
                                  <span class="bg-brand-softer text-fg-brand-strong text-sm font-medium px-2 py-1 rounded">
                                    {record?.status?.charAt(0).toUpperCase() +
                                      record?.status?.slice(1)}
                                  </span>
                                )}
                                {record?.status?.toLowerCase() === "absent" && (
                                  <span class="bg-danger-soft text-fg-danger-strong text-sm font-medium px-2 py-1 rounded">
                                    {record?.status?.charAt(0).toUpperCase() +
                                      record?.status?.slice(1)}
                                  </span>
                                )}

                                {record?.status?.toLowerCase() === "leave" && (
                                  <span class="bg-warning-soft text-fg-warning text-sm font-medium px-2 py-1 rounded">
                                    {record?.status?.charAt(0).toUpperCase() +
                                      record?.status?.slice(1)}
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <span className="cursor-pointer">
                                  {record?.remark || "No"}
                                </span>
                              </td>
                            </tr>
                          ))
                        : data?.users?.map((user) => (
                            <tr
                              key={user._id}
                              className="border-b border-default"
                            >
                              <th className="px-6 py-4 font-medium text-heading whitespace-nowrap bg-neutral-secondary-soft">
                                {user.name}
                              </th>

                              <td className="px-6 py-4">{user.role_no}</td>

                              <td className="px-6 py-4 bg-neutral-secondary-soft">
                                <select
                                  className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body cursor-pointer"
                                  value={attendance[user._id]?.status || ""}
                                  onChange={(e) =>
                                    handleStatusChange(user._id, e.target.value)
                                  }
                                >
                                  <option value="present">Present</option>
                                  <option value="absent">Absent</option>
                                  <option value="leave">Leave</option>
                                </select>
                              </td>

                              <td className="px-6 py-4">
                                {editingRemark === user._id ? (
                                  <input
                                    autoFocus
                                    type="text"
                                    className="w-full max-w-32 bg-white border border-default-medium rounded-md px-2 py-1"
                                    defaultValue={
                                      attendance[user._id]?.remark || ""
                                    }
                                    onBlur={(e) => {
                                      handleRemarkChange(
                                        user._id,
                                        e.target.value
                                      );
                                      setEditingRemark(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleRemarkChange(
                                          user._id,
                                          e.target.value
                                        );
                                        setEditingRemark(null);
                                      }
                                    }}
                                  />
                                ) : (
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => setEditingRemark(user._id)}
                                  >
                                    {attendance[user._id]?.remark || "No"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Attendance;
