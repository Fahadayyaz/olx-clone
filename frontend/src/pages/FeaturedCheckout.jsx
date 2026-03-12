import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { FiStar } from "react-icons/fi";

const plans = [
  {
    id: "7days",
    label: "7 Days",
    price: "Rs 500",
    desc: "Great for quick sales",
  },
  {
    id: "15days",
    label: "15 Days",
    price: "Rs 900",
    desc: "Most popular choice",
  },
  {
    id: "30days",
    label: "30 Days",
    price: "Rs 1,500",
    desc: "Maximum visibility",
  },
];

export default function FeaturedCheckout() {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [selected, setSelected] = useState("7days");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/ads/${adId}`).then((res) => setAd(res.data));
  }, [adId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await API.post("/payments/create-checkout", {
        adId,
        plan: selected,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
      setLoading(false);
    }
  };

  if (!ad) return <div className="spinner" />;

  return (
    <div className="container checkout-page">
      <div className="checkout-card">
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>
          <FiStar color="#ffce32" /> Make Your Ad Featured
        </h2>
        <p style={{ textAlign: "center", color: "#7f9799", marginBottom: 24 }}>
          "{ad.title}" — Rs {ad.price?.toLocaleString()}
        </p>

        <div className="plan-options">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className={`plan-option ${selected === plan.id ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="plan"
                value={plan.id}
                checked={selected === plan.id}
                onChange={() => setSelected(plan.id)}
              />
              <div style={{ flex: 1 }}>
                <strong>{plan.label}</strong>
                <p style={{ fontSize: 13, color: "#7f9799", margin: 0 }}>
                  {plan.desc}
                </p>
              </div>
              <strong style={{ fontSize: 18 }}>{plan.price}</strong>
            </label>
          ))}
        </div>

        <div
          style={{
            background: "#f9f9f9",
            borderRadius: 4,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <h4 style={{ marginBottom: 8 }}>Featured ads get:</h4>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: "#444" }}>
            <li>⭐ Gold border & FEATURED badge</li>
            <li>📌 Pinned to top of search results</li>
            <li>👀 Up to 10x more views</li>
            <li>📱 Priority in all categories</li>
          </ul>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Redirecting to Stripe..." : "Pay with Stripe 💳"}
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#7f9799",
            marginTop: 12,
          }}
        >
          Secure payment via Stripe. You will be redirected.
        </p>
      </div>
    </div>
  );
}
