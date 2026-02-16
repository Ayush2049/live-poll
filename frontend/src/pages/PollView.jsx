import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPoll, castVote } from "../services/api";
import CountdownTimer from "../components/CountdownTimer";
import PollResults from "../components/PollResults";
import { io } from "socket.io-client";
import ShareButton from "../components/ShareButton";
import BackButton from "../components/BackButton";

const PollView = () => {
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [debugData, setDebugData] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      withCredentials: true,
    });

    // 🔥 Safe device token generation
    let token = localStorage.getItem("device_token");

    if (!token) {
      token =
        (window.crypto?.randomUUID && window.crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem("device_token", token);
    }

    setDeviceToken(token);

    const fetchPoll = async () => {
      try {
        const res = await getPoll(id);
        setPoll(res.data.data);
      } catch (error) {
        console.error("Failed to fetch poll:", error);
      }
    };

    fetchPoll();

    socket.emit("join_poll", id);

    socket.on("vote_update", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off("vote_update");
      socket.disconnect();
    };
  }, [id]);

  const handleVote = async (optionId) => {
    try {
      setBackendMessage("");
      setDebugData(null);

      const response = await castVote(id, optionId, deviceToken);

      // 🔥 If backend returned success false but status 200
      if (!response.data.success) {
        setBackendMessage(response.data.message);
        setDebugData(response.data.debug);
        return;
      }

      // ✅ Real success
      setBackendMessage(response.data.message);
      setDebugData(response.data.debug);
      setVoted(true);
    } catch (error) {
      // 🔥 VERY IMPORTANT FIX
      if (error.response) {
        setBackendMessage(error.response.data?.message || "Vote blocked");
        setDebugData(error.response.data?.debug || null);
      } else {
        setBackendMessage("Network error");
      }
    }
  };

  if (!poll) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="loading">Loading poll...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <BackButton />

        {/* 🔥 Device Token */}
        <div
          style={{
            fontSize: "12px",
            color: "red",
            wordBreak: "break-all",
            marginBottom: "10px",
          }}
        >
          <strong>Device Token:</strong> {deviceToken}
        </div>

        {/* 🔥 Backend Message */}
        {backendMessage && (
          <div
            style={{
              background: "#1f2937",
              color: "#facc15",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
              fontSize: "13px",
            }}
          >
            <strong>Status:</strong> {backendMessage}
          </div>
        )}

        {/* 🔥 Backend Debug */}
        {debugData && (
          <div
            style={{
              background: "#111827",
              color: "#22d3ee",
              fontSize: "12px",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              wordBreak: "break-word",
            }}
          >
            <strong>Backend Debug:</strong>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}

        <h2 className="poll-title">{poll.question}</h2>

        <div style={{ marginBottom: "25px" }}>
          <ShareButton url={`${window.location.origin}/poll/${poll._id}`} />
        </div>

        <CountdownTimer expiresAt={poll.expiresAt} />

        {voted && (
          <div className="vote-success">✅ Your vote has been recorded</div>
        )}

        {!voted && poll.isActive && (
          <div className="content-section" style={{ marginBottom: "30px" }}>
            {poll.options.map((opt) => (
              <button
                key={opt._id}
                className="option-button"
                onClick={() => handleVote(opt._id)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

        <PollResults poll={poll} />
      </div>
    </div>
  );
};

export default PollView;
