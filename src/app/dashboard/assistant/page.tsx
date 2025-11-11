import { ChatInterface } from "./components/chat-interface";

export default function AssistantPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">AI Assistant</h1>
      </div>
      <div className="flex-1 rounded-lg">
        <ChatInterface />
      </div>
    </>
  );
}
