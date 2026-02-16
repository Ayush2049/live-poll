import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ShareButton from "../components/ShareButton";

/**
 * Home Component
 *
 * Displays a list of active polls fetched from the backend.
 * Users can:
 * - View all available poll rooms
 * - Navigate to a specific poll
 * - Create a new poll
 * - Share a poll link directly
 *
 * Poll data is fetched on initial mount.
 */
const Home = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  /**
   * Fetches all available polls from the API.
   * Updates local state with retrieved poll data.
   */
  const fetchPolls = async () => {
    try {
      const res = await API.get("/polls");
      setPolls(res.data.data);
    } catch (error) {
      // Silently fail to prevent UI disruption
    }
  };

  /**
   * Trigger initial poll fetch when component mounts.
   */
  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="poll-title">Real-Time Poll Rooms</h2>

        <button className="option-button" onClick={() => navigate("/create")}>
          + Create Your Own Poll
        </button>

        <hr className="divider" />

        <div className="section-header">
          <h3>Active Polls</h3>
          {polls.length > 0 && (
            <p>
              {polls.length} poll{polls.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {polls.length === 0 && (
          <div className="empty-state">
            <p>No polls yet.</p>
            <small>Be the first to create one!</small>
          </div>
        )}

        <div className="polls-grid">
          {polls.map((poll, index) => (
            <div
              key={poll._id}
              className="poll-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/poll/${poll._id}`)}
            >
              <p>{poll.question}</p>

              <small>Total votes: {poll.totalVotes}</small>

              <div
                className="share-button-wrapper"
                onClick={(e) => e.stopPropagation()}
              >
                <ShareButton
                  url={`${window.location.origin}/poll/${poll._id}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
