import React from "react";
import QAChatbot from "./QAChatbot";
import { Smartphone } from "lucide-react";

export default function ExecuteTestFlowPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7F6]">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-6 py-6 text-2xl font-semibold text-[#019D91]">
          &lt;panto&gt;
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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
              className={`w-full text-left px-4 py-2 rounded-sm text-sm transition ${
                i === 0
                  ? "bg-[#E6F4F2] text-[#019D91] font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t text-sm text-slate-600 shrink-0">
          Anand J. <span className="text-xs text-slate-400">Free Trial</span>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col overflow-hidden p-6">
        {/* Page header */}
        <div className="mb-4 shrink-0">
          <h1 className="text-2xl font-semibold text-slate-900">
            Execute Test Flow
          </h1>
          <p className="text-sm text-slate-500">
            Select a device to start automating your scenario
          </p>
        </div>

        {/* ===== Workspace (NO PAGE SCROLL) ===== */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* ===== Device View (smaller) ===== */}
          <div className="w-[320px] bg-white rounded-sm border border-slate-200 p-4 flex flex-col shrink-0">
            <div className="flex items-center gap-2 text-slate-800 font-medium mb-3">
              <Smartphone className="w-4 h-4" />
              Device View
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-[220px] h-[440px] bg-black rounded-[26px]" />
            </div>
          </div>

          {/* ===== Chat Panel (dominant) ===== */}
          <div className="flex-1 bg-white rounded-sm border border-slate-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b flex items-center justify-between shrink-0">
              <p className="font-medium text-slate-900">
                New Chat – Samsung m31s
              </p>
              <span className="text-xs bg-[#E6F4F2] text-[#019D91] px-2 py-1 rounded-sm">
                Session Connected
              </span>
            </div>

            {/* Chatbot container */}
            {/* ONLY this area scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <QAChatbot />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}