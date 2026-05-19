import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, User, Mail, IdCard, Check } from "lucide-react";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function SignUp() {
  const nav = useNavigate();
  // Pre-filled for demo / working-model purpose
  const [customerId, setCustomerId] = useState("ORB-IN-2024-0142");
  const [name, setName] = useState("Rohan Sharma");
  const [phone, setPhone] = useState("98765 43210");
  const [email, setEmail] = useState("rohan@example.com");

  const idValid = /^ORB-[A-Z]{2}-\d{4}-\d{3,4}$/i.test(customerId.trim());
  const valid = idValid && name && phone && email;

  return (
    <MobileFrame tone="cream">
      <header className="px-6 pt-3 pb-4 flex items-center">
        <Link to="/m/customer/welcome" className="p-2 -ml-2"><ArrowLeft className="h-5 w-5 text-slate-700" /></Link>
      </header>
      <div className="px-6 flex-1 pb-6">
        <h1 className="text-[30px] leading-[1.1] font-serif text-slate-900">Create your account.</h1>
        <p className="mt-2 text-[14px] text-slate-600">Use your Orb Customer ID from the welcome email or installation handover.</p>

        <div className="mt-6 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Orb Customer ID</label>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm border-2 border-emerald-200 focus-within:border-emerald-500 transition-colors">
              <IdCard className="h-4 w-4 text-emerald-600" />
              <input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
                placeholder="ORB-IN-2024-0142"
                className="flex-1 outline-none bg-transparent text-[15px] font-mono tracking-wider text-slate-900"
              />
              {idValid && <Check className="h-4 w-4 text-emerald-600" />}
            </div>
          </div>

          <Field icon={<User className="h-4 w-4" />} label="Full name" value={name} onChange={setName} />
          <Field icon={<Phone className="h-4 w-4" />} label="Mobile" value={phone} onChange={setPhone} prefix="+91" />
          <Field icon={<Mail className="h-4 w-4" />} label="Email" value={email} onChange={setEmail} />
        </div>

        <button
          disabled={!valid}
          onClick={() => nav(`/m/customer/otp?p=${encodeURIComponent(phone)}`)}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 text-[15px] font-bold py-4 shadow-[0_10px_24px_-10px_rgba(16,185,129,0.55)]"
        >
          Create account
        </button>

        <p className="mt-4 text-center text-[12px] text-slate-500">
          Already have an account?{" "}
          <Link to="/m/customer/login" className="font-bold text-emerald-700">Sign in</Link>
        </p>
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

export default SignUp;
