declare const _default: import("vue").DefineComponent<{
    message: {
        type: ObjectConstructor;
        required: true;
    };
    latestUserMsg: {
        type: StringConstructor;
        default: string;
    };
    channelName: {
        type: StringConstructor;
        default: string;
    };
}, any, any, {
    isContractable(): any;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    message: {
        type: ObjectConstructor;
        required: true;
    };
    latestUserMsg: {
        type: StringConstructor;
        default: string;
    };
    channelName: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    latestUserMsg: string;
    channelName: string;
}, {}>;
export default _default;
