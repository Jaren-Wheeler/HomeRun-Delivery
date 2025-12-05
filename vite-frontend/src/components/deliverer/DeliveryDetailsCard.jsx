import deliveryService from '../../api/deliveryService';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryDetailsCard({ delivery }) {
  const { user } = useAuth();

  const handleAccept = async () => {
    try {
      const { clientSecret } = await deliveryService.acceptJob(
        user.user_id,
        delivery.delivery_id
      );

      alert('Job accepted! Payment authorization pending ✔');
      console.log('Stripe clientSecret:', clientSecret);
    } catch (err) {
      console.error('Error accepting job:', err);
      alert('Failed to accept job');
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md max-w-xs space-y-2">
      <h2 className="font-semibold text-lg">{delivery.item_description}</h2>

      <p className="text-sm text-gray-300">
        Buyer: {delivery.Purchaser?.first_name} {delivery.Purchaser?.last_name}
      </p>

      <p className="text-sm text-gray-300">Pickup: {delivery.pickup_address}</p>

      <p className="text-sm">
        <span className="font-semibold">Payment: </span>$
        {delivery.proposed_payment}
      </p>

      {user?.role === 'deliverer' && (
        <button
          onClick={handleAccept}
          className="bg-emerald-600 hover:bg-emerald-500 transition p-2 text-sm rounded-md w-full mt-2 font-semibold"
        >
          Accept Job
        </button>
      )}
    </div>
  );
}
