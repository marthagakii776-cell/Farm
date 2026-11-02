import React, { useState } from 'react';
import { Message, User } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { MessageSquare, Send, User as UserIcon, Phone, MapPin, CheckCheck, Clock } from 'lucide-react';

interface MessagingCenterProps {
  messages: Message[];
  onSendMessage: (msg: Partial<Message>) => Promise<void>;
}

export const MessagingCenter: React.FC<MessagingCenterProps> = ({
  messages,
  onSendMessage,
}) => {
  const { currentUser, allDemoUsers } = useAuth();
  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    // Find the first conversation partner that is not currentUser
    const partnerMsg = messages.find(
      (m) => m.senderId !== currentUser?.id || m.receiverId !== currentUser?.id
    );
    if (!partnerMsg) return allDemoUsers[0].id;
    return partnerMsg.senderId === currentUser?.id ? partnerMsg.receiverId : partnerMsg.senderId;
  });

  const [newMsgText, setNewMsgText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Group messages into conversations
  const conversationsMap = new Map<string, { partner: User; lastMessage: Message }>();

  messages.forEach((msg) => {
    const isSender = msg.senderId === currentUser?.id;
    const partnerId = isSender ? msg.receiverId : msg.senderId;
    const partnerName = isSender ? msg.receiverName : msg.senderName;
    const partnerRole = isSender ? msg.receiverRole : msg.senderRole;

    if (!conversationsMap.has(partnerId)) {
      const knownUser = allDemoUsers.find((u) => u.id === partnerId);
      conversationsMap.set(partnerId, {
        partner: knownUser || {
          id: partnerId,
          name: partnerName,
          role: partnerRole,
          email: '',
          phone: '+254 700 000 000',
          location: 'Kenya',
          createdAt: '',
        },
        lastMessage: msg,
      });
    }
  });

  // Ensure other demo users are selectable even if no prior message
  allDemoUsers.forEach((u) => {
    if (u.id !== currentUser?.id && !conversationsMap.has(u.id)) {
      conversationsMap.set(u.id, {
        partner: u,
        lastMessage: {
          id: `init_${u.id}`,
          senderId: u.id,
          senderName: u.name,
          senderRole: u.role,
          receiverId: currentUser?.id || '',
          receiverName: currentUser?.name || '',
          receiverRole: currentUser?.role || 'farmer',
          content: `Start a direct trade conversation with ${u.name}...`,
          timestamp: new Date().toISOString(),
          read: true,
        },
      });
    }
  });

  const conversationsList = Array.from(conversationsMap.values());
  const activePartner =
    allDemoUsers.find((u) => u.id === activePartnerId) ||
    conversationsMap.get(activePartnerId)?.partner;

  // Active chat thread
  const activeMessages = messages
    .filter(
      (m) =>
        (m.senderId === currentUser?.id && m.receiverId === activePartnerId) ||
        (m.senderId === activePartnerId && m.receiverId === currentUser?.id)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !currentUser || !activePartner) return;
    setIsSending(true);

    try {
      await onSendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        receiverId: activePartner.id,
        receiverName: activePartner.name,
        receiverRole: activePartner.role,
        content: newMsgText.trim(),
      });
      setNewMsgText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          Direct Inquiries & Order Discussions
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-emerald-950">
          Farmer & Buyer Communications
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Coordinate consignments, confirm farm-gate pickup schedules, and consult agricultural experts directly.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
        {/* Left Col: Conversations Sidebar */}
        <div className="border-r border-stone-200 flex flex-col h-full bg-stone-50/50">
          <div className="p-4 border-b border-stone-200 bg-white">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Conversations ({conversationsList.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
            {conversationsList.map(({ partner, lastMessage }) => {
              const isSelected = partner.id === activePartnerId;
              return (
                <button
                  key={partner.id}
                  onClick={() => setActivePartnerId(partner.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-emerald-50/70 border-r-2 border-emerald-800' : 'hover:bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                    {partner.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {partner.name}
                      </span>
                      <span className="text-[10px] text-stone-400 capitalize">
                        {partner.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Chat View */}
        <div className="md:col-span-2 flex flex-col h-full">
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm uppercase">
                    {activePartner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      {activePartner.name}
                      <span className="text-[10px] font-normal text-stone-500 capitalize px-2 py-0.5 bg-stone-100 rounded">
                        {activePartner.role}
                      </span>
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {activePartner.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {activePartner.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-stone-50/30">
                {activeMessages.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    No messages yet with {activePartner.name}. Start the conversation below!
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        {msg.productTitle && (
                          <div className="mb-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Re: {msg.productTitle}
                          </div>
                        )}
                        <div
                          className={`max-w-md p-3.5 rounded-xl text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-emerald-800 text-white rounded-br-none'
                              : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-emerald-700" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder={`Write a message to ${activePartner.name}...`}
                  className="flex-1 px-4 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  type="submit"
                  disabled={!newMsgText.trim() || isSending}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-stone-400">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
