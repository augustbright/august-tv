export declare const GUARD_TAG = "GUARD_TAG";
type TScope = 'public' | 'user' | 'admin';
export declare const Guard: {
    scope: (scope: TScope) => import("@nestjs/common").CustomDecorator<string>;
};
export {};
