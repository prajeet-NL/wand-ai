import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Upload, CheckCircle2, Loader2, ShieldCheck, ScanLine } from "lucide-react";

export default function RegisterPage() {
  const { register } = useTrip();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<"passport" | "details" | "verify">("passport");
  const [loading, setLoading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
    passportNumber: "", dob: "", nationality: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handlePassportUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setOcrMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/passport-ocr", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload) {
        throw new Error(payload?.error || "OCR request failed");
      }

      setForm((current) => ({
        ...current,
        fullName: payload.fullName || current.fullName,
        passportNumber: payload.passportNumber || current.passportNumber,
        dob: payload.dateOfBirth || current.dob,
        nationality: payload.nationality || current.nationality,
      }));
      toast.success("Passport scanned successfully! Please verify details.");
      setStep("details");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Automatic passport reading failed. Please enter details manually.";
      setOcrMessage(message);
      toast.error("Unable to auto-read passport. Please enter details manually.");
      setStep("details");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (!form.email || !form.fullName) { toast.error("Please fill all required fields"); return; }
    setStep("verify");
    setOtpSent(false);
  };

  const sendOtp = () => {
    setOtpSent(true);
    toast.success("OTP sent to " + form.email + " (Mock: use 1234)");
  };

  const verifyAndRegister = () => {
    if (otp !== "1234") { toast.error("Invalid OTP. Use 1234 for demo."); return; }

    const result = register({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      passportNumber: form.passportNumber,
      dob: form.dob,
      nationality: form.nationality,
    }, form.password);

    if (result.success) {
      toast.success("Welcome to WandAI!");
      navigate("/plan");
    } else {
      toast.error(result.error || "User already exists with this passport or email.");
    }
  };

  const set = (key: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#07121f_0%,#0d2136_44%,#eef5f8_44%,#f7fafc_100%)]">
      <Navbar />
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/60">
              <ScanLine className="h-3.5 w-3.5" />
              Secure onboarding
            </div>
            <div className="max-w-xl space-y-5">
              <h1 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
                Join the travel flow with zero paperwork friction.
              </h1>
              <p className="text-lg leading-8 text-white/68">
                Passport-assisted onboarding lets you start with momentum, then review every extracted detail with confidence before continuing.
              </p>
            </div>

            <div className="glass-panel rounded-[32px] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <p className="font-display text-xl text-white">Smart, editable, and reassuring</p>
                  <p className="mt-2 text-sm leading-7 text-white/62">
                    Upload once, let OCR do the initial pass, then verify and edit the structured details before account creation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[36px] border border-white/60 bg-white/92 shadow-[0_30px_100px_rgba(8,21,37,0.16)]">
            <CardHeader className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(6,17,29,0.98),rgba(12,46,70,0.98))] px-8 py-8 text-white">
              <CardTitle className="font-display text-3xl">Create your account</CardTitle>
              <CardDescription className="text-white/65">
                {step === "passport" && "Start with passport OCR for faster onboarding"}
                {step === "details" && "Review, refine, and complete your profile"}
                {step === "verify" && "Verify your email to unlock planning"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-8">
              {step === "passport" && (
                <div className="space-y-5 text-center">
                  <div
                    className="rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 p-12 transition-colors hover:border-primary/40"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePassportUpload}
                    />
                    {loading ? (
                      <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    )}
                    <p className="mt-5 font-medium text-slate-900">
                      {loading ? "Scanning passport..." : "Click to upload passport image"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">We extract your travel identity details, then let you review everything before submission.</p>
                  </div>
                  {ocrMessage && <p className="text-sm text-destructive">{ocrMessage}</p>}
                  <Button variant="outline" onClick={() => setStep("details")} className="w-full rounded-full">
                    Skip and fill manually
                  </Button>
                </div>
              )}

              {step === "details" && (
                <div className="space-y-4">
                  {ocrMessage && <p className="text-sm text-destructive">{ocrMessage}</p>}
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={form.fullName} onChange={set("fullName")} className="h-12 rounded-2xl bg-slate-50" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" value={form.dob} onChange={set("dob")} className="h-12 rounded-2xl bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nationality</Label>
                      <Input value={form.nationality} onChange={set("nationality")} className="h-12 rounded-2xl bg-slate-50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Number</Label>
                    <Input value={form.passportNumber} onChange={set("passportNumber")} className="h-12 rounded-2xl bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={set("email")} className="h-12 rounded-2xl bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" className="h-12 rounded-2xl bg-slate-50" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Password *</Label>
                      <Input type="password" value={form.password} onChange={set("password")} className="h-12 rounded-2xl bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm *</Label>
                      <Input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} className="h-12 rounded-2xl bg-slate-50" />
                    </div>
                  </div>
                  <Button
                    className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white hover:opacity-95"
                    onClick={handleSubmit}
                  >
                    Continue to verification
                  </Button>
                </div>
              )}

              {step === "verify" && (
                <div className="space-y-5 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-teal" />
                  <p className="text-sm leading-7 text-muted-foreground">
                    We&apos;ll send a verification code to <strong>{form.email}</strong>
                  </p>
                  {!otpSent ? (
                    <Button
                      className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white hover:opacity-95"
                      onClick={sendOtp}
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter 4-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-14 rounded-2xl bg-slate-50 text-center text-lg tracking-[0.35em]"
                        maxLength={4}
                      />
                      <Button
                        className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white hover:opacity-95"
                        onClick={verifyAndRegister}
                      >
                        Verify and create account
                      </Button>
                      <p className="text-xs text-muted-foreground">Demo OTP: 1234</p>
                    </div>
                  )}
                </div>
              )}

              {step !== "verify" && (
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
                    Log in
                  </button>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
