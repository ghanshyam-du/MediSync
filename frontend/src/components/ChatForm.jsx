import { useRef } from "react"

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef(null)

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const userMessage = inputRef.current.value.trim()
        if (!userMessage) return;
        inputRef.current.value = ""
        
        setChatHistory(history => [...history, { role: "user", text: userMessage }])
        
        setTimeout(() => {
            setChatHistory(history => [...history, { role: "model", text: "Thinking..." }])

            generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
        }, 600)
    }

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input type="text" className="chat-input" placeholder="Type your message here..." ref={inputRef} required />
            <button className="material-symbols-rounded">
                arrow_upward
            </button>
        </form>
    )
}
export default ChatForm
