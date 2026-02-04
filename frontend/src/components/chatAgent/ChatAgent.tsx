import { useState, useRef, useEffect } from 'react'
import { chatService, type ChatTurn } from '../../services/chatService'

interface ChatAgentProps {
  className?: string
}

export const ChatAgent = ({ className = '' }: ChatAgentProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [available, setAvailable] = useState(false)
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const checkStatus = () => {
    chatService
      .getStatus()
      .then((res) => {
        setAvailable(res.data?.available ?? false)
        setStatusHint(res.data?.hint ?? null)
      })
      .catch(() => {
        setAvailable(false)
        setStatusHint('Cannot reach backend. Is the API running at ' + (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '?')
      })
  }

  useEffect(() => {
    checkStatus()
  }, [])

  useEffect(() => {
    if (isOpen) checkStatus()
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading || !available) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)

    try {
      const history = messages.length > 0 ? messages : undefined
      const res = await chatService.sendMessage({
        message: text,
        history: history?.length ? history : undefined,
      })
      const reply = res.data?.reply ?? 'No response.'
      setMessages((prev) => [...prev, { role: 'model', text: reply }])
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string }; status?: number } }).response?.data?.error
          ?? (err as { response?: { status?: number } }).response?.status === 503
            ? 'Chat agent is not available. Please try again later.'
            : 'Failed to send message. Please try again.'
        : 'Failed to send message. Please try again.'
      setError(msg)
      setMessages((prev) => prev.filter((m) => m.role !== 'user' || m.text !== text))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={`fixed bottom-0 right-0 md:bottom-6 md:right-72 z-50 ${className}`}
      style={{ maxWidth: '400px' }}
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 p-3 md:p-4 hover:scale-110 transition-all duration-300 flex items-center gap-2 md:gap-3 group"
          aria-label="Open chat"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-semibold text-sm">Chat Agent</p>
            <p className="text-xs opacity-90">Ask about properties</p>
          </div>
          <svg
            className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Real Estate Agent</h3>
                <p className="text-xs opacity-90">
                  {available ? 'Powered by Gemini' : 'Unavailable'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[50vh]">
            {messages.length === 0 && available && (
              <p className="text-sm text-gray-500 text-center py-4">
                สวัสดีครับ ผมเป็น AI ตัวช่วยด้านอสังหาถามได้เลย เช่น หาคอนโด 2 ห้องนอนย่านสุขุมวิท
              </p>
            )}
            {messages.length === 0 && !available && (
              <div className="text-center py-4 space-y-2">
                <p className="text-sm text-amber-700 font-medium">Chat Agent ยังไม่พร้อมใช้งาน</p>
                {statusHint && (
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">{statusHint}</p>
                )}
                <button
                  type="button"
                  onClick={checkStatus}
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  เช็คอีกครั้ง
                </button>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <span className="whitespace-pre-wrap break-words">{m.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-pulse">...</span>
                  </span>
                </div>
              </div>
            )}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={available ? 'Type a message...' : 'Chat is unavailable'}
                disabled={!available || loading}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!available || loading || !input.trim()}
                className="bg-indigo-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatAgent
