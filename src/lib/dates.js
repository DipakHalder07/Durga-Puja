// Deterministic date labels. toLocaleDateString differs between Node, Chrome and Safari and by
// the visitor's time zone, which breaks hydration and can show the wrong day abroad.
// Festival dates are calendar days in India, so they are formatted from the YYYY-MM-DD string.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const parts = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return { y, m, d, wd: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};

// formatDate('2026-10-17', { weekday: 'long', month: 'long', year: true }) → "Saturday, 17 October 2026"
export function formatDate(iso, { weekday = false, month = 'long', year = true } = {}) {
  const { y, m, d, wd } = parts(iso);
  const w = weekday ? `${weekday === 'short' ? WEEKDAYS[wd].slice(0, 3) : WEEKDAYS[wd]}, ` : '';
  const mon = month === 'short' ? MONTHS[m - 1].slice(0, 3) : MONTHS[m - 1];
  return `${w}${d} ${mon}${year ? ` ${y}` : ''}`;
}

export const weekdayOf = (iso) => WEEKDAYS[parts(iso).wd];

// Moment a festival day starts in Siliguri (IST): Mahalaya broadcast at 4 AM, puja days from 6 AM
export const eventStart = (e) => new Date(`${e.date}T${e.event_type === 'mahalaya' ? '04:00' : '06:00'}:00+05:30`).getTime();
