"use client";

import React, { useState } from "react";
import emailjs from "emailjs-com";

// Retro Toast Component
type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const RetroToast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "#c0c0c0" : "#f0c0c0"; // light gray or reddish
  const title = type === "success" ? "Success" : "Error";

  return (
    <div
      className="fixed bottom-16 right-5 w-72 p-3 border-2 shadow-[2px_2px_0_#000] rounded-sm font-mono text-sm z-50"
      style={{ backgroundColor: bgColor, borderColor: "#000080" }}
    >
      <div className="font-bold mb-1">{title}</div>
      <div className="mb-1">{message}</div>
      <button
        onClick={onClose}
        className="px-2 py-1 border-2 font-bold bg-[#c0c0c0] active:translate-y-[1px]"
        style={{
          borderTopColor: "#ffffff",
          borderLeftColor: "#ffffff",
          borderRightColor: "#000000",
          borderBottomColor: "#000000",
        }}
      >
        OK
      </button>
    </div>
  );
};

const ContactContent: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const playSound = (type: "notify" | "error") => {
    const sound = new Audio(
      type === "notify" ? "/sounds/notify.mp3" : "/sounds/error.mp3"
    );
    sound.play();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      playSound("notify");
      setToast({ message: "Message sent successfully!", type: "success" });
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      playSound("error");
      setToast({ message: "Failed to send message. Try again later!", type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 font-mono text-sm">
      <h2 className="text-xl font-bold border-b-2 border-[#000080] pb-2">
        New Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-bold mb-1">To:</label>
          <input
            type="text"
            readOnly
            className="w-full p-1 border-2 bg-gray-200"
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#ffffff",
              borderBottomColor: "#ffffff",
            }}
            value="naresh.ram.b.03@gmail.com"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Your Email:</label>
          <input
            type="email"
            name="from_email"
            required
            className="w-full p-1 border-2"
            placeholder="you@example.com"
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#ffffff",
              borderBottomColor: "#ffffff",
            }}
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Subject:</label>
          <input
            type="text"
            name="subject"
            required
            className="w-full p-1 border-2"
            placeholder="Project inquiry or opportunity"
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#ffffff",
              borderBottomColor: "#ffffff",
            }}
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Message:</label>
          <textarea
            name="message"
            required
            className="w-full p-1 border-2 h-32"
            placeholder="Hello! I'd love to discuss..."
            style={{
              borderTopColor: "#808080",
              borderLeftColor: "#808080",
              borderRightColor: "#ffffff",
              borderBottomColor: "#ffffff",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="px-4 py-1 bg-[#c0c0c0] border-2 font-bold cursor-pointer active:translate-y-[1px]"
          style={{
            borderTopColor: "#ffffff",
            borderLeftColor: "#ffffff",
            borderRightColor: "#000000",
            borderBottomColor: "#000000",
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>

      {toast && (
        <RetroToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ContactContent;
