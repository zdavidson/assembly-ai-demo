import { parseBulletPoints, parseActionItems } from "../utils/textParsing";
import styles from "../app/page.module.css";

interface ActionItemsProps {
  summary: string | undefined;
}

export default function ActionItems({ summary }: ActionItemsProps) {
  // Try to parse as structured action items first
  const actionItems = parseActionItems(summary);

  // Fall back to bullet points if no structured items found
  const bulletPoints = actionItems.length === 0 ? parseBulletPoints(summary) : [];

  if (actionItems.length === 0 && bulletPoints.length === 0) {
    return null;
  }

  return (
    <div className={styles.actionItemsSection}>
      <h2 className={styles.sectionTitle}>Action Items</h2>
      <div className={styles.actionItemsList}>
        {actionItems.length > 0 ? (
          actionItems.map((item, index) => (
            <div key={index} className={styles.actionItem}>
              <div className={styles.actionItemBullet}></div>
              <div className={styles.actionItemContent}>
                <h3 className={styles.actionItemTitle}>{item.title}</h3>
                <div className={styles.actionItemDetails}>
                  <span className={styles.actionItemDetail}>
                    <strong>Responsible:</strong> {item.responsible}
                  </span>
                  <span className={styles.actionItemDetail}>
                    <strong>Deadline:</strong> {item.deadline}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          bulletPoints.map((item, index) => (
            <div key={index} className={styles.actionItem}>
              <div className={styles.actionItemBullet}></div>
              <div className={styles.actionItemContent}>
                <p className={styles.actionItemText}>{item}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
