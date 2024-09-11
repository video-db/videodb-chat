declare const _default: import("vue").DefineComponent<{
    message: {
        type: ObjectConstructor;
        required: true;
    };
    isUser: {
        type: BooleanConstructor;
        default: boolean;
    };
    hasRelevantMoments: {
        type: BooleanConstructor;
        default: boolean;
    };
    mediaTypesObject: {
        type: ObjectConstructor;
        default: () => {};
    };
}, any, {
    isCopied: boolean;
    isExpanded: boolean;
}, {
    isMainResponse(): any;
    isExpandable(): any;
    showReadMore(): any;
    text(): any;
    isErrored(): boolean;
    showMarkdown(): any;
    headingText(): "Your response is ready. Here you go!";
    containerMaxHeight(): "max-h-288" | "max-h-182";
}, {
    getMarkedMsg(msg: any): any;
    onCopy(): void;
    setExpanded(val: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    message: {
        type: ObjectConstructor;
        required: true;
    };
    isUser: {
        type: BooleanConstructor;
        default: boolean;
    };
    hasRelevantMoments: {
        type: BooleanConstructor;
        default: boolean;
    };
    mediaTypesObject: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    isUser: boolean;
    hasRelevantMoments: boolean;
    mediaTypesObject: Record<string, any>;
}, {}>;
export default _default;
