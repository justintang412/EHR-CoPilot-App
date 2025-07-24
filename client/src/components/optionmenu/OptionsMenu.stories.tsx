import OptionsMenu from './OptionsMenu';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryConfig } from '@/lib/react-query';
import { MemoryRouter } from 'react-router-dom';

// Mocks matching the shape of UseQueryResult and UseMutationResult
const mockUseUser = () => {
  const result = {
    data: {
      id: 'user-1',
      createdAt: Date.now(),
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'USER' as const,
      teamId: 'team-1',
      bio: '',
    },
    isLoading: false as false,
    isError: false as false,
    isSuccess: true,
    isPending: false as false,
    error: null,
    refetch: () => Promise.resolve(result as any),
    status: 'success',
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    fetchStatus: 'idle',
    promise: Promise.resolve({
      id: 'user-1',
      createdAt: Date.now(),
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'USER' as const,
      teamId: 'team-1',
      bio: '',
    }),
    errorUpdateCount: 0,
  } as const;
  return result;
};

const mockUseLogout = () => ({
  mutate: () => {},
  mutateAsync: async () => {},
  isLoading: false,
  isError: false as false,
  isSuccess: true,
  isIdle: false,
  isPending: false as false,
  isPaused: false,
  submittedAt: 0,
  data: undefined,
  error: null,
  reset: () => {},
  status: 'success',
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
} as const);

const meta: Meta<typeof OptionsMenu> = {
  title: 'Components/OptionMenu/OptionsMenu',
  component: OptionsMenu,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: queryConfig,
      });
      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof OptionsMenu>;

export const Default: Story = {
  render: () => (
    <OptionsMenu useUserHook={mockUseUser} useLogoutHook={mockUseLogout} />
  ),
}; 