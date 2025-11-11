'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Mock data for UI demonstration
  const hasMockData = false; // Toggle this to show/hide results

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Logic will be implemented later
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Meeting Action-Item Extractor</h1>
        <p className={styles.subtitle}>
          Transform your meeting recordings into actionable insights
        </p>
      </div>

      <div className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="url"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="Paste your audio file URL here..."
              className={styles.input}
              required
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Analyze'}
            </button>
          </div>
        </form>

        {hasMockData && (
          <div className={styles.results}>
            <div className={styles.summarySection}>
              <h2 className={styles.sectionTitle}>Summary</h2>
              <div className={styles.summaryCard}>
                <p className={styles.summaryText}>
                  The team discussed the upcoming product launch scheduled for Q2.
                  Key topics included marketing strategy, budget allocation, and timeline
                  adjustments. The team agreed to accelerate the development phase and
                  allocate additional resources to the design team.
                </p>
              </div>
            </div>

            <div className={styles.actionItemsSection}>
              <h2 className={styles.sectionTitle}>Action Items</h2>
              <div className={styles.actionItemsList}>
                <div className={styles.actionItem}>
                  <div className={styles.actionItemBullet}></div>
                  <div className={styles.actionItemContent}>
                    <p className={styles.actionItemText}>
                      Sarah to finalize the marketing budget by end of week
                    </p>
                    <span className={styles.actionItemMeta}>Due: This Friday</span>
                  </div>
                </div>
                <div className={styles.actionItem}>
                  <div className={styles.actionItemBullet}></div>
                  <div className={styles.actionItemContent}>
                    <p className={styles.actionItemText}>
                      John to schedule follow-up meeting with design team
                    </p>
                    <span className={styles.actionItemMeta}>Due: Next Monday</span>
                  </div>
                </div>
                <div className={styles.actionItem}>
                  <div className={styles.actionItemBullet}></div>
                  <div className={styles.actionItemContent}>
                    <p className={styles.actionItemText}>
                      Team to review and approve the updated timeline
                    </p>
                    <span className={styles.actionItemMeta}>Due: Next Wednesday</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.transcriptSection}>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={styles.transcriptToggle}
              >
                <span>{showTranscript ? '▼' : '▶'} Full Transcript</span>
              </button>
              {showTranscript && (
                <div className={styles.transcriptContent}>
                  <p className={styles.transcriptText}>
                    <strong>Sarah:</strong> Good morning everyone. Let&apos;s start with
                    the product launch timeline. We&apos;re currently looking at Q2, but
                    I want to discuss if that&apos;s still realistic.
                  </p>
                  <p className={styles.transcriptText}>
                    <strong>John:</strong> I think we can make it work if we accelerate
                    the development phase. We might need to allocate more resources to
                    the design team though.
                  </p>
                  <p className={styles.transcriptText}>
                    <strong>Sarah:</strong> That makes sense. I&apos;ll finalize the marketing
                    budget by end of week to see what we can allocate. John, can you
                    schedule a follow-up with the design team?
                  </p>
                  <p className={styles.transcriptText}>
                    <strong>John:</strong> Absolutely. I&apos;ll set that up for Monday.
                    Everyone should review the updated timeline by Wednesday so we can
                    approve it at our next meeting.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
