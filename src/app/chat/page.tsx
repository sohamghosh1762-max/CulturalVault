"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputUploadButton,
} from "@/components/ai-elements/prompt-input";
import { Action, Actions } from "@/components/ai-elements/actions";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon, Mic, MicOff, Plus, MessageSquare, Trash2 } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
// Real local storage helpers to manage chat session history
const generateId = () => Math.random().toString(36).substring(2, 9);
const useAuth = () => ({ user: { name: "Guest" } });
type RiskLevel = "high" | "low";
const recordChatMessage = (...args: any[]) => {};

const saveLocalSession = (id: string, messages: any[]) => {
  if (typeof window === "undefined" || !messages || messages.length === 0) return;
  localStorage.setItem(`cultural_vault_chat_${id}`, JSON.stringify(messages));
  
  const rawSessions = localStorage.getItem("cultural_vault_sessions");
  let sessions: any[] = rawSessions ? JSON.parse(rawSessions) : [];
  
  const existingIndex = sessions.findIndex((s) => s.id === id);
  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  
  if (existingIndex > -1) {
    sessions[existingIndex].timestamp = Date.now();
  } else {
    sessions.unshift({
      id,
      title: `Chat ${dateStr}`,
      date: dateStr,
      timestamp: Date.now(),
    });
  }
  localStorage.setItem("cultural_vault_sessions", JSON.stringify(sessions));
};

const loadLocalSession = (id: string): any[] | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(`cultural_vault_chat_${id}`);
  return data ? JSON.parse(data) : null;
};

const getLocalSessions = (): any[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("cultural_vault_sessions");
  return raw ? JSON.parse(raw) : [];
};

const deleteLocalSession = (id: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`cultural_vault_chat_${id}`);
  
  const rawSessions = localStorage.getItem("cultural_vault_sessions");
  if (rawSessions) {
    let sessions: any[] = JSON.parse(rawSessions);
    sessions = sessions.filter((s) => s.id !== id);
    localStorage.setItem("cultural_vault_sessions", JSON.stringify(sessions));
  }
};
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";

const AIChatContent = ({ chatId }: { chatId: string }) => {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const queryId = searchParams.get("id");

  const { messages, sendMessage, status, setMessages } = useChat({
    id: chatId,
  });

  const [sessionsList, setSessionsList] = useState<any[]>([]);

  useEffect(() => {
    setSessionsList(getLocalSessions());
  }, [messages]);

  const { user } = useAuth();

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteLocalSession(id);
    setSessionsList(getLocalSessions());
    if (chatId === id) {
      router.push("/chat");
    }
  };

  useEffect(() => {
    const saved = loadLocalSession(chatId);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setMessages(saved);
    } else {
      setMessages([]);
    }
  }, [chatId, setMessages]);

  // Persist aggressively on message change
  useEffect(() => {
    if (messages.length > 0) {
      saveLocalSession(chatId, messages);
    }
  }, [messages, chatId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => prev ? prev + " " + transcript : transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        const langMap: Record<string, string> = { "English": "en-US", "Spanish": "es-ES", "Hindi": "hi-IN", "Bengali": "bn-IN", "French": "fr-FR", "Arabic": "ar-SA" };
        recognitionRef.current.lang = langMap[language] || "en-US";
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }
  };

  const classifyRisk = (text: string): RiskLevel => {
    const value = text.toLowerCase();
    if (
      value.includes("chest pain") ||
      value.includes("breathing") ||
      value.includes("unconscious") ||
      value.includes("stroke") ||
      value.includes("heavy bleeding") ||
      value.includes("suicidal")
    ) {
      return "high";
    }
    return "low";
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const value = (message.text ?? input).trim();
    if (!value && (!message.files || message.files.length === 0)) return;
    
    const parts: any[] = [{ type: 'text', text: value }];
    
    if (message.files && message.files.length > 0) {
      for (const file of message.files) {
        if (file.url) {
          try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            parts.push({ 
              type: 'file', 
              url: dataUrl,
              mediaType: file.mediaType || 'image/jpeg',
              filename: file.filename || 'image.jpg'
            });
          } catch (e) {}
        }
      }
    }

    try {
      recordChatMessage(user, chatId, value, value, classifyRisk(value));
    } catch (e) {}
    
    if (language !== "English") {
      parts[0].text = `[Important: You must respond in the ${language} language.]\n\n${value || "Hello"}`;
    }
    
    // @ts-ignore
    sendMessage({ role: 'user', parts });
    setInput("");
    
    // Auto update URL if started new chat without refresh
    if (!queryId) {
      router.replace(`/chat?id=${chatId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-6 relative flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
      {/* Left Column: Conversation History Sidebar */}
      <div className="w-full md:w-80 flex flex-col border border-border bg-card rounded-3xl p-4 shrink-0 overflow-y-auto max-h-[300px] md:max-h-full">
        <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Conversations
        </h3>
        <div className="flex flex-col gap-2">
          {sessionsList.map((session) => {
            const isActive = session.id === chatId;
            return (
              <div
                key={session.id}
                onClick={() => router.push(`/chat?id=${session.id}`)}
                className={`group w-full flex items-center justify-between p-3 rounded-2xl transition-colors text-left cursor-pointer ${
                  isActive
                    ? "bg-[#e6f4ea] text-[#137333] dark:bg-[#137333]/20 dark:text-[#81c995]"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <MessageSquare className={`size-5 mt-0.5 shrink-0 ${isActive ? "text-[#137333] dark:text-[#81c995]" : "text-muted-foreground"}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate">{session.title}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{session.date}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                  title="Delete conversation"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
          {sessionsList.length === 0 && (
            <div className="text-sm text-muted-foreground p-3 text-center">
              No previous chats
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Active Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full border border-border bg-card rounded-3xl p-4 relative">
        <div className="flex items-center justify-between mb-4 bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm z-10 shrink-0 border border-border">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] h-9 bg-white dark:bg-zinc-800 opacity-100 shadow-sm border-border text-muted-foreground transition-colors">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 opacity-100 border border-border shadow-lg">
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/chat")}
            className="text-muted-foreground hover:text-foreground gap-2 border-border"
          >
            <Plus className="size-4" />
            New Chat
          </Button>
        </div>

        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      // Hide internal system language prompt visually from history
                      const renderText = part.text.replace(/\[Important: You must respond in the .*? language\.\]\n\n/, "");
                      return (
                        <React.Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{renderText}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(renderText)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </React.Fragment>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    case "file":
                      return (
                        <React.Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <div className="flex flex-wrap gap-2 mb-2 p-1">
                                {/* @ts-ignore */}
                                <img src={part.url} alt="attachment" className="max-w-64 max-h-64 object-cover rounded-lg border shadow-sm" />
                              </div>
                            </MessageContent>
                          </Message>
                        </React.Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="shrink-0 mt-4">
          <PromptInput onSubmit={handleSubmit} accept="image/*" multiple>
            <PromptInputAttachments>
              {(file) => <PromptInputAttachment data={file} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputUploadButton />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-lg transition-colors ${isRecording ? 'text-red-500 bg-red-50' : 'text-slate-500'}`} 
                  onClick={toggleRecording}
                  type="button"
                  title="Voice Input"
                >
                  {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </Button>
              </PromptInputTools>
              <PromptInputSubmit disabled={!input && input.length === 0} status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
};

function AIChatWrapper() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const [newChatId, setNewChatId] = useState(() => generateId());

  useEffect(() => {
    if (!queryId) {
      setNewChatId(generateId());
    }
  }, [queryId]);

  const activeId = queryId || newChatId;

  return <AIChatContent key={activeId} chatId={activeId} />;
}

export default function AIChat() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader /></div>}>
      <AIChatWrapper />
    </Suspense>
  );
}