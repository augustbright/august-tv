export const KEY = {
    CURRENT_USER: ["current user"],
    MY_MEDIA: ["my media"],
    FEED: ["feed"],
    VIDEO: (id: string) => ["video", id],
} as const;
