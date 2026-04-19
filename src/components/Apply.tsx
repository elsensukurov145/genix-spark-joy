import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle2, Mail, Loader2, ShieldCheck, KeyRound, User, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const EMAILJS_SERVICE_ID = "service_ajj44jn";
const EMAILJS_TEMPLATE_OTP = "template_hoecgdu";
const EMAILJS_TEMPLATE_APPLICATION = "template_1tz5ima";
const EMAILJS_PUBLIC_KEY = "3tIoxFEajWy0Q2bVn";
const ADMIN_EMAIL = "shukurovelshan388@gmail.com";

// Initialize EmailJS with logging
console.log("🔧 EmailJS Initialization:");
console.log("  Service ID:", EMAILJS_SERVICE_ID);
console.log("  OTP Template ID:", EMAILJS_TEMPLATE_OTP);
console.log("  Application Template ID:", EMAILJS_TEMPLATE_APPLICATION);
console.log("  Public Key:", EMAILJS_PUBLIC_KEY);

emailjs.init(EMAILJS_PUBLIC_KEY);
console.log("✅ EmailJS initialized successfully");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const Apply = () => {
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(""); // user input
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // submission
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // If user changes the email, reset OTP state
  useEffect(() => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode("");
    setGeneratedOtp("");
    setOtpError(false);
  }, [email]);

  // Email validation regex
  const validEmail = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Verify OTP when 6 digits entered
  useEffect(() => {
    if (!otpSent || otpCode.length !== 6) {
      if (otpCode.length < 6) setOtpError(false);
      return;
    }
    
    if (otpCode === generatedOtp) {
      console.log("✅ OTP VERIFIED! User entered correct code.");
      setOtpVerified(true);
      setOtpError(false);
      toast({
        description: "✅ Email verified successfully!",
      });
      
      // Step 2: Trigger success email automatically after OTP verification
      console.log("📧 Triggering Step 2: Sending success confirmation email...");
      sendSuccessEmail();
    } else {
      setOtpVerified(false);
      setOtpError(true);
    }
  }, [otpCode, generatedOtp, otpSent]);

  const fireConfetti = () => {
    const end = Date.now() + 800;
    const colors = ["#1D9E75", "#378ADD", "#ffb648", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors });
  };

  const handleSendOtp = async () => {
    if (!validEmail || sendingOtp) return;
    setSendingOtp(true);
    setOtpError(false);
    
    // Step 1: Generate real 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      // OTP template expects ONLY these two parameters
      const otpParams = {
        to_email: email,      // User's email address
        otp_code: otp,        // The actual 6-digit code
      };

      console.log("📧 STEP 1: Sending OTP Email (template_hoecgdu)");
      console.log("  to_email:", email);
      console.log("  otp_code:", otp);
      console.log("  Sending params:", otpParams);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_OTP,
        otpParams
      );

      console.log("✅ STEP 1 SUCCESS: OTP email sent with code:", otp);
      setOtpSent(true);
      setOtpCode("");
      toast({ description: "📧 OTP code sent! Check your email." });
    } catch (err: any) {
      console.error("❌ STEP 1 FAILED - OTP Send Error:");
      console.error("  Status:", err.status);
      console.error("  Message:", err.message);

      toast({
        title: "Failed to send OTP",
        description: `Error: ${err.status || "Unknown"}. Please try again.`,
        variant: "destructive",
      });
      setGeneratedOtp("");
    } finally {
      setSendingOtp(false);
    }
  };

  // Function to send success email after OTP verification
  const sendSuccessEmail = async () => {
    try {
      // Step 2: Send Success Email with actual user data
      const successParams = {
        name: name,           // Actual applicant name
        from_email: email,    // Actual user email
        message: program,     // Actual program selection
        from_page: "GeniX",   // Page identifier
      };

      console.log("📧 STEP 2: Sending Success Email (template_1tz5ima)");
      console.log("  Applicant Name:", name);
      console.log("  Email:", email);
      console.log("  Program:", program);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_APPLICATION,
        successParams
      );

      console.log("✅ STEP 2 SUCCESS: Application confirmation email sent!");
      
      // Show success ONLY after both emails are sent
      fireConfetti();
      setDone(true);
      
      // Clear form
      setName("");
      setEmail("");
      setProgram("");
      setOtpCode("");
      setOtpSent(false);
      setOtpVerified(false);
      setGeneratedOtp("");
      
      toast({
        title: "✅ Müraciətiniz uğurla tamamlandı!",
        description: "Your application has been submitted successfully. We'll contact you soon.",
      });
    } catch (err: any) {
      console.error("❌ STEP 2 FAILED - Success Email Error:");
      console.error("  Status:", err.status);
      console.error("  Message:", err.message);

      toast({
        title: "Error sending confirmation",
        description: `Error: ${err.status || "Unknown"}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // This function is now handled automatically by sendSuccessEmail() 
    // which is triggered when OTP is successfully verified
    // If user clicks submit after OTP verification, the form data is already submitted
    if (!otpVerified) {
      toast({ 
        description: "Please verify your email first by entering the OTP code.",
        variant: "destructive",
      });
      return;
    }
    
    // OTP is already verified and success email was already sent
    // Show confirmation that process is complete
    toast({
      title: "Application Already Submitted",
      description: "Your application and confirmation email have been sent. Check your inbox!",
    });
  };

  return (
    <section id="apply" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary via-primary-glow to-primary opacity-60 blur-xl animate-pulse-glow" />
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-r from-primary via-primary-glow to-primary" />

          <div className="relative rounded-[calc(2rem-1px)] bg-background p-6 sm:p-8 md:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-primary/30 blur-[80px]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t("apply_badge")}
              </div>
              <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {done ? (
                  t("apply_done_title")
                ) : (
                  <>
                    {t("apply_title_a")} <span className="text-gradient">{t("apply_title_b")}</span>
                  </>
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
                {done ? t("apply_done_subtitle") : t("apply_subtitle")}
              </p>

              {!done ? (
                <form onSubmit={onSubmit} className="space-y-4 max-w-md mx-auto text-left">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("apply_name")}
                      disabled={loading}
                      maxLength={120}
                      className="w-full glass rounded-full pl-11 pr-4 py-3.5 text-sm bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:text-muted-foreground/60 disabled:opacity-60"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("apply_email")}
                      disabled={loading}
                      maxLength={200}
                      className={`w-full glass rounded-full pl-11 pr-11 py-3.5 text-sm bg-white/5 focus:outline-none focus:ring-2 placeholder:text-muted-foreground/60 disabled:opacity-60 ${
                        otpVerified
                          ? "ring-2 ring-primary/60 focus:ring-primary"
                          : "focus:ring-primary/60"
                      }`}
                    />
                    {otpVerified && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Verify email button — appears when valid email entered and not yet verified */}
                  {validEmail && !otpVerified && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendingOtp}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-secondary/15 border border-secondary/40 text-secondary px-5 py-3 text-sm font-semibold hover:bg-secondary/20 transition-all disabled:opacity-60"
                      >
                        {sendingOtp ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            {otpSent ? "Resend OTP" : "Verify Email"}
                          </>
                        )}
                      </button>

                      {otpSent && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <label className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
                            <KeyRound className="h-3 w-3" />
                            Enter the 6-digit code sent to your email
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) =>
                              setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            placeholder="••••••"
                            className={`w-full glass rounded-full px-5 py-3.5 text-center text-lg font-mono tracking-[0.5em] bg-white/5 focus:outline-none focus:ring-2 ${
                              otpError
                                ? "ring-2 ring-destructive/70 focus:ring-destructive"
                                : "focus:ring-primary/60"
                            }`}
                          />
                          {otpError && (
                            <p className="text-xs text-destructive px-1">Wrong code! Please try again.</p>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {otpVerified && (
                    <p className="text-xs text-primary flex items-center gap-1.5 px-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Email verified ✓
                    </p>
                  )}

                  {/* Program */}
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <select
                      required
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      disabled={loading}
                      className="w-full glass rounded-full pl-11 pr-4 py-3.5 text-sm bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-60 appearance-none"
                    >
                      <option value="" className="bg-background">
                        {t("apply_program")}
                      </option>
                      <option value={t("apply_program_1")} className="bg-background">
                        {t("apply_program_1")}
                      </option>
                      <option value={t("apply_program_2")} className="bg-background">
                        {t("apply_program_2")}
                      </option>
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !otpVerified || !name || !program}
                    className="w-full group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-all glow-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary"
                  >
                    {loading ? (
                      <>
                        {t("apply_submit_loading")}
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        {t("apply_submit")}
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" /> {t("apply_thanks")}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
