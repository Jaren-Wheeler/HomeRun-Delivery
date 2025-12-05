export default function JobStatusView({ deliveries = [] }) {
  return (
    <div className="grid gap-4">
      {deliveries.map((d) => (
        <div
          key={d.deliveryId}
          className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition border border-gray-600"
        >
          <div className="text-sm text-gray-300">
            Pickup:
            <span className="text-white ml-1">{d.pickupAddress}</span>
          </div>

          <div className="text-sm text-gray-300 mt-1">
            Dropoff:
            <span className="text-white ml-1">{d.dropoffAddress}</span>
          </div>

          <div className="text-sm text-gray-300 mt-1">
            Description:
            <span className="text-white ml-1">{d.itemDescription}</span>
          </div>

          <div className="flex justify-between items-center mt-3">
            <p className="font-bold text-brandBlue">${d.proposedPayment}</p>

            <span
              className={`px-3 py-1 rounded text-xs capitalize
                ${d.status === 'open' ? 'bg-yellow-600' : 'bg-green-600'}
              `}
            >
              {d.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
