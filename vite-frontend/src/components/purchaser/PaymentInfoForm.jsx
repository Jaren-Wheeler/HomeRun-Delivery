import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import deliveryService from "../../api/deliveryService";

export default function PaymentInfoForm({ delivery, onClose }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch client secret from backend
  useEffect(() => {
  async function loadClientSecret() {
    try {
      const secret = await deliveryService.getPaymentClientSecret(delivery.deliveryId);
      setClientSecret(secret);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load payment details.");
    }
  }

  loadClientSecret();
}, [delivery]);


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);

    // Confirm payment method on the PaymentIntent
    const { error } = await stripe.confirmCardPayment(
        clientSecret,
        {
            payment_method: {
            card: card,
            },
        }
    );


    if (error) {
      console.error(error);
      setMessage(error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    setMessage("Payment method added successfully!");
    setLoading(false);

    // Close modal after 1 second
    setTimeout(() => {
      onClose();
    }, 1000);
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-[420px]">
        <h2 className="text-lg font-bold mb-4">
          Add Payment Method for Delivery #{delivery.deliveryId}
        </h2>

        {!clientSecret ? (
          <p className="text-slate-300">Loading payment details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#fff",
                    },
                    invalid: {
                      color: "#f87171",
                    },
                  },
                }}
              />
            </div>

            {message && <p className="text-sm text-emerald-300">{message}</p>}

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full bg-brandBlue py-2 rounded text-white font-semibold hover:bg-brandBlue/80 transition"
            >
              {loading ? "Processing…" : "Save Payment Method"}
            </button>
          </form>
        )}

        <button
          className="mt-4 w-full text-center text-slate-400 hover:text-white text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
