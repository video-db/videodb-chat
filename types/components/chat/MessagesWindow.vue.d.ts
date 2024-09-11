declare const _default: import("vue").DefineComponent<{}, {
    $emit: (event: "followUpClicked" | "feedbackSubmit", ...args: any[]) => void;
    channelName: string;
    latestUserMsg: string;
    channelImg: string;
    isStaticPage: boolean;
    sessionId: string;
    searchSuggestions: unknown[];
    channelId: string;
    messageRecord: Record<string, any>;
    isChannelPublic: boolean;
    $props: {
        readonly channelName?: string | undefined;
        readonly latestUserMsg?: string | undefined;
        readonly channelImg?: string | undefined;
        readonly isStaticPage?: boolean | undefined;
        readonly sessionId?: string | undefined;
        readonly searchSuggestions?: unknown[] | undefined;
        readonly channelId?: string | undefined;
        readonly messageRecord?: Record<string, any> | undefined;
        readonly isChannelPublic?: boolean | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
