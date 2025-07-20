import React, { useEffect, useState } from "react";
import {
  getWorkSchedules,
  createWorkSchedule,
  createBulkWorkSchedules,
  updateWorkSchedule,
  deleteWorkSchedule,
  softDeleteWorkSchedule,
  approveOvertime,
} from "../Service/workScheduleService";
import WorkScheduleForm from "./WorkScheduleForm";
import WorkScheduleInlineForm from "./WorkScheduleInlineForm";
import "./WorkSchedule.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const WorkScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [workDay, setWorkDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const itemsPerPage = 10;

  // Hàm ánh xạ trạng thái
  const mapStatus = (status) => {
    const normalizedStatus = status ? status.toString().toLowerCase() : "";
    if (["active", "true", "1"].includes(normalizedStatus)) return "Active";
    if (["inactive", "false", "0"].includes(normalizedStatus)) return "Inactive";
    if (["pending", "approved", "rejected"].includes(normalizedStatus)) 
      return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
    return status || "Unknown";
  };

  // Hàm kiểm tra ngày hợp lệ
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // Hàm kiểm tra thời gian hợp lệ
  const isValidTime = (timeString) => {
    if (!timeString) return false;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(timeString);
  };

  // Hàm kiểm tra bộ lọc
  const validateFilters = () => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      if (start > end) {
        setErrorMessage("End Time must be after Start Time.");
        return false;
      }
    }
    if ((startTime && !endTime) || (!startTime && endTime)) {
      setErrorMessage("Both Start Time and End Time must be provided.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Hàm tải dữ liệu lịch làm việc
  const loadSchedules = async () => {
    if (!validateFilters()) {
      setSchedules([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const params = { status: status ? status.toUpperCase() : undefined };
      if (workDay) params.workDay = workDay;
      if (startTime && endTime) {
        params.startTime = `${startTime}:00`;
        params.endTime = `${endTime}:00`;
      }
      
      const data = await getWorkSchedules(params);
      
      let processedData = Array.isArray(data)
        ? data.filter(s => 
            isValidDate(s.workDay) && 
            isValidTime(s.startTime) && 
            isValidTime(s.endTime)
          ).map(s => ({
            ...s,
            displayStatus: mapStatus(s.status),
          }))
        : [];
      
      // Áp dụng bộ lọc trạng thái
      if (status && processedData.length > 0) {
        const normalizedSelectedStatus = status.toLowerCase();
        processedData = processedData.filter(s => {
          const normalizedDataStatus = s.status?.toLowerCase() || "";
          return (
            normalizedDataStatus === normalizedSelectedStatus ||
            (["active", "true", "1"].includes(normalizedDataStatus) && 
             normalizedSelectedStatus === "active") ||
            (["inactive", "false", "0"].includes(normalizedDataStatus) && 
             normalizedSelectedStatus === "inactive")
          );
        });
      }
      
      // Áp dụng bộ lọc ngày làm việc
      if (workDay && processedData.length > 0) {
        processedData = processedData.filter(s => {
          const scheduleWorkDay = isValidDate(s.workDay)
            ? new Date(s.workDay).toISOString().split("T")[0]
            : "";
          return !workDay || scheduleWorkDay === workDay;
        });
      }
      
      // Áp dụng bộ lọc thời gian
      if (startTime && endTime && processedData.length > 0) {
        processedData = processedData.filter(s => {
          const scheduleStartTime = isValidTime(s.startTime) ? s.startTime.slice(0, 5) : "";
          const scheduleEndTime = isValidTime(s.endTime) ? s.endTime.slice(0, 5) : "";
          return (
            (!startTime || scheduleStartTime === startTime) &&
            (!endTime || scheduleEndTime === endTime)
          );
        });
      }
      
      setSchedules(processedData);
      if (processedData.length === 0) {
        setErrorMessage("No schedules found for the selected filters.");
      }
    } catch (err) {
      console.error("Failed to load work schedules:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      const errorMsg = err.response?.status === 400
        ? `Invalid input: ${err.response?.data?.message || "Check date and time formats"}`
        : `Failed to load work schedules: ${err.response?.data?.message || err.message || "Unknown error"}`;
      
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Tải dữ liệu khi component mount hoặc khi bộ lọc thay đổi
  useEffect(() => {
    loadSchedules();
  }, [workDay, startTime, endTime, status]);

  // Hàm lưu lịch làm việc (cho WorkScheduleForm)
  const handleSave = async (form, isBulk = false) => {
    setIsEditing(true);
    setErrorMessage("");
    
    try {
      if (isBulk) {
        await createBulkWorkSchedules(form);
      } else if (editData) {
        const updateData = {
          employeeId: form.employeeId || editData.employeeId,
          scheduleInfoId: form.scheduleInfoId || editData.scheduleInfoId,
          workDay: form.workDay,
          startTime: form.startTime.endsWith(":00") ? form.startTime : `${form.startTime}:00`,
          endTime: form.endTime.endsWith(":00") ? form.endTime : `${form.endTime}:00`,
          status: form.status || editData.status,
          isOvertime: form.isOvertime !== undefined ? form.isOvertime : editData.isOvertime,
        };
        await updateWorkSchedule(editData.scheduleId, updateData);
      } else {
        const createData = {
          ...form,
          startTime: form.startTime.endsWith(":00") ? form.startTime : `${form.startTime}:00`,
          endTime: form.endTime.endsWith(":00") ? form.endTime : `${form.endTime}:00`,
        };
        await createWorkSchedule(createData);
      }
      
      setShowForm(false);
      setEditData(null);
      loadSchedules();
    } catch (err) {
      console.error("Failed to save work schedule(s):", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      const errorMsg = err.response?.status === 400
        ? `Failed to update schedule: ${err.response?.data?.message || "Invalid date or time format"}`
        : `Failed to ${editData ? "update" : "create"} schedule: ${err.response?.data?.message || err.message || "Unknown error"}`;
      
      setErrorMessage(errorMsg);
    } finally {
      setIsEditing(false);
    }
  };

  // Hàm xử lý chỉnh sửa (cho modal form)
  const handleEdit = (schedule) => {
    if (!schedule || !schedule.scheduleId) {
      setErrorMessage("Invalid schedule selected for editing.");
      return;
    }
    
    if (!isValidDate(schedule.workDay) || !isValidTime(schedule.startTime) || !isValidTime(schedule.endTime)) {
      setErrorMessage("Selected schedule contains invalid or missing date/time fields.");
      return;
    }
    
    setEditingScheduleId(schedule.scheduleId);
    setIsEditing(true);
  };

  // Hàm lưu modal form
  const handleInlineSave = async (scheduleId, formData) => {
    setIsEditing(true);
    setErrorMessage("");
    
    try {
      const updateData = {
        employeeId: schedules.find(s => s.scheduleId === scheduleId).employeeId,
        scheduleInfoId: schedules.find(s => s.scheduleId === scheduleId).scheduleInfoId,
        workDay: formData.workDay,
        startTime: formData.startTime.endsWith(":00") ? formData.startTime : `${formData.startTime}:00`,
        endTime: formData.endTime.endsWith(":00") ? formData.endTime : `${formData.endTime}:00`,
        status: formData.status,
        isOvertime: formData.isOvertime,
      };
      await updateWorkSchedule(scheduleId, updateData);
      setEditingScheduleId(null);
      loadSchedules();
    } catch (err) {
      console.error("Failed to save work schedule:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      const errorMsg = err.response?.status === 400
        ? `Failed to update schedule: ${err.response?.data?.message || "Invalid date or time format"}`
        : `Failed to update schedule: ${err.response?.data?.message || err.message || "Unknown error"}`;
      
      setErrorMessage(errorMsg);
    } finally {
      setIsEditing(false);
    }
  };

  // Hàm hủy modal form
  const handleInlineCancel = () => {
    setEditingScheduleId(null);
    setIsEditing(false);
    setErrorMessage("");
  };

  // Hàm xử lý xóa
  const handleDelete = async () => {
    if (!scheduleToDelete) return;
    
    setIsDeleting(true);
    setErrorMessage("");
    
    try {
      await deleteWorkSchedule(scheduleToDelete);
      setSchedules(prevSchedules => 
        prevSchedules.filter(schedule => schedule.scheduleId !== scheduleToDelete)
      );
      
      if (schedules.length <= itemsPerPage && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      
      setShowDeleteConfirm(false);
      setScheduleToDelete(null);
    } catch (err) {
      console.error("Failed to delete work schedule:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      const errorMsg = err.response?.status === 404
        ? "Schedule not found"
        : `Failed to delete schedule: ${err.response?.data?.message || err.message || "Unknown error"}`;
      
      setErrorMessage(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Hàm xử lý xóa mềm
  const handleSoftDelete = async (id) => {
    if (window.confirm("Soft delete this schedule?")) {
      try {
        await softDeleteWorkSchedule(id);
        loadSchedules();
      } catch (err) {
        console.error("Failed to soft delete work schedule:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    }
  };

  // Hàm xử lý duyệt tăng ca
  const handleApproveOvertime = async (id) => {
    if (window.confirm("Approve this overtime schedule?")) {
      try {
        await approveOvertime(id);
        loadSchedules();
      } catch (err) {
        console.error("Failed to approve overtime:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        
        const errorMsg = err.response?.status === 404
          ? "Schedule not found"
          : `Failed to approve overtime: ${err.response?.data?.message || err.message || "Unknown error"}`;
        
        setErrorMessage(errorMsg);
      }
    }
  };

  // Hàm reset bộ lọc
  const handleResetFilters = () => {
    setWorkDay("");
    setStartTime("");
    setEndTime("");
    setStatus("");
    setShowFilters(false);
    setErrorMessage("");
  };

  // Logic phân trang
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = schedules.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Tạo số trang hiển thị
  const maxVisiblePages = 5;
  const pageNumbers = [];
  const ellipsis = "...";

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    
    pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push(ellipsis);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
    if (totalPages > 1) pageNumbers.push(totalPages);
  }

  return (
    <div className="WorkScheduleContainer1">
      <h2>Work Schedule List</h2>
      
      <div className="WorkScheduleControls1">
        <button
          className="WorkScheduleAddButton1"
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          disabled={isEditing || isDeleting}
        >
          <FaPlus style={{ marginRight: 6 }} />
          Add
        </button>
        
        <button
          className="WorkScheduleFilterButton1"
          onClick={() => setShowFilters(!showFilters)}
          disabled={isEditing || isDeleting}
        >
          <FaFilter style={{ marginRight: 6 }} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      
      {showFilters && (
        <div className="WorkScheduleFilters1">
          <div className="WorkScheduleFormField1">
            <label>Work Day:</label>
            <input
              type="date"
              value={workDay}
              onChange={(e) => setWorkDay(e.target.value)}
              disabled={isEditing || isDeleting}
            />
          </div>
          
          <div className="WorkScheduleFormField1">
            <label>Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={isEditing || isDeleting}
            />
          </div>
          
          <div className="WorkScheduleFormField1">
            <label>End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={isEditing || isDeleting}
            />
          </div>
          
          <div className="WorkScheduleFormField1">
            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isEditing || isDeleting}
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div className="WorkScheduleFormField1">
            <button
              type="button"
              className="WorkScheduleResetButton1"
              onClick={handleResetFilters}
              disabled={isEditing || isDeleting}
            >
              <FaTimes style={{ marginRight: 5 }} />
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="WorkScheduleError1">
          {errorMessage}
        </div>
      )}
      
      {showForm && (
        <div>
          <div
            className="WorkScheduleOverlay1"
            onClick={() => setShowForm(false)}
          />
          <WorkScheduleForm
            editData={editData}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditData(null);
              setIsEditing(false);
            }}
          />
        </div>
      )}
      
      {editingScheduleId && (
        <div>
          <div
            className="WorkScheduleOverlay1"
            onClick={handleInlineCancel}
          />
          <div className="WorkScheduleModal1">
            <WorkScheduleInlineForm
              schedule={schedules.find(s => s.scheduleId === editingScheduleId)}
              onSave={(formData) => handleInlineSave(editingScheduleId, formData)}
              onCancel={handleInlineCancel}
            />
          </div>
        </div>
      )}
      
      {showDeleteConfirm && (
        <div>
          <div
            className="WorkScheduleOverlay1"
            onClick={() => {
              setShowDeleteConfirm(false);
              setScheduleToDelete(null);
            }}
          />
          <div className="WorkScheduleModal1 WorkScheduleDeleteModal1">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this schedule?</p>
            <div className="WorkScheduleFormButtons1">
              <button
                className="WorkScheduleDeleteConfirmButton1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <FaTrash style={{ marginRight: 5 }} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                className="WorkScheduleCancelButton1"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setScheduleToDelete(null);
                }}
              >
                <FaTimes style={{ marginRight: 5 }} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading schedules...
        </div>
      ) : (
        <table className="WorkScheduleTable1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Schedule Info</th>
              <th>Work Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSchedules.length > 0 ? (
              currentSchedules.map((s) => (
                <tr key={s.scheduleId}>
                  <td>{s.scheduleId}</td>
                  <td>{s.employeeName || "N/A"}</td>
                  <td>{s.scheduleInfoName || "N/A"}</td>
                  <td>
                    {isValidDate(s.workDay)
                      ? new Date(s.workDay).toLocaleDateString()
                      : "Invalid date"}
                  </td>
                  <td>
                    {isValidTime(s.startTime)
                      ? new Date(`1970-01-01T${s.startTime}`).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : "Invalid time"}
                  </td>
                  <td>
                    {isValidTime(s.endTime)
                      ? new Date(`1970-01-01T${s.endTime}`).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )
                      : "Invalid time"}
                  </td>
                  <td className={`WorkScheduleStatus1 ${s.displayStatus}`}>
                    {s.displayStatus}
                  </td>
                  <td>
                    <button
                      className="WorkScheduleEditButton1"
                      onClick={() => handleEdit(s)}
                      disabled={isEditing || isDeleting || !isValidDate(s.workDay) || !isValidTime(s.startTime) || !isValidTime(s.endTime)}
                      aria-label="Edit schedule"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="WorkScheduleDeleteButton1"
                      onClick={() => {
                        setScheduleToDelete(s.scheduleId);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={isEditing || isDeleting}
                      aria-label="Delete schedule"
                    >
                      <FaTrash />
                    </button>
                    {s.displayStatus === "Pending" && (
                      <button
                        className="WorkScheduleApproveButton1"
                        onClick={() => handleApproveOvertime(s.scheduleId)}
                        disabled={isEditing || isDeleting}
                        aria-label="Approve overtime"
                      >
                        <FaCheck style={{ marginRight: 4 }} />
                        Approve OT
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      
      {totalPages > 1 && !isLoading && (
        <div className="WorkSchedulePaginationControls1">
          <button
            className="WorkSchedulePaginationButton1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isEditing || isDeleting}
          >
            <FaArrowLeft style={{ marginRight: 6 }} />
            Previous
          </button>
          
          <div className="WorkSchedulePaginationNumbers1">
            {pageNumbers.map((page, index) =>
              page === ellipsis ? (
                <span key={`ellipsis-${index}`} className="WorkSchedulePaginationEllipsis1">
                  {ellipsis}
                </span>
              ) : (
                <button
                  key={page}
                  className={`WorkSchedulePaginationNumber1 ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                  disabled={isEditing || isDeleting}
                >
                  {page}
                </button>
              )
            )}
          </div>
          
          <button
            className="WorkSchedulePaginationButton1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isEditing || isDeleting}
          >
            Next
            <FaArrowRight style={{ marginLeft: 6 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkScheduleList;