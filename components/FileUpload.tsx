import { isValidAudioFile } from "../utils/audioValidation";
import styles from "../app/page.module.css";

interface FileUploadProps {
  audioFile: File | null;
  onFileChange: (file: File | null) => void;
  isProcessing: boolean;
  onSubmit: () => void;
  speakerAName: string;
  speakerBName: string;
  onSpeakerANameChange: (name: string) => void;
  onSpeakerBNameChange: (name: string) => void;
  useLlmGateway: boolean;
  onUseLlmGatewayChange: (use: boolean) => void;
}

export default function FileUpload({
  audioFile,
  onFileChange,
  isProcessing,
  onSubmit,
  speakerAName,
  speakerBName,
  onSpeakerANameChange,
  onSpeakerBNameChange,
  useLlmGateway,
  onUseLlmGatewayChange,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidAudioFile(file)) {
      alert("Please select a valid audio or video file");
      return;
    }
    onFileChange(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={styles.form}
    >
      <div className={styles.inputGroup}>
        <div className={styles.fileUploadWrapper}>
          <input
            type="file"
            id="audioFile"
            onChange={handleFileChange}
            accept="audio/*,video/mp4,video/webm"
            className={styles.fileInput}
            required
          />
          <label htmlFor="audioFile" className={styles.fileLabel}>
            {audioFile ? audioFile.name : "Choose an audio file..."}
          </label>
        </div>
      </div>

      <div className={styles.speakerInputs}>
        <div className={styles.speakerInputGroup}>
          <label htmlFor="speakerA" className={styles.speakerLabel}>
            Speaker A Name:
          </label>
          <input
            type="text"
            id="speakerA"
            value={speakerAName}
            onChange={(e) => onSpeakerANameChange(e.target.value)}
            placeholder="e.g., John Doe"
            className={styles.speakerInput}
            required
          />
        </div>
        <div className={styles.speakerInputGroup}>
          <label htmlFor="speakerB" className={styles.speakerLabel}>
            Speaker B Name:
          </label>
          <input
            type="text"
            id="speakerB"
            value={speakerBName}
            onChange={(e) => onSpeakerBNameChange(e.target.value)}
            placeholder="e.g., Jane Smith"
            className={styles.speakerInput}
            required
          />
        </div>
      </div>

      <div className={styles.toggleGroup}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={useLlmGateway}
            onChange={(e) => onUseLlmGatewayChange(e.target.checked)}
            className={styles.toggleCheckbox}
          />
          <span className={styles.toggleText}>
            Use LLM Gateway (Claude-powered analysis)
          </span>
        </label>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isProcessing || !audioFile || !speakerAName || !speakerBName}
      >
        {isProcessing ? "Processing..." : "Analyze"}
      </button>
    </form>
  );
}
