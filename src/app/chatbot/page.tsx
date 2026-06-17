"use client";

import { useState, FormEvent } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ChatbotPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = (e: FormEvent) => {
    e.preventDefault();
    setAnswer(`Sorry, I can't answer that right now. Try exploring the heritage collection instead.`);
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">AI Chat</h1>
        <p className="text-muted-foreground mt-2">Ask about heritage sites, culture, or explore the collection faster.</p>
      </div>

      <form onSubmit={handleAsk} className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          placeholder="Ask a question about cultural heritage or explore features..."
          className="w-full rounded-3xl border border-border bg-background p-4 text-foreground outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/40"
        />

        <button className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          Send Question
        </button>
      </form>

      {answer && (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">AI Answer</h2>
          <p className="text-muted-foreground">{answer}</p>
        </div>
      )}
    </PageWrapper>
  );
}
