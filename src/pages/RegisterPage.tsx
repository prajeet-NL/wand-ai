import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

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
        headers: {
          "apikey": supabaseKey,
        },
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-lg py-12">
        <Card className="shadow-elevated border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Create Account</CardTitle>
            <CardDescription>
              {step === "passport" && "Upload your passport to auto-fill details"}
              {step === "details" && "Verify & complete your profile"}
              {step === "verify" && "Verify your email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "passport" && (
              <div className="space-y-6 text-center">
                <div
                  className="border-2 border-dashed border-border rounded-xl p-12 hover:border-primary/50 transition-colors cursor-pointer"
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
                    <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                  ) : (
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  )}
                  <p className="mt-4 text-muted-foreground">
                    {loading ? "Scanning passport..." : "Click to upload passport image"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">(Passport details will be auto-filled after OCR)</p>
                </div>
                {ocrMessage && (
                  <p className="text-sm text-destructive">
                    {ocrMessage}
                  </p>
                )}
                <Button variant="outline" onClick={() => setStep("details")} className="w-full">
                  Skip - Fill Manually
                </Button>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-4">
                {ocrMessage && (
                  <p className="text-sm text-destructive">
                    {ocrMessage}
                  </p>
                )}
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.fullName} onChange={set("fullName")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={form.dob} onChange={set("dob")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Input value={form.nationality} onChange={set("nationality")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Passport Number</Label>
                  <Input value={form.passportNumber} onChange={set("passportNumber")} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={set("email")} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Password *</Label>
                    <Input type="password" value={form.password} onChange={set("password")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm *</Label>
                    <Input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} />
                  </div>
                </div>
                <Button className="w-full gradient-ocean text-primary-foreground" onClick={handleSubmit}>
                  Continue
                </Button>
              </div>
            )}

            {step === "verify" && (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-teal" />
                <p className="text-muted-foreground">We'll send a verification code to <strong>{form.email}</strong></p>
                {!otpSent ? (
                  <Button className="w-full gradient-ocean text-primary-foreground" onClick={sendOtp}>
                    Send OTP
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center text-lg tracking-widest"
                      maxLength={4}
                    />
                    <Button className="w-full gradient-ocean text-primary-foreground" onClick={verifyAndRegister}>
                      Verify & Create Account
                    </Button>
                    <p className="text-xs text-muted-foreground">Demo OTP: 1234</p>
                  </div>
                )}
              </div>
            )}

            {step !== "verify" && (
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => navigate("/login")} className="text-primary hover:underline">Log in</button>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
