import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { FadeIn } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Upload, CheckCircle2, Loader2, ScanLine, ArrowRight, Shield, User } from "lucide-react";

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
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/passport-ocr`, {
        method: "POST",
        headers: { "apikey": supabaseKey },
        body: formData,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload) throw new Error(payload?.error || "OCR request failed");
      setForm((c) => ({
        ...c,
        fullName: payload.fullName || c.fullName,
        passportNumber: payload.passportNumber || c.passportNumber,
        dob: payload.dateOfBirth || c.dob,
        nationality: payload.nationality || c.nationality,
      }));
      toast.success("Passport scanned! Please verify details.");
      setStep("details");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Automatic passport reading failed.";
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
      fullName: form.fullName, email: form.email, phone: form.phone,
      passportNumber: form.passportNumber, dob: form.dob, nationality: form.nationality,
    }, form.password);
    if (result.success) { toast.success("Welcome to WandAI!"); navigate("/plan"); }
    else { toast.error(result.error || "User already exists."); }
  };

  const set = (key: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((c) => ({ ...c, [key]: e.target.value }));

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[
        { key: "passport", label: "Scan", icon: ScanLine },
        { key: "details", label: "Details", icon: User },
        { key: "verify", label: "Verify", icon: Shield },
      ].map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          {i > 0 && <div className={`w-8 h-0.5 ${["details", "verify"].indexOf(step) >= i ? "bg-primary" : "bg-border"} rounded-full transition-colors`} />}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            step === s.key ? "gradient-ocean text-primary-foreground shadow-glow" : 
            ["passport", "details", "verify"].indexOf(step) > ["passport", "details", "verify"].indexOf(s.key) ? "bg-teal-light text-teal" : "bg-muted text-muted-foreground"
          }`}>
            <s.icon className="h-3 w-3" />
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px]">
          <FadeIn>
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl font-bold">Create your account</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {step === "passport" && "Upload your passport to auto-fill details"}
                {step === "details" && "Verify & complete your profile"}
                {step === "verify" && "Verify your email to get started"}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>{stepIndicator}</FadeIn>

          <FadeIn delay={0.1}>
            <Card className="shadow-elevated border-border/50 overflow-hidden">
              <CardContent className="p-6">
                {step === "passport" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="relative border-2 border-dashed border-border rounded-2xl p-10 hover:border-primary/40 transition-all cursor-pointer group bg-muted/30"
                      onClick={() => fileInputRef.current?.click()}>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePassportUpload} />
                      <div className="text-center">
                        {loading ? (
                          <>
                            <div className="w-16 h-16 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-4 shadow-glow">
                              <Loader2 className="h-7 w-7 text-primary-foreground animate-spin" />
                            </div>
                            <p className="font-medium text-sm">Scanning passport...</p>
                            <p className="text-xs text-muted-foreground mt-1">AI is extracting your details</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                              <Upload className="h-7 w-7 text-accent-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="font-medium text-sm">Upload passport image</p>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG — details auto-filled via OCR</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                    {ocrMessage && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/10 text-sm text-destructive">
                        <Shield className="h-4 w-4 mt-0.5 shrink-0" /> {ocrMessage}
                      </div>
                    )}
                    <Button variant="ghost" onClick={() => setStep("details")} className="w-full rounded-xl text-muted-foreground">
                      Skip — Fill manually
                    </Button>
                  </motion.div>
                )}

                {step === "details" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
                    {ocrMessage && (
                      <div className="text-xs text-destructive bg-destructive/5 rounded-xl p-3 border border-destructive/10">{ocrMessage}</div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Full Name *</Label>
                      <Input value={form.fullName} onChange={set("fullName")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Date of Birth</Label>
                        <Input type="date" value={form.dob} onChange={set("dob")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Nationality</Label>
                        <Input value={form.nationality} onChange={set("nationality")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Passport Number</Label>
                      <Input value={form.passportNumber} onChange={set("passportNumber")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Email *</Label>
                      <Input type="email" value={form.email} onChange={set("email")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Phone</Label>
                      <Input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Password *</Label>
                        <Input type="password" value={form.password} onChange={set("password")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Confirm *</Label>
                        <Input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button className="w-full h-11 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold gap-2" onClick={handleSubmit}>
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {step === "verify" && (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-teal" />
                    </div>
                    <div>
                      <p className="font-medium">Almost there!</p>
                      <p className="text-sm text-muted-foreground mt-1">We'll send a code to <strong>{form.email}</strong></p>
                    </div>
                    {!otpSent ? (
                      <Button className="w-full h-11 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold" onClick={sendOtp}>
                        Send Verification Code
                      </Button>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <Input
                          placeholder="Enter 4-digit code"
                          value={otp} onChange={(e) => setOtp(e.target.value)}
                          className="text-center text-lg tracking-[0.3em] h-12 rounded-xl bg-muted/50 border-border/50 font-mono"
                          maxLength={4}
                        />
                        <Button className="w-full h-11 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold gap-2" onClick={verifyAndRegister}>
                          Verify & Create Account <ArrowRight className="h-4 w-4" />
                        </Button>
                        <p className="text-xs text-muted-foreground">Demo OTP: 1234</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step !== "verify" && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">Log in</button>
                  </p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
