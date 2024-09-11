declare const _default: import("vue").DefineComponent<{
    textToCopy: {
        type: StringConstructor;
        required: true;
    };
    successMessage: {
        type: StringConstructor;
        default: string;
    };
    initialMessage: {
        type: StringConstructor;
        default: string;
    };
    baseClass: {
        type: StringConstructor;
        default: string;
    };
}, any, {
    isTextCopied: boolean;
}, {}, {
    copyText(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    textToCopy: {
        type: StringConstructor;
        required: true;
    };
    successMessage: {
        type: StringConstructor;
        default: string;
    };
    initialMessage: {
        type: StringConstructor;
        default: string;
    };
    baseClass: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    successMessage: string;
    initialMessage: string;
    baseClass: string;
}, {}>;
export default _default;
