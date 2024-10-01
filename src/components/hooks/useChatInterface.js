import { ref, reactive } from "vue";


export function useChatInterface() {
    const messageHandlers = reactive({})
    const chatInput = ref("");

    const registerMessageHandler = (agentName, handler) => {
        if (!messageHandlers[agentName]) {
            messageHandlers[agentName] = []
        }
        messageHandlers[agentName].push(handler)
    }


    const setChatInput = (input) => {
        chatInput.value = input
    }

    return {
        chatInput,
        setChatInput,
        messageHandlers,
        registerMessageHandler,
    };
}
