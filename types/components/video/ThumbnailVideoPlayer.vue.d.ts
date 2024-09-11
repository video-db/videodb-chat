declare const _default: import("vue").DefineComponent<{
    item: {
        type: ObjectConstructor;
        default: () => void;
    };
    isActive: {
        type: BooleanConstructor;
        default: boolean;
    };
    videoId: {
        type: StringConstructor;
        default: string;
    };
    volume: {
        type: NumberConstructor;
        default: number;
    };
    playBackTime: {
        type: NumberConstructor;
        default: number;
    };
    isPlaying: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, {
    player: null;
    isVideoLoading: boolean;
    videoDetails: {};
    showRealtimePlayer: boolean;
}, {
    videoLink(): string;
}, {
    getVideoDetails(): Promise<void>;
    loadVideo(): void;
    updateTime(time?: number): void;
    openLinkInNewTab(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    item: {
        type: ObjectConstructor;
        default: () => void;
    };
    isActive: {
        type: BooleanConstructor;
        default: boolean;
    };
    videoId: {
        type: StringConstructor;
        default: string;
    };
    volume: {
        type: NumberConstructor;
        default: number;
    };
    playBackTime: {
        type: NumberConstructor;
        default: number;
    };
    isPlaying: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    volume: number;
    isActive: boolean;
    isPlaying: boolean;
    videoId: string;
    item: Record<string, any>;
    playBackTime: number;
}, {}>;
export default _default;
