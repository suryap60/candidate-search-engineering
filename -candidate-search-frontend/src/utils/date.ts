export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) {
    return "Never";
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return "Never";
  }

  // Format: "22 Sep 2026, 08:30 AM"
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");

  return `${day} ${month} ${year}, ${hoursStr}:${minutes} ${ampm}`;
}
