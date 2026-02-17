import { useEffect, useRef, useCallback } from 'react';

export const useMessageObserver = (
  userId: string | undefined,
  onSeen: (payload: { message_id: string; status: any; sender_id: string }) => void
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  // Initialize observer only once
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const msgId = el.dataset.id;
            const senderId = el.dataset.sender;
            const status = el.dataset.status;

            // Only trigger if: Not my message AND not already seen
            if (senderId !== userId && status !== 'seen' && msgId && senderId) {
              onSeen({
                message_id: msgId,
                status: 'seen',
                sender_id: senderId,
              });
              // Stop watching this specific message once it's seen
              observer.current?.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => observer.current?.disconnect();
  }, [userId, onSeen]);

  // This function will be attached to each message's 'ref'
  const setRef = useCallback((el: HTMLDivElement | null) => {
    if (el && observer.current) {
      observer.current.observe(el);
    }
  }, []);

  return { setRef };
};