import calculatePercentage from "../utils/calculatePercentage";

const COLORS = [
  "#6366f1",
  "#22d3ee",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
];

const PollResults = ({ poll }) => {
  if (!poll || !poll.options || poll.totalVotes === 0) {
    return (
      <div className="content-section" style={{ textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>
          No votes yet. Be the first to vote!
        </p>
      </div>
    );
  }

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="content-section" style={{ textAlign: "center" }}>
      {/* =========================
          PIE CHART
      ========================== */}
      <div
        style={{
          width: "250px",
          height: "250px",
          margin: "30px auto",
          position: "relative",
        }}
      >
        <svg width="250" height="250" viewBox="0 0 250 250">
          <g transform="rotate(-90 125 125)">
            {poll.options.map((opt, index) => {
              const percentage = calculatePercentage(
                opt.voteCount,
                poll.totalVotes,
              );

              const dashArray = `${(percentage / 100) * circumference} ${circumference}`;
              const dashOffset = -cumulativePercent * circumference;

              cumulativePercent += percentage / 100;

              return (
                <circle
                  key={opt._id}
                  cx="125"
                  cy="125"
                  r={radius}
                  fill="transparent"
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth="40"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition: "stroke-dasharray 0.6s ease",
                  }}
                />
              );
            })}
          </g>
        </svg>

        {/* CENTER LABEL */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {poll.totalVotes}
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "4px",
            }}
          >
            Total Votes
          </div>
        </div>
      </div>

      {/* =========================
          LEGEND
      ========================== */}
      <div style={{ marginTop: "20px" }}>
        {poll.options.map((opt, index) => {
          const percentage = calculatePercentage(
            opt.voteCount,
            poll.totalVotes,
          );

          return (
            <div
              key={opt._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "4px",
                    backgroundColor: COLORS[index % COLORS.length],
                    marginRight: "10px",
                  }}
                />
                <span>{opt.text}</span>
              </div>

              <span style={{ color: "var(--accent)" }}>{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollResults;
