import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '.';
import { Bell } from '~/v4/core/design/icons/Bell';

const meta: Meta = { title: 'Design System/Atoms/Badge' };
export default meta;

const wrap: React.CSSProperties = {
  minHeight: '100dvh',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  background: 'var(--asc-color-background-default, #fff)',
  color: 'var(--asc-color-base-default, #222)',
};
const row: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};
const lbl: React.CSSProperties = { fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.4rem' };
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <div style={lbl}>{title}</div>
    <div style={row}>{children}</div>
  </div>
);

const glyph = <Bell.Solid />;

export const Label: StoryObj = {
  render: () => (
    <div style={wrap}>
      <Section title="sizes — 14 / 16 / 20 / 24 / 28 / 32">
        {([14, 16, 20, 24, 28, 32] as const).map((s) => (
          <Badge.Label key={s} label="9" size={s} />
        ))}
      </Section>
      <Section title="shape — round / square">
        <Badge.Label label="New" shape="round" />
        <Badge.Label label="New" shape="square" />
      </Section>
      <Section title="fill — filled / ghost, border">
        <Badge.Label label="Filled" fill="filled" />
        <Badge.Label label="Ghost" fill="ghost" border />
      </Section>
      <Section title="preset — general/notification">
        <Badge.Label label="5" preset={{ family: 'general', case: 'notification' }} />
      </Section>
    </div>
  ),
};

export const Icon: StoryObj = {
  render: () => (
    <div style={wrap}>
      <Section title="sizes — 16 / 20 / 24 / 28 / 32">
        {([16, 20, 24, 28, 32] as const).map((s) => (
          <Badge.Icon key={s} icon={glyph} size={s} />
        ))}
      </Section>
      <Section title="preset — userstatus/moderator · chat/mention">
        <Badge.Icon icon={glyph} preset={{ family: 'userstatus', case: 'moderator' }} />
        <Badge.Icon icon={glyph} preset={{ family: 'chat', case: 'mention' }} />
      </Section>
      <Section title="border — indicator ring (on-avatar context)">
        <Badge.Icon
          icon={glyph}
          size={16}
          preset={{ family: 'userstatus', case: 'moderator' }}
          border
        />
        <Badge.Icon icon={glyph} size={16} preset={{ family: 'chat', case: 'private' }} border />
      </Section>
    </div>
  ),
};

export const Semantic: StoryObj = {
  render: () => (
    <div style={wrap}>
      <Section title="general / notification (unread count — alert surface)">
        <Badge.Label label="5" preset={{ family: 'general', case: 'notification' }} />
        <Badge.Label label="99+" preset={{ family: 'general', case: 'notification' }} />
      </Section>
      <Section title="userstatus / moderator (icon)">
        <Badge.Icon icon={glyph} preset={{ family: 'userstatus', case: 'moderator' }} />
      </Section>
      <Section title="chat / mention (icon)">
        <Badge.Icon icon={glyph} preset={{ family: 'chat', case: 'mention' }} />
      </Section>
    </div>
  ),
};
