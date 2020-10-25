import * as React from 'react';

interface Dimensions {
  width: number;
  height: number;
  left: number;
  top: number;
}

// Returns dimensions of a ref, responsive to resizing
export default function useDimensions(ref: React.MutableRefObject<any>): Dimensions {
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  // Update dimensions on ref change or resize
  React.useEffect(() => {
    const updateDimensions = (): void => {
      setDimensions({
        width: ref.current?.offsetWidth || 0,
        height: ref.current?.offsetHeight || 0,
        left: ref.current?.offsetLeft || 0,
        top: ref.current?.offsetTop || 0,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return (): void => window.removeEventListener('resize', updateDimensions);
  }, [ref]);

  return dimensions;
}
