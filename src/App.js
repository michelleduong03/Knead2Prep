import { useState } from "react";

export default function App() {
  const [rows, setRows] = useState([
    {
      ingredient: "",
      unit: "",
      par: "",
      current: "",
      prep: "",
      urgent: "",
      buy: "",
      prepTime: "",
      notes: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        ingredient: "",
        unit: "",
        par: "",
        current: "",
        prep: "",
        urgent: "",
        buy: "",
        prepTime: "",
        notes: "",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4">Knead-to-Prep</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-200">
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
                "Night Notes",
              ].map((header) => (
                <th
                  key={header}
                  className="border p-2 text-left font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t align-top">
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
                  <td key={field} className="border p-1 align-top">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={row[field]}
                      onChange={(e) =>
                        handleChange(index, field, e.target.value)
                      }
                    />
                  </td>
                ))}

                {/* Night Notes column */}
                <td className="border p-1 align-top min-w-[220px]">
                  <textarea
                    placeholder="Notes for prep team..."
                    className="w-full border rounded px-2 py-1 bg-yellow-50 resize-none"
                    rows={2}
                    value={row.notes}
                    onChange={(e) =>
                      handleChange(index, "notes", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
      >
        + Add Row
      </button>
    </div>
  );
}
