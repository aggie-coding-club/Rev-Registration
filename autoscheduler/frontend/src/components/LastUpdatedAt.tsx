import * as React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';

/** Given a date, formats it into a string for how long ago it was.
 *  Note that now is only included for mocking the current time for tests.
 */
export function getLastUpdatedAtText(prev: Date, now = new Date()): string {
  if (!prev) return '';

  const seconds = (now.getTime() - prev.getTime()) / 1000;

  // If it was less than a minute ago, say it was x aeconds ago
  if (seconds < 60) {
    return `${seconds.toFixed(0)} seconds ago`;
  }

  // If it was less than 60 minutes ago, say it was x minutes ago
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(0)} minutes ago`;
  }

  // If it was less than 24 hours ago, say it was x hours ago
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(0)} hours ago`;
  }

  // Afterwards, say it was x days ago? Or on some date
  const days = hours / 24;
  if (days < 7) {
    return `${days.toFixed(0)} days ago`;
  }

  // Of it was more than a week ago, say it was on x date (11/15/20)
  const year = `${prev.getFullYear().toFixed(0)}`.substr(2);
  const month = prev.getMonth() + 1; // months are 0-indexed
  const day = prev.getDate(); // gets the day of the month

  return `on ${month}/${day}/${year}`;
}

/**
 * Displays when the current term was last updated, e.g. "Last updated 3 hours ago."
 */
const LastUpdatedAt: React.FC = () => {
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const term = useSelector<RootState, string>((state) => state.term);
  // Store the last term so we can check if it changed
  const [lastTerm, setLastTerm] = React.useState(term);

  React.useEffect(() => {
    if (!term) {
      setLastUpdated(null); // So the last updated text disappears on the landing page
      return;
    }

    // If the last term changed, then set lastUpdated to null so it disappears while the new one
    // is loading
    if (term !== lastTerm) setLastUpdated(null);

    setLastTerm(term);

    fetch(`api/get_last_updated?term=${term}`).then((res) => res.json()).then((dateStr) => {
      setLastUpdated(new Date(dateStr));
    });
  }, [term, lastTerm]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
      }}
    >
      <Typography variant="subtitle2">
        {lastUpdated ? `Last updated ${getLastUpdatedAtText(lastUpdated)}` : null}
      </Typography>
    </div>
  );
};

export default LastUpdatedAt;
