export function useVideoDBAgent(sessionId: any): {
    events: string[];
    conversations: {};
    messageLoading: import("vue").ComputedRef<boolean>;
    messageHandlers: {};
    registerMessageHandler: (agentName: any, handler: any) => void;
    addMessage: (message: any) => void;
    bindEvents: (events: any, emit: any) => void;
    isConnected: import("vue").Ref<boolean>;
    sessionId: import("vue").Ref<any>;
};
