import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import BASE from "../utils/api";

interface Slot {
  schedule_id?: number;
  occurrence_date?: string;
  day_of_week: number;
  slot_number: number;
  start_time: string;
  end_time: string;
}

const weekdayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const SchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(false);

  // check auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(`${BASE}/api/v1/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // fetch slots
  useEffect(() => {
    fetchSlots();
  }, [weekStart]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const startDate = weekStart.format("YYYY-MM-DD");
      const endDate = weekStart.add(6, "day").format("YYYY-MM-DD");

      const res = await axios.post(
        `${BASE}/api/v1/schedules/getSchedule`,
        { startDate, endDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSlots(res.data || {});
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    } finally {
      setLoading(false);
    }
  };

  // add slot
  const handleAddSlot = async (dayIndex: number, date: string, existingSlots: Slot[]) => {
    if (existingSlots.length >= 2) {
      alert("Max 2 slots allowed per day");
      return;
    }

    const start = prompt("Enter start time (HH:mm):");
    const end = prompt("Enter end time (HH:mm):");
    if (!start || !end) return;

    const slotNumber = existingSlots.length;

    try {
      const body = {
        day_of_week: dayIndex,
        slot_number: slotNumber,
        startTime: start,
        endTime: end,
        occurrenceDate: date,
      };

      await axios.post(`${BASE}/api/v1/schedules/addSchedule`, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      fetchSlots();
    } catch (err) {
      console.error("Failed to add slot", err);
    }
  };

  // edit slot
  const handleEditSlot = async (slot: Slot, date: string) => {
    const newStart = prompt("Enter new start time (HH:mm):", slot.start_time);
    const newEnd = prompt("Enter new end time (HH:mm):", slot.end_time);
    if (!newStart || !newEnd) return;

    try {
      const body = {
        day_of_week: slot.day_of_week,
        slot_number: slot.slot_number,
        startTime: newStart,
        endTime: newEnd,
        occurrenceDate: date,
      };

      await axios.post(`${BASE}/api/v1/schedules/addSchedule`, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      fetchSlots();
    } catch (err) {
      console.error("Failed to edit slot", err);
    }
  };

  const days = Array.from({ length: 7 }).map((_, i) => weekStart.add(i, "day"));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Weekly Schedule</h1>

      {loading && <p className="text-center">Loading schedules...</p>}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, i) => {
          const dateStr = day.format("YYYY-MM-DD");
          const weekdayKey = weekdayKeys[day.day()];
          const daySlots = slots[weekdayKey] || [];

          return (
            <div key={dateStr} className="bg-white shadow rounded-lg p-4 flex flex-col">
              <h2 className="text-lg font-semibold mb-2">{day.format("dddd")}</h2>
              <p className="text-sm text-gray-500 mb-4">{dateStr}</p>

              <div className="flex-1 space-y-2">
                {daySlots.length > 0 ? (
                  daySlots.map((slot, idx) => (
                    <div key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex justify-between items-center">
                      <span>{slot.start_time} - {slot.end_time}</span>
                      <button
                        onClick={() => handleEditSlot(slot, dateStr)}
                        className="text-xs text-blue-600 hover:underline ml-2"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No slots</p>
                )}
              </div>

              {daySlots.length < 2 && (
                <button
                  onClick={() => handleAddSlot(i, dateStr, daySlots)}
                  className="mt-4 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Slot
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* week navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setWeekStart(weekStart.subtract(1, "week"))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Previous Week
        </button>
        <button
          onClick={() => setWeekStart(weekStart.add(1, "week"))}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next Week →
        </button>
      </div>
    </div>
  );
};

export default SchedulesPage;
