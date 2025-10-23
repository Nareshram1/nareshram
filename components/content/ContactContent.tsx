import React from "react";

const ContactContent: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold border-b-2 border-[#000080] pb-2">New Message</h2>
    <form className="space-y-3" onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); alert('Mail client not configured. Please email me directly!'); }}>
      <div>
        <label className="block font-bold mb-1">To:</label>
        <input
          type="text"
          readOnly
          className="w-full p-1 border-2 bg-gray-200"
          style={{
            borderTopColor: '#808080',
            borderLeftColor: '#808080',
            borderRightColor: '#ffffff',
            borderBottomColor: '#ffffff'
          }}
          value="your.email@example.com" // --- TODO --- Fill in your email
        />
      </div>
      <div>
        <label className="block font-bold mb-1">Subject:</label>
        <input
          type="text"
          className="w-full p-1 border-2"
          style={{
            borderTopColor: '#808080',
            borderLeftColor: '#808080',
            borderRightColor: '#ffffff',
            borderBottomColor: '#ffffff'
          }}
          placeholder="Project inquiry or opportunity"
        />
      </div>
      <div>
        <label className="block font-bold mb-1">Message:</label>
        <textarea
          className="w-full p-1 border-2 h-32"
          style={{
            borderTopColor: '#808080',
            borderLeftColor: '#808080',
            borderRightColor: '#ffffff',
            borderBottomColor: '#ffffff'
          }}
          placeholder="Hello! I'd love to discuss..."
        />
      </div>
      <button type="submit" className="px-4 py-1 bg-[#c0c0c0] border-2 font-bold" style={{
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#000000',
        borderBottomColor: '#000000'
      }}>
        Send
      </button>
    </form>
  </div>
);

export default ContactContent;