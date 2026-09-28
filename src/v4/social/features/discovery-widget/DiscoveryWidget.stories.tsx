import React from 'react';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { DiscoveryWidget } from './DiscoveryWidget';

export default {
  title: 'Discovery Widget',
  component: DiscoveryWidget,
  argTypes: {
    topicId: { control: 'text' },
    showHeader: { control: 'boolean' },
    minVisibilityThreshold: { control: { type: 'number', min: 1 } },
    useOnCardClick: {
      name: 'Use onCardClick prop',
      control: 'boolean',
      description:
        'On: the onCardClick prop handles the click and goToDestination is skipped. Off: no prop is passed, so the behaviour class handles it. Only one alert ever fires.',
    },
    runA11yChecks: {
      name: 'Run keyboard a11y checks',
      control: 'boolean',
      description:
        'Off by default so the widget is clean to interact with (click cards, see the goToDestination alert). Turn on to run the keyboard/roving-tabindex checks in the Interactions panel.',
    },
  },
};

type StoryArgs = React.ComponentProps<typeof DiscoveryWidget> & {
  runA11yChecks?: boolean;
  useOnCardClick?: boolean;
};

const render = ({ runA11yChecks: _runA11yChecks, useOnCardClick, ...props }: StoryArgs) => (
  <div style={{ padding: '1.5rem 1rem' }}>
    <DiscoveryWidget
      {...props}
      onCardClick={
        useOnCardClick
          ? (topicId, post) =>
              window.alert(`onCardClick prop \n\npostId: ${post.postId}\ntopicId: ${topicId}`)
          : undefined
      }
    />
  </div>
);

const args: StoryArgs = {
  topicId: 'game',
  showHeader: true,
  minVisibilityThreshold: 3,
  useOnCardClick: true,
  runA11yChecks: false,
};

const getCards = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[data-post-id] > [role="button"]'));

export const DiscoveryWidgetSample = {
  name: 'Discovery Widget',
  tags: ['a11y-keyboard'],
  render,
  args,
  play: async ({
    args,
    canvasElement,
    step,
  }: {
    args: StoryArgs;
    canvasElement: HTMLElement;
    step: any;
  }) => {
    if (!args.runA11yChecks) return;

    const canvas = within(canvasElement);

    await waitFor(() => expect(getCards(canvasElement).length).toBeGreaterThan(1), {
      timeout: 15000,
    });

    await step('Nav controls are named for screen readers', async () => {
      await expect(canvas.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    await step('Widget is one labelled region wrapping a carousel track', async () => {
      const section = canvasElement.querySelector('section');
      await expect(section).toBeInTheDocument();
      await expect((section?.getAttribute('aria-label') ?? '').trim().length).toBeGreaterThan(0);
      await expect(section?.querySelector('[aria-roledescription="carousel"]')).toBeInTheDocument();
    });

    await step('Every card is a button with a non-empty accessible name', async () => {
      const cards = getCards(canvasElement);
      for (const card of cards) {
        await expect(card.getAttribute('role')).toBe('button');
        await expect((card.getAttribute('aria-label') ?? '').trim().length).toBeGreaterThan(0);
      }
    });

    await step('Roving tabindex — exactly one card is tabbable', async () => {
      const cards = getCards(canvasElement);
      const tabbable = cards.filter((c) => c.tabIndex === 0);
      const roving = cards.filter((c) => c.tabIndex === -1);
      await expect(tabbable.length).toBe(1);
      await expect(roving.length).toBe(cards.length - 1);
    });

    await step('Arrow keys move focus card-to-card (Home/End jump)', async () => {
      const cards = getCards(canvasElement);
      cards[0].focus();
      await expect(cards[0]).toHaveFocus();

      await userEvent.keyboard('{ArrowRight}');
      await expect(cards[1]).toHaveFocus();

      await userEvent.keyboard('{ArrowLeft}');
      await expect(cards[0]).toHaveFocus();

      await userEvent.keyboard('{End}');
      await expect(cards[cards.length - 1]).toHaveFocus();

      await userEvent.keyboard('{Home}');
      await expect(cards[0]).toHaveFocus();
    });

    await step('Enter and Space activate the focused card', async () => {
      // Both click routes end in window.alert — onCardClick here, goToDestination in the
      // decorator — so stubbing it observes activation whichever route is wired.
      const cards = getCards(canvasElement);
      const originalAlert = window.alert;
      let activations = 0;
      window.alert = () => {
        activations += 1;
      };
      try {
        cards[0].focus();
        await userEvent.keyboard('{Enter}');
        await userEvent.keyboard(' ');
      } finally {
        window.alert = originalAlert;
      }
      await expect(activations).toBe(2);
    });

    await step('Tab leaves the widget after the single card stop', async () => {
      getCards(canvasElement)[0].focus();
      await userEvent.tab();
      const section = canvasElement.querySelector('section');
      await expect(section?.contains(document.activeElement)).toBe(false);
    });

    await step('Shift+Tab from the first stop exits the widget — no focus trap', async () => {
      // The first focusable inside the widget is a nav button (if enabled) or the active card.
      // Shift+Tab from there must leave the widget entirely — nothing before it re-captures focus.
      const section = canvasElement.querySelector('section');
      const firstStop = section?.querySelector<HTMLElement>(
        'button:not([disabled]), [tabindex="0"]',
      );
      firstStop?.focus();
      await userEvent.tab({ shift: true });
      await expect(section?.contains(document.activeElement)).toBe(false);
    });

    await step('Inner elements are inert — no stray focus stops', async () => {
      const anchors = canvasElement.querySelectorAll('[data-post-id] a[href]');
      const nativeButtons = canvasElement.querySelectorAll('[data-post-id] button');
      await expect(anchors.length).toBe(0);
      await expect(nativeButtons.length).toBe(0);
    });

    await step('No heading pollution — embed-safe outline', async () => {
      const headings = canvasElement.querySelectorAll(
        'section h1, section h2, section h3, section h4, section h5, section h6',
      );
      await expect(headings.length).toBe(0);
    });

    await step('No nested landmarks leak into the host page', async () => {
      const nested = canvasElement.querySelectorAll(
        'section main, section nav, section aside, section header, section footer, ' +
          'section [role="main"], section [role="navigation"], section [role="banner"]',
      );
      await expect(nested.length).toBe(0);
    });
  },
};
