declare const _default: import("vue").DefineComponent<{}, {
    $emit: (event: "feedbackSubmit", ...args: any[]) => void;
    message: Record<string, any>;
    userImage: string | Record<string, any>;
    assistantImage: string | Record<string, any>;
    isStaticPage: boolean;
    isLastConv: boolean;
    messageList: unknown[];
    currentIndex: number;
    messageLoading: boolean;
    suggestions: Record<string, any>;
    $props: {
        readonly message?: Record<string, any> | undefined;
        readonly userImage?: string | Record<string, any> | undefined;
        readonly assistantImage?: string | Record<string, any> | undefined;
        readonly isStaticPage?: boolean | undefined;
        readonly isLastConv?: boolean | undefined;
        readonly messageList?: unknown[] | undefined;
        readonly currentIndex?: number | undefined;
        readonly messageLoading?: boolean | undefined;
        readonly suggestions?: Record<string, any> | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
