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

  useEffect(() => {
    // 🔌 Initialize socket
    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      withCredentials: true,
    });

    // 🔍 SAFE TOKEN GENERATION (Debug Mode)
    let token = localStorage.getItem("device_token");

    if (!token) {
      token =
        (window.crypto?.randomUUID && window.crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      localStorage.setItem("device_token", token);
    }

    setDeviceToken(token);
    console.log("📱 Device token:", token);

    // 📥 Fetch poll
    const fetchPoll = async () => {
      try {
        const res = await getPoll(id);
        setPoll(res.data.data);
      } catch (error) {
        console.error("Failed to fetch poll:", error);
      }
    };

    fetchPoll();

    // Join WebSocket room
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
      const response = await castVote(id, optionId, deviceToken);

      alert(
        `Message: ${response.data.message}\n\nStatus: ${response.data.debug?.status}`,
      );

      if (response.data.success) {
        setVoted(true);
      }
    } catch (error) {
      alert(error.response?.data?.message);
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

        {/* 🔍 DEBUG TOKEN DISPLAY */}
        <p
          style={{
            fontSize: "12px",
            color: "red",
            wordBreak: "break-all",
            marginBottom: "10px",
          }}
        >
          Device Token: {deviceToken}
        </p>

        <h2 className="poll-title">{poll.question}</h2>

        <div style={{ marginBottom: "25px" }}>
          <ShareButton url={`${window.location.origin}/poll/${poll._id}`} />
        </div>

        <CountdownTimer expiresAt={poll.expiresAt} />

        {voted && (
          <div className="vote-success">Your vote has been recorded</div>
        )}

        {/* Vote Buttons */}
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

        {/* Results ALWAYS visible */}
        <PollResults poll={poll} />
      </div>
    </div>
  );
};

export default PollView;
