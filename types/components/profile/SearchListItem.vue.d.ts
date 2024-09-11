declare const _default: import("vue").DefineComponent<{
    searchResults: {
        type: ObjectConstructor;
        default: () => void;
    };
    searchTerm: {
        type: StringConstructor;
        default: () => void;
    };
    isContractable: {
        type: BooleanConstructor;
        default: boolean;
    };
    channelName: {
        type: StringConstructor;
        default: string;
    };
}, any, {
    activeVideoId: string;
    playBackTime: number;
    isPlaying: boolean;
    isExpanded: boolean;
}, {}, {
    getFormattedSearchResult(searchResults: any): {
        _shards: {};
        hits: {
            hits: any;
            max_score: any;
            total: null;
        };
        timed_out: null;
        took: null;
    };
    getDuration(searchResult: any): any;
    onSlideClick({ value, videoId }: {
        value: any;
        videoId: any;
    }): void;
    togglePlay(videoId: any, forcePlay?: boolean): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    searchResults: {
        type: ObjectConstructor;
        default: () => void;
    };
    searchTerm: {
        type: StringConstructor;
        default: () => void;
    };
    isContractable: {
        type: BooleanConstructor;
        default: boolean;
    };
    channelName: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    searchResults: Record<string, any>;
    searchTerm: string;
    isContractable: boolean;
    channelName: string;
}, {}>;
export default _default;
