import * as React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducer';

/** Given a date, formats it into a string for how long ago it was.
 *  Note that now is only included for mocking the current time for tests.
 */
export function getLastUpdatedAtText(prev: Date, now = new Date()): string {
  const seconds = (now.getTime() - prev.getTime()) / 1000;

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

  // If it was less than a week ago, say it was x days ago
  const days = hours / 24;
  if (days < 7) {
    return `${days.toFixed(0)} days ago`;
  }

  // If it was more than a week ago, say it was on x date (e.g. 11/15/20)
  const year = `${prev.getFullYear().toFixed(0)}`.substr(2);
  const month = prev.getMonth() + 1; // months are 0-indexed
  const day = prev.getDate(); // gets the day of the month

  return `on ${month}/${day}/${year}`;
}

/**
 * Displays when the current term was last updated, e.g. "Last updated 3 hours ago."
 */
const LastUpdatedAt: React.FC = () => {
  const [lastUpdated, setLastUpdated] = React.useState<Date>();
  const [lastUpdatedText, setLastUpdatedText] = React.useState('');
  const term = useSelector<RootState, string>((state) => state.term);
  // Store the last term so we can check if it changed
  const [lastTerm, setLastTerm] = React.useState(term);

  React.useEffect(() => {
    const fetchLastUpdated = (): void => {
      if (!term) {
        // So the last updated text disappears on the landing page
        setLastUpdated(null);
        setLastUpdatedText('');
        return;
      }

      // If the last term changed, then set lastUpdated to null so it disappears while the new one
      // is loading
      if (term !== lastTerm) {
        setLastUpdated(null);
        setLastUpdatedText('');
      }

      setLastTerm(term);

      fetch(`api/get_last_updated?term=${term}`).then((res) => res.json()).catch(() => '').then((dateStr) => {
        if (!dateStr) {
          setLastUpdated(undefined);
          setLastUpdatedText('');
          return;
        }

        const date = new Date(dateStr);
        setLastUpdated(date);
        setLastUpdatedText(getLastUpdatedAtText(date));
      });
    };

    fetchLastUpdated();

    const interval = setInterval(() => fetchLastUpdated, 5 * 60 * 1000); // update every 5 minutes

    return (): void => clearInterval(interval);
  // We don't include lastTerm in this so this doesn't run twice when the term is changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  // Update the text every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setLastUpdatedText(getLastUpdatedAtText(lastUpdated));
      }
    }, 60 * 1000); // Every minute

    return (): void => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
      }}
    >
      <Typography variant="body2">
        {lastUpdatedText ? `Last updated ${lastUpdatedText}` : null}
      </Typography>
    </div>
  );
};

export default LastUpdatedAt;
