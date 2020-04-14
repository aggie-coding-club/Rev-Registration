import * as React from 'react';
import * as styles from './GenericCard.css';

interface GenericCardProps {
    header?: JSX.Element;
    style?: React.CSSProperties;
}

/**
 * Makes a generic card with a maroon header. Any children are rendered inside the body, and
 * elements can be rendered inside the header by setting the header prop
 * @param props Includes header, children, and style, all optional
 */
const GenericCard: React.FC<React.PropsWithChildren<GenericCardProps>> = (
  { header, children, style },
) => (
  <div className={styles.container} style={{ ...style }}>
    <div className={styles.header}>{header}</div>
    {children}
  </div>
);

export default GenericCard;
