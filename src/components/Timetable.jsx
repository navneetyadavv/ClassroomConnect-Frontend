import React, { useEffect, useState } from "react";
import axios from "axios";

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    // Fetch the timetable data from your backend
    axios
      .get("/api/timetable")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTimetable(response.data);
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  if (!timetable.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-bold mb-4">Timetable</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Day</th>
            <th className="py-2 px-4 border-b">Subject</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">End Time</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((daySchedule, index) => (
            <React.Fragment key={index}>
              {daySchedule.periods.map((period, periodIndex) => (
                <tr key={periodIndex}>
                  {periodIndex === 0 && (
                    <td
                      className="py-2 px-4 border-b"
                      rowSpan={daySchedule.periods.length}
                    >
                      {daySchedule.day}
                    </td>
                  )}
                  <td className="py-2 px-4 border-b">{period.subject}</td>
                  <td className="py-2 px-4 border-b">{period.startTime}</td>
                  <td className="py-2 px-4 border-b">{period.endTime}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => alert("Update functionality to be implemented")}
      >
        Update
      </button>
    </div>
  );
};

export default Timetable;
