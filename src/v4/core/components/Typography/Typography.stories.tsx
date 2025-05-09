import React from 'react';
import { Typography } from './Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Typography> = {
  tags: ['autodocs'],
  component: Typography,
  parameters: { layout: 'centered' },
  title: 'V4/core/components/TypographyV4',
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
      <Typography.Headline>Headline</Typography.Headline>
      <Typography.TitleBold>TitleBold</Typography.TitleBold>
      <Typography.Title>Title</Typography.Title>
      <Typography.BodyBold>BodyBold</Typography.BodyBold>
      <Typography.Body>Body</Typography.Body>
      <Typography.CaptionBold>CaptionBold</Typography.CaptionBold>
      <Typography.Caption>Caption</Typography.Caption>
      <Typography.CaptionSmall>CaptionSmall</Typography.CaptionSmall>
    </div>
  ),
};

export const Headline: Story = {
  render: () => <Typography.Headline>Headline</Typography.Headline>,
};

export const TitleBold: Story = {
  render: () => <Typography.TitleBold>TitleBold</Typography.TitleBold>,
};

export const Title: Story = {
  render: () => <Typography.Title>Title</Typography.Title>,
};

export const BodyBold: Story = {
  render: () => <Typography.BodyBold>BodyBold</Typography.BodyBold>,
};

export const Body: Story = {
  render: () => <Typography.Body>Body</Typography.Body>,
};

export const CaptionBold: Story = {
  render: () => <Typography.CaptionBold>CaptionBold</Typography.CaptionBold>,
};

export const Caption: Story = {
  render: () => <Typography.Caption>Caption</Typography.Caption>,
};

export const CaptionSmall: Story = {
  render: () => <Typography.CaptionSmall>CaptionSmall</Typography.CaptionSmall>,
};
