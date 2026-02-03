"use client";

import { useState } from "react";
import { API } from "@/lib/api/endpoints";

export default function Page() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePingBackend = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}${API.HEALTH}`;
      const res = await fetch(url);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePingBackend} disabled={loading}>
        {loading ? "Pinging..." : "Ping Backend"}
      </button>
      {response && <pre>{response}</pre>}
    </div>
  );
}
