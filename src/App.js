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

const stations = ["All", "Line", "BOH", "Expo"];

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

  const markAsCompleted = (id) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const current = Number(row.current) || 0;
          const amountPrepped = Number(row.prep) || (Number(row.par) - current);
          const newCurrent = current + amountPrepped;
          
          return {
            ...row,
            current: String(newCurrent),
            notes: "",
            prep: "",
          };
        }
        return row;
      })
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

  const prepList = rows
    .map((row) => {
      const par = Number(row.par);
      const current = Number(row.current);

      let amountToPrep = 0;

      if (!isNaN(par) && !isNaN(current) && current < par) {
        amountToPrep = par - current;
      }

      if (row.prep) {
        amountToPrep = row.prep;
      }

      if (amountToPrep > 0) {
        return {
          ...row,
          amountToPrep,
        };
      }

      return null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f7f6f3] p-3 sm:p-4 text-black pb-20">
      <h1 className="text-xl font-bold mb-3">Knead2Prep</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {stations.map((station) => (
          <button
            key={station}
            onClick={() => setActiveStation(station)}
            className={`px-4 py-2 rounded-full text-sm border transition whitespace-nowrap ${
              activeStation === station
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {station}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {activeStation === "All" && !hasAnyRows ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No ingredients added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRows.map((row) => (
            <div key={row.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between mb-3">
                <input
                  className="flex-1 text-lg font-semibold border-b-2 border-transparent focus:border-black outline-none bg-transparent"
                  placeholder="Ingredient name"
                  value={row.ingredient}
                  onChange={(e) =>
                    handleChange(row.id, "ingredient", e.target.value)
                  }
                />
                <button
                  onClick={() => setModalRowId(row.id)}
                  className="text-2xl ml-2 flex-shrink-0"
                  title={row.notes ? "Night shift left a note" : "Add note"}
                >
                  {row.notes ? "⚠️" : "➕"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Unit
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.unit}
                    onChange={(e) =>
                      handleChange(row.id, "unit", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Par
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.par}
                    onChange={(e) =>
                      handleChange(row.id, "par", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Current
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.current}
                    onChange={(e) =>
                      handleChange(row.id, "current", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Prep
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.prep}
                    onChange={(e) =>
                      handleChange(row.id, "prep", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Urgent
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.urgent}
                    onChange={(e) =>
                      handleChange(row.id, "urgent", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Buy
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.buy}
                    onChange={(e) =>
                      handleChange(row.id, "buy", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">
                    Prep Time
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={row.prepTime}
                    onChange={(e) =>
                      handleChange(row.id, "prepTime", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeStation !== "All" && (
        <button
          onClick={addRow}
          className="mt-4 px-6 py-3 bg-[#8b2c2c] text-white rounded-lg font-medium shadow-md active:scale-95 transition"
        >
          + Add Ingredient
        </button>
      )}

      {/* PREP LIST */}
      {prepList.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Prep List for Today</h2>

          <div className="space-y-3">
            {prepList.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-base">
                    {item.ingredient || "—"}
                  </div>
                  <button
                    onClick={() => markAsCompleted(item.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition flex-shrink-0 ml-2"
                  >
                    ✓ Done
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Station:</span>{" "}
                    {item.station}
                  </div>
                  <div>
                    <span className="text-gray-500">Prep:</span>{" "}
                    {item.amountToPrep}
                  </div>
                  <div>
                    <span className="text-gray-500">Urgent:</span>{" "}
                    {item.urgent || "—"}
                  </div>
                </div>
                {item.notes && (
                  <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                    <span className="text-gray-500">Note:</span> {item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {activeModalRow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <h2 className="font-semibold mb-2">
              Night Shift Notes –{" "}
              {activeModalRow.ingredient || "Ingredient"}
            </h2>

            <textarea
              className="w-full border rounded p-3 bg-yellow-50 text-black text-base"
              rows={4}
              value={activeModalRow.notes}
              onChange={(e) =>
                handleChange(activeModalRow.id, "notes", e.target.value)
              }
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={() => setModalRowId(null)}
                className="px-4 py-2 border rounded font-medium"
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