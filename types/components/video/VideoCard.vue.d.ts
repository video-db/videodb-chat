declare const _default: import("vue").DefineComponent<{
    item: {
        type: ObjectConstructor;
        default: () => void;
    };
    videoId: {
        type: StringConstructor;
        default: string;
    };
    index: {
        type: NumberConstructor;
        default: number;
    };
    isPlaying: {
        type: BooleanConstructor;
        default: boolean;
    };
    borderB: {
        type: BooleanConstructor;
        default: boolean;
    };
    borderClass: {
        type: StringConstructor;
        default: string;
    };
}, any, any, {
    videoLink(): string;
    defaultVideoImage(): "/images/video-card-placeholder.png";
}, {
    secondsToHHMMSS(val: any): string;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    item: {
        type: ObjectConstructor;
        default: () => void;
    };
    videoId: {
        type: StringConstructor;
        default: string;
    };
    index: {
        type: NumberConstructor;
        default: number;
    };
    isPlaying: {
        type: BooleanConstructor;
        default: boolean;
    };
    borderB: {
        type: BooleanConstructor;
        default: boolean;
    };
    borderClass: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    index: number;
    isPlaying: boolean;
    videoId: string;
    item: Record<string, any>;
    borderB: boolean;
    borderClass: string;
}, {}>;
export default _default;
