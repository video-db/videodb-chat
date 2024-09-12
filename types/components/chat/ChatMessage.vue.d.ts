declare const _default: import("vue").DefineComponent<{}, {
    userImage: string | Record<string, any>;
    assistantImage: string | Record<string, any>;
    message: Record<string, any>;
    isStaticPage: boolean;
    isLastConv: boolean;
    messageList: unknown[];
    currentIndex: number;
    messageLoading: boolean;
    $props: {
        readonly userImage?: string | Record<string, any> | undefined;
        readonly assistantImage?: string | Record<string, any> | undefined;
        readonly message?: Record<string, any> | undefined;
        readonly isStaticPage?: boolean | undefined;
        readonly isLastConv?: boolean | undefined;
        readonly messageList?: unknown[] | undefined;
        readonly currentIndex?: number | undefined;
        readonly messageLoading?: boolean | undefined;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
