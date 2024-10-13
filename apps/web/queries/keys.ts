export const KEY = {
    CURRENT_USER: ["current user"],
    MY_JOBS: ["my jobs"],
    MY_SUBSCRIPTIONS: ["my subscriptions"],
    PROFILE_PICTURES: ["profile pictures"],
    MY_MEDIA: ["my media"],
    FEED: ["feed"],
    FEED_SUBSCRIPTIONS: ["feed subscriptions"],
    VIDEO: (id: string) => ["video", id],
} as const;
