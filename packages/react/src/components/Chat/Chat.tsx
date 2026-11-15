'use client';

import {
  createContext,
  use,
  useEffect,
  useRef,
  type ComponentProps,
  type ComponentPropsWithRef,
  type UIEvent,
} from 'react';
import { setRef } from '../../setRef';
import { tv } from '../../tv';
import { focusRing } from '../../variants';
import { Avatar } from '../Avatar';

export type ChatSide = 'start' | 'end';

const chatStyles = tv({
  slots: {
    root: [
      'flex flex-col gap-4 overflow-y-auto overscroll-contain rounded-surface p-4',
      focusRing(),
    ],
    group: 'flex flex-col gap-1',
    header: 'flex items-center gap-2',
    sender: 'text-oneline-14 font-bold base-fg-strong',
    time: 'text-oneline-14 base-fg-muted tabular-nums',
    // The transparent border is invisible until forced-colors mode drops the
    // fill; then it is what still outlines the bubble.
    bubble: [
      'max-w-4/5 rounded-surface border border-transparent px-3 py-2 text-body-16 wrap-anywhere',
    ],
    avatar: 'inline-flex shrink-0',
    footnote: 'text-dense-14 base-fg-muted',
  },
  variants: {
    side: {
      start: {
        group: 'items-start',
        // The corner nearest the speaker is the "tail".
        bubble: 'rounded-ss-tight base-bg-muted base-fg',
      },
      end: {
        group: 'items-end',
        header: 'flex-row-reverse',
        bubble: 'rounded-se-tight primary-bg-muted base-fg-strong',
      },
    },
  },
  defaultVariants: { side: 'start' },
});

const styles = chatStyles();

const SideContext = createContext<ChatSide>('start');

// How close to the bottom (px) still counts as "at the bottom", so a
// sub-pixel scrollTop does not stop the log from following.
const BOTTOM_SLACK = 24;

const prefersReducedMotion = (): boolean =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type ChatRootProps = Omit<ComponentPropsWithRef<'div'>, 'aria-label'> & {
  // role="log" is a landmark-like region; it needs a name.
  'aria-label': string;
  // Follow new messages to the bottom. Even when on, the log stays put while
  // the reader has scrolled up, and follows again once they return.
  autoScroll?: boolean;
};

export const ChatRoot = ({
  autoScroll = true,
  ref,
  onScroll,
  className,
  ...props
}: ChatRootProps) => {
  const element = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const lastTop = useRef(0);

  useEffect(() => {
    const log = element.current;
    if (log === null || !autoScroll) return;
    log.scrollTop = log.scrollHeight;
    // Set now, not on the scroll event: a reader who scrolls up before that
    // event fires must still count as having moved up.
    lastTop.current = log.scrollTop;
    const observer = new MutationObserver(() => {
      if (!following.current) return;
      log.scrollTo({
        top: log.scrollHeight,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
    observer.observe(log, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [autoScroll]);

  // Only an upward scroll stops following: our own smooth scroll moves down,
  // so it can never switch the log off midway.
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    onScroll?.(event);
    const log = event.currentTarget;
    const atBottom =
      log.scrollHeight - log.scrollTop - log.clientHeight <= BOTTOM_SLACK;
    if (atBottom) following.current = true;
    else if (log.scrollTop < lastTop.current) following.current = false;
    lastTop.current = log.scrollTop;
  };

  const setElement = (node: HTMLDivElement | null) => {
    element.current = node;
    setRef(ref, node);
  };

  return (
    // tabIndex: a scrolling region must be reachable by keyboard to scroll it.
    <div
      ref={setElement}
      role="log"
      tabIndex={0}
      onScroll={handleScroll}
      className={styles.root({ className })}
      {...props}
    />
  );
};

type ChatGroupProps = ComponentPropsWithRef<'div'> & {
  // start: the other person, end: you. Logical, so RTL mirrors it.
  side?: ChatSide;
};

export const ChatGroup = ({
  side = 'start',
  className,
  ...props
}: ChatGroupProps) => (
  <SideContext value={side}>
    <div
      data-side={side}
      className={chatStyles({ side }).group({ className })}
      {...props}
    />
  </SideContext>
);

export const ChatHeader = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => {
  const side = use(SideContext);
  return (
    <div className={chatStyles({ side }).header({ className })} {...props} />
  );
};

// The sender's name is already spoken by ChatSender, so the picture is hidden
// from assistive technology instead of announcing the name twice.
export const ChatAvatar = (props: ComponentProps<typeof Avatar>) => (
  <span aria-hidden="true" className={styles.avatar()}>
    <Avatar size="sm" {...props} />
  </span>
);

export const ChatSender = ({
  className,
  ...props
}: ComponentPropsWithRef<'span'>) => (
  <span className={styles.sender({ className })} {...props} />
);

type ChatTimeProps = ComponentPropsWithRef<'time'> & {
  dateTime: string;
};

export const ChatTime = ({ className, ...props }: ChatTimeProps) => (
  <time className={styles.time({ className })} {...props} />
);

export const ChatBubble = ({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) => {
  const side = use(SideContext);
  return (
    <div className={chatStyles({ side }).bubble({ className })} {...props} />
  );
};

export const ChatFootnote = ({
  className,
  ...props
}: ComponentPropsWithRef<'p'>) => (
  <p className={styles.footnote({ className })} {...props} />
);
