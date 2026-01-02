// import { useState } from "react";

// export default function App() {
//   const [rows, setRows] = useState([
//     {
//       ingredient: "",
//       unit: "",
//       par: "",
//       current: "",
//       prep: "",
//       urgent: "",
//       buy: "",
//       prepTime: "",
//       notes: "",
//     },
//   ]);

//   const handleChange = (index, field, value) => {
//     const updated = [...rows];
//     updated[index][field] = value;
//     setRows(updated);
//   };

//   const addRow = () => {
//     setRows([
//       ...rows,
//       {
//         ingredient: "",
//         unit: "",
//         par: "",
//         current: "",
//         prep: "",
//         urgent: "",
//         buy: "",
//         prepTime: "",
//         notes: "",
//       },
//     ]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-xl font-bold mb-4">Knead-to-Prep</h1>

//       <div className="overflow-x-auto bg-white rounded-xl shadow">
//         <table className="min-w-full border-collapse text-sm">
//           <thead className="bg-gray-200">
//             <tr>
//               {[
//                 "Ingredient",
//                 "Unit",
//                 "Par",
//                 "Current",
//                 "Prep",
//                 "Urgent",
//                 "Buy",
//                 "Prep Time",
//                 "Night Notes",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="border p-2 text-left font-semibold whitespace-nowrap"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((row, index) => (
//               <tr key={index} className="border-t align-top">
//                 {[
//                   "ingredient",
//                   "unit",
//                   "par",
//                   "current",
//                   "prep",
//                   "urgent",
//                   "buy",
//                   "prepTime",
//                 ].map((field) => (
//                   <td key={field} className="border p-1 align-top">
//                     <input
//                       type="text"
//                       className="w-full border rounded px-2 py-1"
//                       value={row[field]}
//                       onChange={(e) =>
//                         handleChange(index, field, e.target.value)
//                       }
//                     />
//                   </td>
//                 ))}

//                 {/* Night Notes column */}
//                 <td className="border p-1 align-top min-w-[220px]">
//                   <textarea
//                     placeholder="Notes for prep team..."
//                     className="w-full border rounded px-2 py-1 bg-yellow-50 resize-none"
//                     rows={2}
//                     value={row.notes}
//                     onChange={(e) =>
//                       handleChange(index, "notes", e.target.value)
//                     }
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         onClick={addRow}
//         className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
//       >
//         + Add Row
//       </button>
//     </div>
//   );
// }

import { useState } from "react";

const stations = ["All", "Line", "BOH", "Sides"];

export default function App() {
  const [activeStation, setActiveStation] = useState("Line");
  const [modalRowId, setModalRowId] = useState(null);

  const [rows, setRows] = useState([]);

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ingredient: "",
        unit: "",
        par: "",
        current: "",
        prep: "",
        urgent: "",
        buy: "",
        prepTime: "",
        notes: "",
        station: activeStation,
      },
    ]);
  };

  const filteredRows =
    activeStation === "All"
      ? rows
      : rows.filter((r) => r.station === activeStation);

  const hasAnyRows = rows.length > 0;
  const activeModalRow = rows.find((r) => r.id === modalRowId);

  return (
    <div className="min-h-screen bg-[#f7f6f3] p-4 text-black">
      <h1 className="text-xl font-bold mb-3">Knead-to-Prep</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {stations.map((station) => (
          <button
            key={station}
            onClick={() => setActiveStation(station)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              activeStation === station
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {station}
          </button>
        ))}
      </div>

      {/* ALL TAB – EMPTY STATE */}
      {activeStation === "All" && !hasAnyRows ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No ingredients added yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#e6e3dc]">
              <tr>
                {[
                  "Ingredient",
                  "Unit",
                  "Par",
                  "Current",
                  "Prep",
                  "Urgent",
                  "Buy",
                  "Prep Time",
                  "Notes",
                ].map((h) => (
                  <th
                    key={h}
                    className="border p-2 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-t align-top">
                  {[
                    "ingredient",
                    "unit",
                    "par",
                    "current",
                    "prep",
                    "urgent",
                    "buy",
                    "prepTime",
                  ].map((field) => (
                    <td key={field} className="border p-1">
                      <input
                        className="w-full border rounded px-2 py-1 bg-white text-black"
                        value={row[field]}
                        onChange={(e) =>
                          handleChange(row.id, field, e.target.value)
                        }
                      />
                    </td>
                  ))}

                  {/* Notes Indicator */}
                  <td className="border p-1 text-center">
                    <button
                      onClick={() => setModalRowId(row.id)}
                      className="text-xl"
                      title={
                        row.notes
                          ? "Night shift left a note"
                          : "Add night shift note"
                      }
                    >
                      {row.notes ? "⚠️" : "➕"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeStation !== "All" && (
        <button
          onClick={addRow}
          className="mt-4 px-4 py-2 bg-[#8b2c2c] text-white rounded-lg"
        >
          + Add Ingredient
        </button>
      )}

      {/* NOTES MODAL */}
      {activeModalRow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-md">
            <h2 className="font-semibold mb-2">
              Night Shift Notes –{" "}
              {activeModalRow.ingredient || "Ingredient"}
            </h2>

            <textarea
              className="w-full border rounded p-2 bg-yellow-50 text-black"
              rows={4}
              value={activeModalRow.notes}
              onChange={(e) =>
                handleChange(activeModalRow.id, "notes", e.target.value)
              }
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={() => setModalRowId(null)}
                className="px-3 py-1 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
