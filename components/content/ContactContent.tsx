"use client";

import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import {
  Send,
  Scissors,
  Copy,
  Clipboard,
  Undo,
  Check,
  Paperclip,
  Mail
} from 'lucide-react';

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

const ContactContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const playSound = (type: "notify" | "error") => {
    const sound = new Audio(
      type === "notify" ? "/sounds/notify.mp3" : "/sounds/error.mp3"
    );
    sound.play();
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('from_email') as HTMLInputElement;
    const email = emailInput.value;

    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      playSound("error");
      setToast({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    // 1. Honeypot check
    const honeypot = form.elements.namedItem('confirm_email') as HTMLInputElement;
    if (honeypot.value) {
      // Silently fail for bots
      console.log("Bot detected via honeypot");
      setToast({ message: "Message sent successfully!", type: "success" });
      form.reset();
      return;
    }

    // 2. Rate Limiting Check
    const LAST_EMAIL_KEY = 'retro_portfolio_last_email_time';
    const COOLDOWN_MS = 60000; // 60 seconds
    const lastSent = localStorage.getItem(LAST_EMAIL_KEY);

    if (lastSent) {
      const timeSinceLast = Date.now() - parseInt(lastSent, 10);
      if (timeSinceLast < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000);
        playSound("error");
        setToast({
          message: `Please wait ${remainingSeconds}s before sending another message.`,
          type: "error"
        });
        return;
      }
    }

    setSending(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // Update timestamp on success
      localStorage.setItem(LAST_EMAIL_KEY, Date.now().toString());

      playSound("notify");
      setToast({ message: "Message sent successfully!", type: "success" });
      form.reset();
      if (onClose) setTimeout(onClose, 2000);
    } catch (error) {
      console.error("EmailJS error:", error);
      playSound("error");
      setToast({ message: "Failed to send message. Try again later!", type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-[#808080] shadow-[0_1px_0_#ffffff] mb-1">
        <ToolbarButton
          icon={<Send size={24} className={sending ? "opacity-50" : ""} />}
          label={sending ? "Sending..." : "Send"}
          onClick={triggerSubmit}
          disabled={sending}
        />
        <div className="w-[1px] h-10 bg-[#808080] mx-1 border-r border-white"></div>
        <ToolbarButton icon={<Scissors size={20} />} label="Cut" />
        <ToolbarButton icon={<Copy size={20} />} label="Copy" />
        <ToolbarButton icon={<Clipboard size={20} />} label="Paste" />
        <ToolbarButton icon={<Undo size={20} />} label="Undo" />
        <div className="w-[1px] h-10 bg-[#808080] mx-1 border-r border-white"></div>
        <ToolbarButton icon={<Check size={20} />} label="Check" />
        <ToolbarButton icon={<Paperclip size={20} />} label="Attach" />
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col p-2 gap-2">
        {/* Honeypot Field - Hidden from users */}
        <input
          type="text"
          name="confirm_email"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Header Fields */}
        <div className="grid grid-cols-[60px_1fr] gap-y-1 items-center">

          <label className="text-[#000000]">To:</label>
          <div className="flex items-center border-b border-[#808080] bg-white h-6 pl-1 focus-within:bg-[#000080] focus-within:text-white">
            <span className="flex items-center gap-1 bg-[#c0c0c0] px-1 border border-gray-500 text-black text-xs h-4.5 cursor-default mr-1">
              <Mail size={12} />
              <span>Naresh Ram</span>
            </span>
            <input type="text" readOnly className="flex-1 outline-none text-xs bg-transparent" value="<naresh.ram.b.03@gmail.com>" />
          </div>

          <label className="text-[#000000]">Cc:</label>
          <div className="flex items-center border-b border-[#808080] bg-white h-6 pl-1 focus-within:border-black">
            <input type="text" className="w-full outline-none text-xs bg-transparent" />
          </div>

          <label className="text-[#000000]">From:</label>
          <div className="flex items-center border-b border-[#808080] bg-white h-6 pl-1 focus-within:border-black">
            <input
              type="email"
              name="from_email"
              required
              placeholder="Enter your email..."
              className="w-full outline-none text-xs bg-transparent peer"
            />
          </div>

          <label className="text-[#000000]">Subject:</label>
          <div className="flex items-center border-b border-[#808080] bg-white h-6 pl-1 focus-within:border-black">
            <input
              type="text"
              name="subject"
              required
              className="w-full outline-none text-xs bg-transparent"
            />
          </div>
        </div>

        {/* Message Body */}
        <div className="flex-1 border-t border-[#808080] shadow-[0_-1px_0_#ffffff] pt-2 mt-2">
          <textarea
            name="message"
            required
            className="w-full h-full resize-none outline-none font-mono bg-white p-1 text-sm border-none"
            style={{ fontFamily: 'Courier New, monospace' }}
          ></textarea>
        </div>
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

const ToolbarButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, disabled?: boolean }> = ({ icon, label, onClick, disabled }) => (
  <button
    type={onClick ? "button" : "button"}
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center min-w-[45px] px-1 py-1 hover:bg-[#d0d0d0] active:translate-x-[1px] active:translate-y-[1px] group disabled:opacity-50 disabled:grayscale transition-none`}
  >
    <div className="mb-0.5 text-black">{icon}</div>
    <span className="text-[10px] leading-none text-black">{label}</span>
  </button>
);

export default ContactContent;
