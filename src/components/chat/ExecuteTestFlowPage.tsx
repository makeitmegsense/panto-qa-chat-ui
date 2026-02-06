import React from "react";
import QAChatbot from "./QAChatbot";
import { Smartphone } from "lucide-react";

/**
 * Page layout that embeds the QA Chatbot
 * inside an "Execute Test Flow" workspace
 * matching the provided design structure.
 */

export default function ExecuteTestFlowPage() {
  return (
    <div className="flex min-h-screen bg-[#F4F7F6]">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 py-6 text-2xl font-semibold text-[#019D91]">
          &lt;panto&gt;
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            "Execute",
            "Test Runs",
            "Test Flows",
            "Devices",
            "Apps",
            "Team",
            "Tools",
            "Settings",
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full text-left px-4 py-2 rounded-sm text-sm transition ${{
                0: "bg-[#E6F4F2] text-[#019D91] font-medium",
              }[i] || "text-slate-600 hover:bg-slate-100"}`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t text-sm text-slate-600">
          Anand J. <span className="text-xs text-slate-400">Free Trial</span>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-8 space-y-6 overflow-hidden">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Execute Test Flow
          </h1>
          <p className="text-sm text-slate-500">
            Select a device to start automating your scenario
          </p>
        </div>

        {/* ===== Two‑column layout ===== */}
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-160px)]">
          {/* Device View */}
          <div className="bg-white rounded-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center gap-2 text-slate-800 font-medium mb-4">
              <Smartphone className="w-4 h-4" />
              Device View
            </div>

            {/* Phone mock */}
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-sm flex items-center justify-center">
              <div className="w-[240px] h-[480px] bg-black rounded-[28px] shadow-inner" />
            </div>
          </div>

          {/* Chatbot Panel */}
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <p className="font-medium text-slate-900">
                New Chat – Samsung m31s
              </p>
              <span className="text-xs bg-[#E6F4F2] text-[#019D91] px-2 py-1 rounded-sm">
                Session Connected
              </span>
            </div>

            {/* Embedded chatbot */}
            <div className="flex-1 overflow-hidden">
              <QAChatbot />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
