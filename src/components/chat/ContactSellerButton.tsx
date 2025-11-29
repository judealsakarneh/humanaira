"use client";

type Props = {
  freelancerId: string;
  label?: string;
  className?: string;
};

export default function ContactSellerButton({ freelancerId, label = "Contact Seller", className = "" }: Props) {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/chat/createChannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freelancerId }),
      });

      const data = await res.json();

      if (!data?.channelId) {
        alert("Unable to start chat. Please try again.");
        return;
      }

      window.location.href = `/messages?channel=${data.channelId}`;
    } catch (err) {
      console.error("Contact Seller Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-2 rounded-lg transition bg-[#35BFFF] text-black font-semibold hover:shadow-[0_0_12px_#35BFFF] ${className}`}
    >
      {label}
    </button>
  );
}
