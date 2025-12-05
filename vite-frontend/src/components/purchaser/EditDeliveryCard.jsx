import { useState } from "react";

export default function EditDeliveryCard({ delivery, onClose, onUpdated, onDeleted }) {
  const [pickup, setPickup] = useState(delivery.pickupAddress);
  const [dropoff, setDropoff] = useState(delivery.dropoffAddress);
  const [description, setDescription] = useState(delivery.itemDescription);
  const [payment, setPayment] = useState(delivery.proposedPayment);

  const token = localStorage.getItem("token");

  async function handleSave() {
    try {
        const res = await fetch(
        `http://localhost:5000/api/purchaser/${delivery.deliveryId}/update`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,   // ✅ REQUIRED
            },
            body: JSON.stringify({
            pickupAddress: pickup,
            dropoffAddress: dropoff,
            itemDescription: description,
            proposedPayment: payment,
            }),
        }
        );

        if (!res.ok) {
        console.error(await res.text());
        alert("Failed to update delivery");
        return;
        }

        const data = await res.json();
        onUpdated?.(data.delivery);
        onClose();
    } catch (err) {
        console.error("Update error:", err);
        alert("Server error while updating");
    }
    }

    async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this delivery?")) return;

    try {
        const res = await fetch(
        `http://localhost:5000/api/purchaser/${delivery.deliveryId}/delete`,
        {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`,   // ✅ REQUIRED
            },
        }
        );

        if (!res.ok) {
        console.error(await res.text());
        alert("Failed to delete delivery");
        return;
        }

        onDeleted?.(delivery.deliveryId);
        onClose();
    } catch (err) {
        console.error("Delete error:", err);
        alert("Server error while deleting delivery");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-[420px] shadow-xl shadow-black/40 text-slate-200">

        <h2 className="text-lg font-bold mb-4">
          Edit Delivery #{delivery.deliveryId}
        </h2>

        {/* Pickup */}
        <label className="text-xs text-slate-400">Pickup Address</label>
        <input
          className="w-full mt-1 mb-3 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />

        {/* Dropoff */}
        <label className="text-xs text-slate-400">Dropoff Address</label>
        <input
          className="w-full mt-1 mb-3 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />

        {/* Description */}
        <label className="text-xs text-slate-400">Item Description</label>
        <textarea
          className="w-full mt-1 mb-3 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100 h-[70px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Proposed Pay */}
        <label className="text-xs text-slate-400">Proposed Payment ($)</label>
        <input
          type="number"
          className="w-full mt-1 mb-4 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSave}
            className="bg-brandBlue px-4 py-2 rounded-lg text-white font-semibold hover:bg-brandBlue/80"
          >
            Save
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-700"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
