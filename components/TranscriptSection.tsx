import { useState } from "react";
import styles from "../app/page.module.css";

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscriptSectionProps {
  transcript: Utterance[] | undefined;
}

export default function TranscriptSection({
  transcript,
}: TranscriptSectionProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  if (!transcript || transcript.length === 0) {
    return null;
  }

  return (
    <div className={styles.transcriptSection}>
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className={styles.transcriptToggle}
      >
        <span>{showTranscript ? "▼" : "▶"} Full Transcript</span>
      </button>
      {showTranscript && (
        <div className={styles.transcriptContent}>
          {transcript.map((utterance, index) => (
            <div key={index} className={styles.utterance}>
              <strong className={styles.speaker}>{utterance.speaker}:</strong>{" "}
              <span className={styles.transcriptText}>{utterance.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
