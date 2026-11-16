import { useEffect } from 'react';

import { markInteractive } from './timeToInteractive';

/**
 * Records launch time-to-interactive once `ready` is true.
 * A later render in this session does not record again.
 */
export function useMarkInteractive(ready: boolean): void {
  useEffect(() => {
    if (ready) {
      markInteractive();
    }
  }, [ready]);
}
