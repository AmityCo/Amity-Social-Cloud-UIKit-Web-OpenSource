import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState, type ComponentType, type ReactNode, type SVGProps } from 'react';
import styles from './SwipeToLeft.module.css';

const ACTION_WIDTH = 80;
const TRIGGER_OFFSET = -ACTION_WIDTH / 2;
const TRIGGER_VELOCITY = -300;
const SPRING = { type: 'spring' as const, stiffness: 400, damping: 40 } as const;
const TRIGGER_SPRING = { type: 'spring' as const, stiffness: 500, damping: 50 } as const;

type SwipeToLeftProps = {
  children: ReactNode;
  actionLabel: string;
  actionIcon: ComponentType<SVGProps<SVGSVGElement>>;
  onAction: () => void;
};

export function SwipeToLeft({
  children,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
}: SwipeToLeftProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const actionX = useTransform(x, [0, -ACTION_WIDTH], [ACTION_WIDTH, 0], { clamp: true });
  const iconScale = useTransform(x, [TRIGGER_OFFSET, TRIGGER_OFFSET - 1], [1, 1.15], {
    clamp: true,
  });
  const justDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div ref={containerRef} className={styles.swipeToLeft}>
      <div className={styles.swipeToLeft__action} aria-hidden="true">
        <motion.div className={styles.swipeToLeft__actionContent} style={{ x: actionX }}>
          <motion.span className={styles.swipeToLeft__actionIcon} style={{ scale: iconScale }}>
            <ActionIcon />
          </motion.span>
          <span className={styles.swipeToLeft__actionLabel}>{actionLabel}</span>
        </motion.div>
      </div>
      <motion.div
        className={styles.swipeToLeft__row}
        data-dragging={isDragging || undefined}
        style={{ x }}
        drag="x"
        dragConstraints={{ right: 0 }}
        dragElastic={{ left: 0.6, right: 0.05 }}
        whileDrag={{ cursor: 'grabbing' }}
        onDragStart={() => {
          justDraggedRef.current = true;
          setIsDragging(true);
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          const shouldTrigger =
            info.offset.x < TRIGGER_OFFSET || info.velocity.x < TRIGGER_VELOCITY;
          if (shouldTrigger) {
            const width = containerRef.current?.offsetWidth ?? 0;
            animate(x, -width, {
              ...TRIGGER_SPRING,
              onComplete: () => {
                onAction();
                x.set(0);
              },
            });
          } else {
            animate(x, 0, SPRING);
          }
          window.setTimeout(() => {
            justDraggedRef.current = false;
          }, 50);
        }}
        onClickCapture={(e) => {
          if (justDraggedRef.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
