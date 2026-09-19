export type ChatMessage = {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
}

export type ChatConversation = {
  id: string
  jobId?: string
  jobTitle?: string
  participants: Array<{
    id: string
    name: string
  }>
  messages: ChatMessage[]
  updatedAt: string
}

const CONVERSATIONS_STORAGE_KEY = 'bingo-chat-conversations'

function safeReadConversations(): ChatConversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as ChatConversation[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistConversations(conversations: ChatConversation[]) {
  localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations))
}

function normalizeConversation(conversation: ChatConversation): ChatConversation {
  return {
    id: conversation.id,
    jobId: conversation.jobId,
    jobTitle: conversation.jobTitle,
    participants: Array.isArray(conversation.participants) ? conversation.participants : [],
    messages: Array.isArray(conversation.messages) ? conversation.messages : [],
    updatedAt: conversation.updatedAt ?? new Date().toISOString(),
  }
}

export function readConversations(): ChatConversation[] {
  return safeReadConversations()
    .map(normalizeConversation)
    .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
}

export function createOrOpenConversation({
  jobId,
  jobTitle,
  employerId,
  employerName,
  currentUserId,
  currentUserName,
  initialText,
}: {
  jobId?: string
  jobTitle?: string
  employerId: string
  employerName: string
  currentUserId: string
  currentUserName: string
  initialText: string
}) {
  const conversations = readConversations()
  const participantIds = [currentUserId, employerId].sort()

  let existingConversation = conversations.find((conversation) => {
    if (jobId && conversation.jobId === jobId) {
      return true
    }

    const conversationParticipantIds = conversation.participants
      .map((participant) => participant.id)
      .sort()

    return conversationParticipantIds.length === participantIds.length && conversationParticipantIds.every((id, index) => id === participantIds[index])
  })

  if (!existingConversation) {
    existingConversation = {
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      jobId,
      jobTitle,
      participants: [
        { id: currentUserId, name: currentUserName },
        { id: employerId, name: employerName },
      ],
      messages: [],
      updatedAt: new Date().toISOString(),
    }
    conversations.unshift(existingConversation)
  }

  const messageToAdd: ChatMessage = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    senderId: currentUserId,
    senderName: currentUserName,
    text: initialText,
    createdAt: new Date().toISOString(),
  }

  existingConversation.messages = [...(existingConversation.messages ?? []), messageToAdd]
  existingConversation.updatedAt = new Date().toISOString()
  existingConversation.jobTitle = jobTitle ?? existingConversation.jobTitle
  existingConversation.jobId = jobId ?? existingConversation.jobId

  const nextConversations = conversations.filter((conversation) => conversation.id !== existingConversation?.id)
  nextConversations.unshift(existingConversation)
  persistConversations(nextConversations)

  return existingConversation.id
}

export function addMessageToConversation(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string,
) {
  const conversations = readConversations()
  const conversation = conversations.find((item) => item.id === conversationId)

  if (!conversation) return null

  const message: ChatMessage = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    senderId,
    senderName,
    text,
    createdAt: new Date().toISOString(),
  }

  conversation.messages = [...conversation.messages, message]
  conversation.updatedAt = new Date().toISOString()

  persistConversations(
    conversations
      .filter((item) => item.id !== conversationId)
      .concat(conversation)
      .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()),
  )

  return conversation
}

export function getParticipantName(conversation: ChatConversation, currentUserId: string) {
  return conversation.participants.find((participant) => participant.id !== currentUserId)?.name ?? 'Conversation'
}
