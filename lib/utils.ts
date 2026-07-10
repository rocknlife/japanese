export function getMondayOfDate(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function getWeekDates(startDate: Date): string[] {
  const dates: string[] = [];
  const temp = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    dates.push(temp.toISOString().split("T")[0]);
    temp.setDate(temp.getDate() + 1);
  }
  return dates;
}

export function getAttendanceStatus(
  user: { attendance: string[] },
  dateStr: string
): "none" | "present" | "absent" {
  const match = user.attendance.find((item) => item.startsWith(dateStr));
  if (!match) return "none";
  if (match.endsWith(":N")) return "absent";
  return "present";
}

export function speakText(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const cleanText = text.replace(/<[^>]*>/g, "");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find((v) => v.lang.includes("ja-JP"));
  if (jpVoice) utterance.voice = jpVoice;
  window.speechSynthesis.speak(utterance);
}

export function formatNow(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlightChar(text: string, char: string): string {
  if (!char) return text;
  return text.split(char).join(
    `<span class="text-rose-500 font-extrabold underline">${char}</span>`
  );
}

export function highlightCharInFood(text: string, char: string): string {
  if (!char) return text;
  return text.split(char).join(
    `<span class="bg-rose-100 text-rose-600 px-1 py-0.5 rounded border border-rose-200 font-extrabold underline">${char}</span>`
  );
}
