import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";

const plans = [
  {
    name: "Basic",
    tagline: "Get started for free",
    price: 0,
    cta: "Current plan",
    highlight: false,
    features: [
      { label: "Post & reply in threads", included: true },
      { label: "1:1 chat with connections", included: true },
      { label: "Join public communities", included: true },
      { label: "Unlimited resource uploads", included: false },
      { label: "Private / invite-only groups", included: false },
      { label: "Verified profile badge", included: false },
      { label: "Advanced search & filters", included: false },
      { label: "Priority visibility in feed", included: false },
    ],
  },
  {
    name: "Plus",
    tagline: "For people who share often",
    price: 299,
    cta: "Upgrade to Plus",
    highlight: true,
    features: [
      { label: "Post & reply in threads", included: true },
      { label: "1:1 chat with connections", included: true },
      { label: "Join public communities", included: true },
      { label: "Unlimited resource uploads", included: true },
      { label: "Private / invite-only groups", included: true },
      { label: "Verified profile badge", included: false },
      { label: "Advanced search & filters", included: false },
      { label: "Priority visibility in feed", included: false },
    ],
  },
  {
    name: "Pro",
    tagline: "For power users & community leads",
    price: 499,
    cta: "Upgrade to Pro",
    highlight: false,
    features: [
      { label: "Post & reply in threads", included: true },
      { label: "1:1 chat with connections", included: true },
      { label: "Join public communities", included: true },
      { label: "Unlimited resource uploads", included: true },
      { label: "Private / invite-only groups", included: true },
      { label: "Verified profile badge", included: true },
      { label: "Advanced search & filters", included: true },
      { label: "Priority visibility in feed", included: true },
    ],
  },
];

function CheckIcon({ included }) {
  return included ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00D6A3"
      strokeWidth="2.5"
      className="shrink-0"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3A3F4C"
      strokeWidth="2.5"
      className="shrink-0"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// Dynamically load the Razorpay checkout script once, and reuse it on
// subsequent calls instead of injecting multiple <script> tags.
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

function Premium() {
  const [billing, setBilling] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState(null);

  // yearly pricing (~2 months free)
  const multiplier = billing === "yearly" ? 10 : 1;

  const handlePlanClick = async (plan) => {
    // Basic plan → no payment required
    if (plan.price === 0) return;

    try {
      setLoadingPlan(plan.name);

      const { data } = await axios.post(
        `${BASE_URL}/payment/create`,
        {
          plan: plan.name.toLowerCase(),
          billing,
          amount: plan.price * multiplier,
        },
        {
          withCredentials: true,
        }
      );

      // If backend returns a hosted checkout URL, redirect and stop here —
      // don't also try to open the Razorpay modal below.
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Otherwise fall back to Razorpay's in-page checkout modal.
      const { amount, keyId, currency, notes, orderId } = data;

      await loadRazorpayScript();

      const firstName = notes?.firstName || "";
      const lastName = notes?.lastName || "";

      const options = {
        key: keyId,
        amount,
        currency,
        name: "bite.Social",
        description: `${plan.name} plan (${billing})`,
        order_id: orderId,
        prefill: {
          name: `${firstName} ${lastName}`.trim(),
          email: notes?.email,
          contact: notes?.contact,
        },
        theme: {
          color: "#7C6CFF",
        },
        modal: {
          // Reset the loading state if the user closes the modal
          // without completing payment.
          ondismiss: () => setLoadingPlan(null),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(error?.response?.data?.message || "Failed to create payment");
    } finally {
      // Only clear loading here for the redirect / error paths.
      // For the Razorpay modal path, loading is cleared on dismiss
      // (or you can also clear it here if you don't need the spinner
      // to persist while the modal is open).
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0D12] px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#7C6CFF]/10 text-[#A79BFF] border border-[#7C6CFF]/20">
            premium.config
          </span>

          <h1 className="text-3xl sm:text-4xl font-semibold text-[#E7E9EE] mt-4">
            Share more. Connect deeper.
          </h1>

          <p className="text-sm sm:text-base text-[#8A8FA3] mt-3">
            Unlock unlimited posting, private groups, verified profiles, and
            advanced community tools.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex mt-6 bg-[#14161D] border border-[#2A2E3A] rounded-full p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-[#7C6CFF] text-white"
                  : "text-[#8A8FA3] hover:text-[#E7E9EE]"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-[#7C6CFF] text-white"
                  : "text-[#8A8FA3] hover:text-[#E7E9EE]"
              }`}
            >
              Yearly
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00D6A3]/15 text-[#00D6A3]">
                save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? "border-[#7C6CFF] bg-[#14161D] shadow-2xl shadow-[#7C6CFF]/20 md:-translate-y-2"
                  : "border-[#2A2E3A] bg-[#14161D] shadow-xl shadow-black/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-[#7C6CFF] text-white text-[10px] font-mono px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Fake terminal header */}
              <div className="px-4 py-2.5 border-b border-[#2A2E3A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C7A]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5C242]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D6A3]/70" />
                <span className="text-xs font-mono text-[#565B6B] ml-2">
                  {plan.name.toLowerCase()}.plan
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-[#E7E9EE]">
                  {plan.name}
                </h3>

                <p className="text-sm text-[#8A8FA3] mt-2">{plan.tagline}</p>

                {/* Price */}
                <div className="flex items-end gap-1 mt-6">
                  <span className="text-4xl font-semibold text-[#E7E9EE]">
                    ₹{plan.price === 0 ? 0 : plan.price * multiplier}
                  </span>

                  <span className="text-sm text-[#8A8FA3] mb-1.5">
                    {plan.price === 0
                      ? "/ forever"
                      : billing === "yearly"
                      ? "/ year"
                      : "/ month"}
                  </span>
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm"
                    >
                      <CheckIcon included={feature.included} />

                      <span
                        className={
                          feature.included
                            ? "text-[#E7E9EE]"
                            : "text-[#565B6B]"
                        }
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  disabled={plan.price === 0 || loadingPlan === plan.name}
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full mt-6 py-3 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] ${
                    plan.price === 0
                      ? "bg-[#3E455A] text-[#D7DCEE] cursor-not-allowed opacity-70"
                      : plan.highlight
                      ? "bg-[#7C6CFF] text-white hover:bg-[#6D5CF0] shadow-lg shadow-[#7C6CFF]/20"
                      : "bg-[#00D6A3] text-[#06231C] hover:bg-[#00C296]"
                  }`}
                >
                  {loadingPlan === plan.name ? "Processing..." : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#565B6B] mt-8 font-mono">
          cancel anytime · secure payments · no hidden fees
        </p>
      </div>
    </div>
  );
}

export default Premium;