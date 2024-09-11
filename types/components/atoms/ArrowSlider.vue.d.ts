declare const _default: import("vue").DefineComponent<{
    containerClass: {
        type: StringConstructor;
        default: string;
    };
    contentRendered: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, {
    showScroll: string;
    isScrollNeeded: boolean;
}, {}, {
    setUpScrollListener(): void;
    scrollList(type: any): void;
    getClosestElement(childNodes: any, parentNode: any): any;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    containerClass: {
        type: StringConstructor;
        default: string;
    };
    contentRendered: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    contentRendered: boolean;
    containerClass: string;
}, {}>;
export default _default;
