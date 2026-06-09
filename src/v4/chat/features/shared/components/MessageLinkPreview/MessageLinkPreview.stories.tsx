import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Meta, StoryObj } from '@storybook/react';
import { MessageLinkPreview } from './MessageLinkPreview';

const URL_SUCCESS = 'https://example.com/success';
const URL_NO_IMAGE = 'https://example.com/no-image';
const URL_FAILURE = 'https://example.com/failure';
const URL_LOADING = 'https://example.com/loading';

type Scenario = 'success' | 'no-image' | 'failure' | 'loading';

function makeClient(scenario: Scenario): QueryClient {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
        // For 'loading' scenario, force useQuery to remain pending forever
        // by overriding the default queryFn with a never-resolving promise.
        queryFn:
          scenario === 'loading'
            ? () => new Promise(() => {}) // never resolves
            : undefined,
      },
    },
  });

  if (scenario === 'success') {
    client.setQueryData(['preview-metadata', URL_SUCCESS], {
      url: URL_SUCCESS,
      domain: 'example.com',
      title: 'Wake up at 5 a.m. every day',
      imageUrl: 'https://picsum.photos/seed/og/200/200',
      timestamp: new Date(),
    });
  }
  if (scenario === 'no-image') {
    client.setQueryData(['preview-metadata', URL_NO_IMAGE], {
      url: URL_NO_IMAGE,
      domain: 'example.com',
      title: 'Article without OG image',
      imageUrl: '',
      timestamp: new Date(),
    });
  }
  if (scenario === 'failure') {
    client.setQueryData(['preview-metadata', URL_FAILURE], {
      url: URL_FAILURE,
      domain: '',
      title: '',
      imageUrl: '',
      timestamp: new Date(),
    });
  }
  return client;
}

function Wrapper({
  scenario,
  isOwnMessage,
  url,
}: {
  scenario: Scenario;
  isOwnMessage: boolean;
  url: string;
}) {
  const client = makeClient(scenario);
  return (
    <QueryClientProvider client={client}>
      <div
        style={{
          width: 228,
          padding: 10,
          borderRadius: 20,
          background: isOwnMessage
            ? 'var(--asc-color-primary-default)'
            : 'var(--asc-color-base-shade4)',
        }}
      >
        <MessageLinkPreview url={url} isOwnMessage={isOwnMessage} />
      </div>
    </QueryClientProvider>
  );
}

const meta: Meta<typeof MessageLinkPreview> = {
  title: 'v4/chat/features/shared/MessageLinkPreview',
  component: MessageLinkPreview,
};
export default meta;

type Story = StoryObj<typeof MessageLinkPreview>;

export const LeftBubbleLoading: Story = {
  render: () => <Wrapper scenario="loading" isOwnMessage={false} url={URL_LOADING} />,
};

export const LeftBubbleSuccessWithImage: Story = {
  render: () => <Wrapper scenario="success" isOwnMessage={false} url={URL_SUCCESS} />,
};

export const LeftBubbleSuccessNoImage: Story = {
  render: () => <Wrapper scenario="no-image" isOwnMessage={false} url={URL_NO_IMAGE} />,
};

export const LeftBubbleFailure: Story = {
  render: () => <Wrapper scenario="failure" isOwnMessage={false} url={URL_FAILURE} />,
};

export const RightBubbleLoading: Story = {
  render: () => <Wrapper scenario="loading" isOwnMessage url={URL_LOADING} />,
};

export const RightBubbleSuccessWithImage: Story = {
  render: () => <Wrapper scenario="success" isOwnMessage url={URL_SUCCESS} />,
};

export const RightBubbleSuccessNoImage: Story = {
  render: () => <Wrapper scenario="no-image" isOwnMessage url={URL_NO_IMAGE} />,
};

export const RightBubbleFailure: Story = {
  render: () => <Wrapper scenario="failure" isOwnMessage url={URL_FAILURE} />,
};
