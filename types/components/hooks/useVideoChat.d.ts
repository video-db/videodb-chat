export function useSession(sessionId: any): {
    events: string[];
    messages: import("vue").Reactive<never[]>;
    conversations: {};
    addMessage: (message: any) => void;
    bindEvents: (events: any, emit: any) => void;
    isConnected: import("vue").Ref<boolean>;
    updateMessage: import("vue").Ref<number>;
};
