declare const _default: import("vue").DefineComponent<{}, {
    $emit: (event: "feedbackSubmit" | "followUpClicked", ...args: any[]) => void;
    userImage: string | Record<string, any>;
    assistantImage: string | Record<string, any>;
    isStaticPage: boolean;
    isLastConv: boolean;
    suggestions: Record<string, any>;
    conversation: Record<string, any>;
    isSameSender: boolean;
    latestUserMsg: string;
    $props: {
        readonly userImage?: string | Record<string, any> | undefined;
        readonly assistantImage?: string | Record<string, any> | undefined;
        readonly isStaticPage?: boolean | undefined;
        readonly isLastConv?: boolean | undefined;
        readonly suggestions?: Record<string, any> | undefined;
        readonly conversation?: Record<string, any> | undefined;
        readonly isSameSender?: boolean | undefined;
        readonly latestUserMsg?: string | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
