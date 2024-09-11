declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & (new () => {
    $slots: S;
});
declare const __VLS_component: import("vue").DefineComponent<{}, {
    playing: any;
    volume: any;
    videoMuted: any;
    duration: any;
    time: any;
    percentagePlayed: any;
    playBackRate: any;
    isFullScreen: import("vue").Ref<boolean>;
    play: any;
    pause: any;
    togglePlay: any;
    toggleMute: any;
    seekTo: any;
    seekToPercentage: any;
    setPlayBackRate: any;
    setVolume: any;
    convertTimeToDuration: any;
    enterFullScreen: () => Promise<void>;
    exitFullScreen: () => Promise<void>;
    togglePictureInPicture: any;
    $emit: (event: "playing" | "play" | "pause" | "ended" | "loadeddata" | "waiting" | "timeupdate" | "canplay" | "canplaythrough", ...args: any[]) => void;
    startAt: number;
    autoPlay: boolean;
    defaultPlayBackRate: number;
    videoDetails: Record<string, any>;
    autoHideDuration?: number | undefined;
    $props: {
        readonly startAt?: number | undefined;
        readonly autoPlay?: boolean | undefined;
        readonly defaultPlayBackRate?: number | undefined;
        readonly videoDetails?: Record<string, any> | undefined;
        readonly autoHideDuration?: number | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
declare function __VLS_template(): {
    overlay?(_: {}): any;
    controls?(_: {}): any;
};
