import { useState } from "react";
import { createPoll } from "../services/api";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createPoll({
        question,
        options,
        expiresAt: new Date(expiresAt).toISOString(),
      });

      navigate(`/poll/${response.data.data.pollId}`);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <BackButton />
        <h1 className="poll-title">Create New Poll</h1>

        <form onSubmit={handleSubmit} className="form-layout">
          {/* QUESTION */}
          <div className="form-group">
            <label>Poll Question</label>
            <input
              type="text"
              placeholder="What's your question?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {/* OPTIONS */}
          <div className="form-group">
            <label>Options</label>

            {options.map((opt, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />

                {options.length > 2 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeOption(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="add-option-btn"
              onClick={addOption}
            >
              + Add Another Option
            </button>
          </div>

          {/* EXPIRATION */}
          <div className="form-group">
            <label>Expires At</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </div>

          {/* SUBMIT */}
          <button type="submit" className="submit-btn">
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
