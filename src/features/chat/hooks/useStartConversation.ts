export const startConversation = async (freelancerId: string) => {
  const res = await fetch("/api/chat/createChannel", {
    method: "POST",
    body: JSON.stringify({ freelancerId }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!data?.channelId) {
    console.error("Chat creation failed", data);
    return null;
  }

  // redirect user to messages page with channel ID
  window.location.href = `/messages?channel=${data.channelId}`;
};
