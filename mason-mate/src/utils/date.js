export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function isPast12PM() {
  return new Date().getHours() >= 12;
}
