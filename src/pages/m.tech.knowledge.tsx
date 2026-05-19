import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Search, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { AskOrbAI } from "@/components/AskOrbAI";

const articles = [
  { c: "Inverters", t: "Replacing PCB-A2 on the OE-5K series", time: "8 min read" },
  { c: "Panels", t: "Diagnosing soiling vs micro-cracks", time: "5 min read" },
  { c: "Battery", t: "BMS reset procedure for OE-Storage", time: "3 min read" },
  { c: "Safety", t: "Roof anchor checklist", time: "2 min read" },
  { c: "Electrical", t: "Earth-fault troubleshooting flow", time: "12 min read" },
];

function Knowledge() {
  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Knowledge</h1>
      </header>

      <div className="px-5">
        <AskOrbAI
          persona="tech"
          suggestions={[
            "Why is MPPT-2 reading 0V?",
            "Steps to replace PCB-A2",
            "BMS reset procedure",
          ]}
        />

        <div className="mt-5 relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input placeholder="Search articles" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" />
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Recommended</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {articles.map((a) => (
            <div key={a.t} className="flex items-center gap-3 p-3.5">
              <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center"><BookOpen className="h-4 w-4" /></div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">{a.c}</p>
                <p className="text-sm font-semibold">{a.t}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{a.time}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

export default Knowledge;
