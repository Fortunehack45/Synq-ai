import { ChatInterface } from "./components/chat-interface";

export default function AssistantPage() {
  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">AI Assistant</h1>
      </div>
      <ChatInterface />
    </>
  );
}
