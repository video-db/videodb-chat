import { reactive } from "vue";


export function useChatInterface() {
    const messageHandlers = reactive({})
    const registerMessageHandler = (agentName, handler) => {
        if (!messageHandlers[agentName]) {
            messageHandlers[agentName] = []
        }
        messageHandlers[agentName].push(handler)
    }


    return {
        messageHandlers,
        registerMessageHandler,
    };
}
