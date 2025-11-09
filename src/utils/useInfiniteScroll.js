import { useEffect, useRef } from 'react';

/**
 * Custom hook that fires a callback when the user scrolls near the bottom of the
 * page (80% of the document height). The scroll handler is debounced by 200ms
 * to avoid excessive firing. The listener is attached to the `window` and
 * automatically cleaned up on unmount.
 *
 * @param {Function} callback Function to invoke when scroll threshold is reached.
 */
export default function useInfiniteScroll(callback) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (typeof callback !== 'function') return;

    const handleScroll = () => {
      // Debounce: clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const scrollPos = window.innerHeight + window.scrollY;
        const threshold = document.documentElement.scrollHeight * 0.8;
        if (scrollPos >= threshold) {
          callback();
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback]);
}