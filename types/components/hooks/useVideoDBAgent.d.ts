export function useVideoDBAgent(config: any): {
    conversations: {};
    chatLoading: import("vue").ComputedRef<boolean>;
    addMessage: (message: any) => void;
    bindEvents: (events: any, emit: any) => void;
    isConnected: import("vue").Ref<boolean>;
    sessionId: import("vue").Ref<any>;
    videoId: import("vue").Ref<any>;
    collectionId: import("vue").Ref<any>;
};
