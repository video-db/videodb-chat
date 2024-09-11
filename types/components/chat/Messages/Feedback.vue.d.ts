declare const _default: import("vue").DefineComponent<{}, {}, {
    feedback: {
        value: number;
        comments: string;
        dislikeOption: {
            isHarmful: boolean;
            isUntrue: boolean;
            isUnhelpful: boolean;
        };
    };
    isSubmitted: boolean;
}, {
    isUpvoted(): boolean;
    isDownvoted(): boolean;
}, {
    handleVote(val: any): void;
    handleFeedbackSubmit(e: any): void;
    resetFeedback(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
export default _default;
