const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Attendance = require("../models/attendance.model");

const getAttendanceByDate = catchAsyncErrors(async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const day = date.split("-")[2];
    const monthYear = date.slice(0, 7);

    const records = await Attendance.find({ date }).populate(
      "userId",
      "name role_no"
    );

    let present = 0,
      absent = 0,
      leave = 0;

    records.forEach((rec) => {
      if (rec.status === "present") present++;
      else if (rec.status === "absent") absent++;
      else if (rec.status === "leave") leave++;
    });

    const startDate = `${monthYear}-01`;
    const endDate = `${monthYear}-31`;

    const monthRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const grouped = {};

    monthRecords.forEach((rec) => {
      if (!grouped[rec.date]) {
        grouped[rec.date] = { present: 0, absent: 0, leave: 0 };
      }
      if (rec.status === "present") grouped[rec.date].present++;
      if (rec.status === "absent") grouped[rec.date].absent++;
      if (rec.status === "leave") grouped[rec.date].leave++;
    });

    const monthSummary = Object.keys(grouped).map((d) => ({
      date: d,
      present: grouped[d].present,
      absent: grouped[d].absent,
      leave: grouped[d].leave,
      marked: true,
      formatted: `P: ${grouped[d].present} / A: ${grouped[d].absent} / L: ${grouped[d].leave}`,
    }));

    res.json({
      success: true,
      date,
      day,
      month: monthYear,
      summary: {
        present,
        absent,
        leave,
        formatted: `P: ${present} / A: ${absent} / L: ${leave}`,
      },
      records,
      monthSummary,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const saveBulkAttendance = catchAsyncErrors(async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records)
      return res.status(400).json({ message: "Date & records required" });

    // Normalize date to YYYY-MM-DD ALWAYS
    const normalizedDate = date;

    const bulkOps = records.map((r) => ({
      updateOne: {
        filter: { userId: r.userId, date: normalizedDate }, // FIXED
        update: {
          userId: r.userId,
          date: normalizedDate,
          status: r.status,
          remark: r.remark,
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    res.json({ message: "Attendance updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { getAttendanceByDate, saveBulkAttendance };
