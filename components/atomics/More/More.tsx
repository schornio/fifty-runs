'use client';

import { ReactNode, memo, useEffect, useRef } from 'react';

function MoreComponent({
  children,
  onMore,
}: {
  children?: ReactNode;
  onMore?: () => void;
}) {
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moreElement = moreRef.current;

    if (!moreElement || !onMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingElement = entries.find(
          (entry) => entry.isIntersecting,
        );

        if (intersectingElement) {
          onMore();
        }
      },
      { threshold: 1 },
    );

    observer.observe(moreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onMore]);

  return <div ref={moreRef}>{children}</div>;
}

export const More = memo(MoreComponent);
