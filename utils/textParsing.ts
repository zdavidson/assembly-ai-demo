export interface ActionItem {
  title: string;
  responsible: string;
  deadline: string;
}

export function parseBulletPoints(summary: string | undefined): string[] {
  if (!summary) return [];
  return summary
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed.startsWith("-") ||
        trimmed.startsWith("•") ||
        trimmed.startsWith("*") ||
        trimmed.match(/^\d+\./)
      );
    })
    .map((line) => {
      const trimmed = line.trim();
      // Remove bullet point characters (-, •, *, or numbers with periods)
      if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
        return trimmed.substring(1).trim();
      }
      // Remove numbered list format (e.g., "1. ")
      return trimmed.replace(/^\d+\.\s*/, "").trim();
    });
}

export function parseActionItems(summary: string | undefined): ActionItem[] {
  if (!summary) return [];

  const items: ActionItem[] = [];
  const lines = summary.split("\n");

  let currentItem: Partial<ActionItem> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("TITLE:")) {
      // Save previous item if exists
      if (currentItem && currentItem.title) {
        items.push({
          title: currentItem.title,
          responsible: currentItem.responsible || "Not assigned",
          deadline: currentItem.deadline || "N/A",
        });
      }
      // Start new item
      currentItem = {
        title: trimmed.substring(6).trim(),
      };
    } else if (trimmed.startsWith("Responsible:") && currentItem) {
      currentItem.responsible = trimmed.substring(12).trim();
    } else if (trimmed.startsWith("Deadline:") && currentItem) {
      currentItem.deadline = trimmed.substring(9).trim();
    }
  }

  // Add the last item
  if (currentItem && currentItem.title) {
    items.push({
      title: currentItem.title,
      responsible: currentItem.responsible || "Not assigned",
      deadline: currentItem.deadline || "N/A",
    });
  }

  return items;
}
