import { Router } from "express";
import db from "../config/db";
import { authenticate } from "../middlewares/authMiddleware";
import dayjs from "dayjs";

const router = Router();

// Get Schedule for authenticated user
router.post("/getSchedule", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const startDate = dayjs(req.body.startDate);
    const endDate = dayjs(req.body.endDate);

    if (!startDate.isValid() || !endDate.isValid()) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (endDate.isBefore(startDate)) {
      return res
        .status(400)
        .json({ error: "End date cannot be before start date" });
    }

    const regularSchedules = await db("schedules")
      .where({ user_id: userId })
      .select("id", "day_of_week", "slot_number", "start_time", "end_time");

    const editedSchedules = await db("edited_schedules")
      .where({ user_id: userId })
      .andWhere("occurrence_date", ">=", startDate.format("YYYY-MM-DD"))
      .andWhere("occurrence_date", "<=", endDate.format("YYYY-MM-DD"))
      .select(
        "schedule_id",
        "occurrence_date",
        "day_of_week",
        "slot_number",
        "start_time",
        "end_time"
      );

    regularSchedules.sort(
      (a, b) => a.day_of_week - b.day_of_week || a.slot_number - b.slot_number
    );
    editedSchedules.sort(
      (a, b) =>
        dayjs(a.occurrence_date).diff(dayjs(b.occurrence_date)) ||
        a.slot_number - b.slot_number
    );

    let scheduleMap: { [key: string]: any[] } = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    for (const schedule of regularSchedules) {
      const day = dayjs()
        .day(schedule.day_of_week)
        .format("dddd")
        .toLowerCase();
      scheduleMap[day].push(schedule);
    }

    for (const edited of editedSchedules) {
      const day = dayjs().day(edited.day_of_week).format("dddd").toLowerCase();

      if (
        scheduleMap[day].some(
          (sch) =>
            sch.day_of_week === edited.day_of_week &&
            sch.slot_number === edited.slot_number
        )
      ) {
        scheduleMap[day] = scheduleMap[day].filter(
          (sch) =>
            !(
              sch.id === edited.schedule_id &&
              sch.slot_number === edited.slot_number
            )
        );
      }

      scheduleMap[day].push(edited);
      scheduleMap[day].sort((a, b) => a.slot_number - b.slot_number);
    }

    res.json(scheduleMap);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: "cannot find schedules" });
  }
});


router.post("/addSchedule", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const day_of_week = parseInt(req.body.day_of_week);
    const slot_number = parseInt(req.body.slot_number);
    const start_time = req.body.startTime;
    const end_time = req.body.endTime;
    const occurrence_date = req.body.occurrenceDate;

    // Basic validations
    if (
      day_of_week < 0 ||
      day_of_week > 6 ||
      slot_number < 0 ||
      slot_number > 1 ||
      !/^\d{2}:\d{2}$/.test(start_time) ||
      !/^\d{2}:\d{2}$/.test(end_time) ||
      start_time >= end_time
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const existingSchedule = await db("schedules")
      .where({ user_id: userId, day_of_week, slot_number })
      .first();

    if (
      existingSchedule &&
      (existingSchedule.start_time !== start_time || existingSchedule.end_time !== end_time)
    ) {
      const existingEdited = await db("edited_schedules").where({
        user_id: userId,
        schedule_id: existingSchedule.id,
        day_of_week,
        slot_number,
        occurrence_date,
      });

      if (existingEdited.length > 0) {
        return res.status(400).json({
          error: "Cannot add regular schedule. Edited occurrence exists for this schedule.",
        });
      }

      await db("edited_schedules").insert({
        user_id: userId,
        schedule_id: existingSchedule.id,
        occurrence_date,
        day_of_week,
        slot_number,
        start_time,
        end_time,
      });

      return res.json({ message: "Edited schedule added successfully" });
    }

    await db("schedules").insert({
      user_id: userId,
      day_of_week,
      slot_number,
      start_time,
      end_time,
    });

    return res.json({ message: "Regular schedule added successfully" });
  } catch (err: Error | any) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add schedule" });
  }
});


export default router;
