import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, MessageSquareText, SendHorizontal } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addMessageToConversation, getParticipantName, readConversations, type ChatConversation } from '../../services/messaging'
import { useAuthStore } from '../../stores/authstore'
import './MessagesPage.css'

function MessagesPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/signin', { replace: true })
      return
    }

    const nextConversations = readConversations().filter((conversation) =>
      conversation.participants.some((participant) => participant.id === user.id),
    )

    setConversations(nextConversations)
  }, [user, navigate])

  const selectedConversationId = conversationId ?? conversations[0]?.id ?? null
  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  )

  function refreshConversations() {
    if (!user) return

    const nextConversations = readConversations().filter((conversation) =>
      conversation.participants.some((participant) => participant.id === user.id),
    )
    setConversations(nextConversations)
  }

  function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user || !selectedConversation || !draft.trim()) return

    addMessageToConversation(selectedConversation.id, user.id, user.username, draft.trim())
    setDraft('')
    refreshConversations()
  }

  if (!user) {
    return null
  }

  return (
    <main className="messages-page">
      <div className="messages-shell">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-header">
            <Link to="/news" className="messages-back-link" aria-label="Back to news feed">
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back</span>
            </Link>
            <h1>Inbox</h1>
          </div>

          {conversations.length === 0 ? (
            <div className="messages-empty-state">
              <MessageSquareText size={28} aria-hidden="true" />
              <p>No chats yet.</p>
              <span>When someone shows interest in your job, the conversation will appear here.</span>
            </div>
          ) : (
            <div className="messages-list" role="list">
              {conversations.map((conversation) => {
                const lastMessage = conversation.messages[conversation.messages.length - 1]

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`conversation-item ${conversation.id === selectedConversationId ? 'selected' : ''}`}
                    onClick={() => navigate(`/messages/${conversation.id}`)}
                  >
                    <span className="conversation-avatar">
                      {getParticipantName(conversation, user.id).slice(0, 1).toUpperCase()}
                    </span>
                    <span className="conversation-copy">
                      <strong>{conversation.jobTitle ?? getParticipantName(conversation, user.id)}</strong>
                      <small>{lastMessage ? lastMessage.text : 'Start the conversation'}</small>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </aside>

        <section className="messages-thread">
          {selectedConversation ? (
            <>
              <header className="thread-header">
                <div>
                  <p className="thread-label">Job chat</p>
                  <h2>{selectedConversation.jobTitle ?? 'Direct message'}</h2>
                </div>
                <span className="thread-participant">{getParticipantName(selectedConversation, user.id)}</span>
              </header>

              <div className="message-list" aria-live="polite">
                {selectedConversation.messages.map((message) => {
                  const isCurrentUser = message.senderId === user.id

                  return (
                    <div key={message.id} className={`message-row ${isCurrentUser ? 'self' : 'other'}`}>
                      <div className="message-bubble">
                        <span className="message-author">{isCurrentUser ? 'You' : message.senderName}</span>
                        <p>{message.text}</p>
                        <time>{new Date(message.createdAt).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
                      </div>
                    </div>
                  )
                })}
              </div>

              <form className="message-composer" onSubmit={handleSendMessage}>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                  placeholder="Write a message..."
                  aria-label="Write a message"
                />
                <button type="submit" className="send-button" disabled={!draft.trim()}>
                  <SendHorizontal size={17} aria-hidden="true" />
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="messages-empty-thread">
              <h2>Pick a conversation</h2>
              <p>Select a job chat from the left panel to continue the discussion.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default MessagesPage
