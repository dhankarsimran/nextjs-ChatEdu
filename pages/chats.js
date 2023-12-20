import React, { useState, useEffect, useContext } from "react";
import Filter from "bad-words";
import { Context } from "../context";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const ChatEngine = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatEngine)
);
const MessageFormSocial = dynamic(() =>
  import("react-chat-engine").then((module) => module.MessageFormSocial)
);

export default function Home() {
  const { username, secret } = useContext(Context);
  const [showChat, setShowChat] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const filter = new Filter({ placeHolder: "*" });

  useEffect(() => {
    if (typeof document !== undefined) {
      setShowChat(true);
    }
  }, []);

  useEffect(() => {
    if (username === "" || secret === "") {
      router.push("/");
    }
  }, [username, secret]);

  // Function to check for offensive words
  const handleNewMessage = (chat, message) => {
    const filteredMessage = filter.clean(message.text);

    if (filteredMessage !== message.text) {
      // Replace offensive words in the message and increment warning count
      alert("Warning: Offensive word detected!");
      setWarningCount((prevCount) => prevCount + 1);

      // Logout the user after 3 warnings
      if (warningCount >= 0) {
        // Clear user credentials and redirect to the login page
        // setSecret("");
        router.push("/");
        alert(
          "You have been logged out due to multiple warnings for offensive language."
        );
      }

      // Create a new message object with the filtered content
      const filteredMessageObj = {
        ...message,
        text: filteredMessage,
      };

      // Update messages state with the filtered message
      setMessages((prevMessages) => [...prevMessages, filteredMessageObj]);
    } else {
      // If no offensive words, add the original message to messages state
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  if (!showChat) return <div />;

  return (
    <div className="background">
      <div className="shadow">
        <ChatEngine
          height="calc(100vh - 212px)"
          projectID="17f79722-a85f-4b30-9211-49f74ae1c0f0"
          userName={username}
          userSecret={secret}
          onConnect={() => setWarningCount(0)} // Reset warning count on reconnect
          renderNewMessageForm={() => <MessageFormSocial />}
          messages={messages}
          onNewMessage={(chat, message) => handleNewMessage(chat, message)}
        />
      </div>
    </div>
  );
}
