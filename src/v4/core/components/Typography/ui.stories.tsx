import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Typography from './Typography';

export default {
  title: 'v4/Core/Components/Typography',
  component: Typography,
} as ComponentMeta<typeof Typography>;

const TypographyOverview: React.FC = () => (
  <div>
    <Typography.Heading>Heading</Typography.Heading>
    <Typography.Title>Title</Typography.Title>
    <Typography.Subtitle>Subtitle</Typography.Subtitle>
    <Typography.Body>Body text</Typography.Body>
    <Typography.BodyBold>Bold body text</Typography.BodyBold>
    <Typography.Caption>Caption</Typography.Caption>
    <Typography.CaptionBold>Bold caption</Typography.CaptionBold>
  </div>
);

export const Overview: ComponentStory<typeof TypographyOverview> = () => <TypographyOverview />;

export const Heading: ComponentStory<typeof Typography.Heading> = (args) => (
  <Typography.Heading {...args} />
);
Heading.args = {
  children: 'Heading',
};

export const Title: ComponentStory<typeof Typography.Title> = (args) => (
  <Typography.Title {...args} />
);
Title.args = {
  children: 'Title',
};

export const Subtitle: ComponentStory<typeof Typography.Subtitle> = (args) => (
  <Typography.Subtitle {...args} />
);
Subtitle.args = {
  children: 'Subtitle',
};

export const Body: ComponentStory<typeof Typography.Body> = (args) => <Typography.Body {...args} />;
Body.args = {
  children: 'Body text',
};

export const BodyBold: ComponentStory<typeof Typography.BodyBold> = (args) => (
  <Typography.BodyBold {...args} />
);
BodyBold.args = {
  children: 'Bold body text',
};

export const Caption: ComponentStory<typeof Typography.Caption> = (args) => (
  <Typography.Caption {...args} />
);
Caption.args = {
  children: 'Caption',
};

export const CaptionBold: ComponentStory<typeof Typography.CaptionBold> = (args) => (
  <Typography.CaptionBold {...args} />
);
CaptionBold.args = {
  children: 'Bold caption',
};
