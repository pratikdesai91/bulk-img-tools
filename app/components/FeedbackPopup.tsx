"use client";
import { useState } from "react";

export default function FeedbackPopup({
  show,
  onClose,
  onSubmit,
}: {
  show: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; message: string }) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (onSubmit) onSubmit({ rating, message: feedback.trim() });
    setFeedback("");
    setRating(0);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">⭐ Rate Your Experience</h2>

        {/* Stars */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl focus:outline-none"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              {star <= (hover || rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Tell us what you think..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border rounded p-2 mb-4 h-24"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 && feedback.trim().length === 0}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}