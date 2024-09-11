declare const _default: import("vue").DefineComponent<{}, {
    $emit: (event: "feedbackSubmit", ...args: any[]) => void;
    userImage: string | Record<string, any>;
    assistantImage: string | Record<string, any>;
    latestUserMsg: string;
    conversation: Record<string, any>;
    isStaticPage: boolean;
    isLastConv: boolean;
    $props: {
        readonly userImage?: string | Record<string, any> | undefined;
        readonly assistantImage?: string | Record<string, any> | undefined;
        readonly latestUserMsg?: string | undefined;
        readonly conversation?: Record<string, any> | undefined;
        readonly isStaticPage?: boolean | undefined;
        readonly isLastConv?: boolean | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
