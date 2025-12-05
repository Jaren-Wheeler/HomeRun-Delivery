export default function DeliveryCard({ delivery, onSelect }) {
  const {
    deliveryId,
    pickupAddress,
    dropoffAddress,
    itemDescription,
    proposedPayment,
    status,
  } = delivery;

  const statusColor =
    status === "completed"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
      : status === "closed"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
      : "bg-sky-500/10 text-sky-300 border-sky-500/40";

  const statusLabel =
    status === "completed"
      ? "Completed"
      : status === "closed"
      ? "In progress"
      : "Open";

  return (
    <button
      type="button"
      onClick={() => onSelect(delivery)}   // ⬅️ FULL delivery object passed up
      className="w-full text-left rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-brandBlue/70 hover:bg-slate-900 shadow-md shadow-black/40 px-4 py-3 transition flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-400">Delivery #{deliveryId}</p>
          <p className="text-sm font-semibold text-slate-50 line-clamp-2">
            {itemDescription}
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
        <div>
          <p className="text-slate-500 text-[11px]">Pickup</p>
          <p className="line-clamp-1">{pickupAddress}</p>
        </div>
        <div>
          <p className="text-slate-500 text-[11px]">Drop-off</p>
          <p className="line-clamp-1">{dropoffAddress}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[11px] text-slate-400">Proposed payment</p>
        <p className="text-sm font-semibold text-emerald-300">
          ${Number(proposedPayment).toFixed(2)}
        </p>
      </div>
    </button>
  );
}
