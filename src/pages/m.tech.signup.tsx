import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, IdCard, MapPin } from "lucide-react";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function TechSignup() {
  const nav = useNavigate();
  const [name, setName] = useState("Arjun Mehta");
  const [empId, setEmpId] = useState("ORB-T-1248");
  const [phone, setPhone] = useState("99887 12345");
  const [region, setRegion] = useState("Pune");

  return (
    <MobileFrame tone="cream">
      <header className="px-6 pt-3 pb-4 flex items-center">
        <Link to="/m/tech/welcome" className="p-2 -ml-2"><ArrowLeft className="h-5 w-5 text-slate-700" /></Link>
      </header>
      <div className="px-6 flex-1">
        <h1 className="text-[32px] leading-[1.1] font-serif text-slate-900">Request access.</h1>
        <p className="mt-3 text-[15px] text-slate-600">Your supervisor will approve within 24 hours.</p>

        <div className="mt-7 space-y-3">
          <Field icon={<User className="h-4 w-4" />} label="Full name" value={name} onChange={setName} />
          <Field icon={<IdCard className="h-4 w-4" />} label="Employee ID" value={empId} onChange={setEmpId} />
          <Field icon={<Phone className="h-4 w-4" />} label="Mobile" value={phone} onChange={setPhone} prefix="+91" />
          <Field icon={<MapPin className="h-4 w-4" />} label="Region" value={region} onChange={setRegion} />
        </div>

        <button
          onClick={() => nav(`/m/tech/otp?p=${encodeURIComponent(phone)}`)}
          className="mt-7 w-full rounded-full bg-slate-900 text-white text-[15px] font-semibold py-4"
        >
          Submit &amp; verify
        </button>
      </div>
    </MobileFrame>
  );
}

function Field({ icon, label, value, onChange, prefix }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
        <span className="text-slate-500">{icon}</span>
        {prefix && <span className="text-slate-700 text-sm font-semibold">{prefix}</span>}
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 outline-none bg-transparent text-[15px] text-slate-900" />
      </div>
    </div>
  );
}

export default TechSignup;
