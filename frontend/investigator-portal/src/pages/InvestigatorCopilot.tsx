import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copilotSuggestions } from "@/data/mockIntelligence";

type Message = { role: "user" | "assistant"; content: string };

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "SOCMINT Co-Pilot online. I can summarize evidence chains, explain attribution scores, and recommend graph expansion paths. What entity should we analyze?",
  },
];

export default function InvestigatorCopilot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Analysis complete for "${text}". Recommend: run multi-modal attribution on linked burners, enable focus mode on Cluster-7, and queue Section 65B export for case CID-2026-0001. Confidence drivers: stylometry + temporal overlap.`,
        },
      ]);
    }, 600);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3 h-[calc(100vh-180px)]">
      <Card className="lg:col-span-2 flex flex-col" glow="cyber">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyber-glow" />
            Investigator AI Co-Pilot
          </CardTitle>
          <span className="text-[10px] font-mono text-intel-teal">ENTERPRISE ANALYST MODE</span>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl px-4 py-3 text-sm max-w-[90%] ${
                    msg.role === "user"
                      ? "ml-auto bg-cyber/20 border border-cyber/30 text-slate-100"
                      : "bg-navy-800/80 border border-white/[0.06] text-slate-300"
                  }`}
                >
                  {msg.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query graph, summarize evidence, explain attribution…"
            />
            <Button type="submit" size="md">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs">
              <Sparkles className="h-4 w-4" /> Recommended actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {copilotSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="w-full text-left rounded-lg border border-white/[0.06] bg-navy-900/50 px-3 py-2 text-xs text-slate-400 hover:border-cyber/30 hover:text-slate-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
