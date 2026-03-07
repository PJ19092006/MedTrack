"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, Lock, Key, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import gsap from "gsap";

type TabType = "patient" | "clinic";
type AuthMode = "login" | "register";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patient");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [phin, setPhin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [dob, setDob] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPatient = activeTab === "patient";
  const isLogin = authMode === "login";
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out" },
    );
  }, []);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll(".form-field"),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [activeTab, authMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        if (activeTab === "patient") {
          const res = await fetch("/api/auth/patient/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phin, password }),
          });

          const data = await res.json();

          if (!data.success) {
            alert(data.message);
            setIsSubmitting(false);
            return;
          }

          gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.5 });
          setTimeout(() => router.push("/dashboard"), 300);
        } else {
          const res = await fetch("/api/auth/clinic/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clinicId: username, password }),
          });

          const data = await res.json();

          if (!data.success) {
            alert(data.message);
            setIsSubmitting(false);
            return;
          }

          gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.5 });
          setTimeout(() => router.push("/clinic"), 300);
        }
      } else {
        if (activeTab === "patient") {
          const res = await fetch("/api/auth/patient/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phin,
              password,
              name: username,
              dob: dob || "2000-01-01",
              conditions: [],
            }),
          });

          const data = await res.json();
          if (!data.success) {
            alert(data.message);
            setIsSubmitting(false);
            return;
          }

          gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.5 });
          setTimeout(() => router.push("/dashboard"), 300);
        } else {
          const res = await fetch("/api/auth/clinic/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clinicId: username,
              password,
              name: clinicName,
              province: "Manitoba",
            }),
          });

          const data = await res.json();

          if (!data.success) {
            alert(data.message);
            setIsSubmitting(false);
            return;
          }

          gsap.to(cardRef.current, { opacity: 0, scale: 0.9, duration: 0.5 });
          setTimeout(() => router.push("/clinic"), 300);
        }
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setAuthMode(isLogin ? "register" : "login");
    setPhin("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setClinicName("");
    setDob("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <div ref={cardRef} className="w-full max-w-md sm:max-w-lg min-w-0">
        <Card className="w-full shadow-md rounded-2xl border overflow-hidden bg-card">
          {/* Top Tabs with Icons */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("patient");
                setAuthMode("login");
              }}
              className={clsx(
                "w-1/2 py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-inner",
                activeTab === "patient"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100",
              )}
            >
              <User className="w-4 h-4" />
              Patient
            </button>

            <button
              onClick={() => {
                setActiveTab("clinic");
                setAuthMode("login");
              }}
              className={clsx(
                "w-1/2 py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-inner",
                activeTab === "clinic"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100",
              )}
            >
              <Building2 className="w-4 h-4" />
              Clinic
            </button>
          </div>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {isLogin
                  ? `Sign in to your ${activeTab} account`
                  : `Register as a new ${activeTab}`}
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {isLogin ? (
                <>
                  {isPatient ? (
                    <div className="form-field space-y-2 group">
                      <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                        <Key className="w-4 h-4 text-blue-600" />
                        PHIN (9-digit ID)
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your PHIN"
                        value={phin}
                        onChange={(e) => setPhin(e.target.value)}
                        className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                        required
                      />
                    </div>
                  ) : (
                    <div className="form-field space-y-2">
                      <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Clinic ID
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your clinic ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                        required
                      />
                    </div>
                  )}

                  <div className="form-field space-y-2">
                    <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {isPatient ? (
                    <>
                      <div className="form-field space-y-2">
                        <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                          <Key className="w-4 h-4 text-blue-600" />
                          PHIN
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter your PHIN"
                          value={phin}
                          onChange={(e) => setPhin(e.target.value)}
                          className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="form-field space-y-2">
                        <Label className="text-gray-700 font-semibold">
                          Full Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="form-field space-y-2">
                        <Label className="text-gray-700 font-semibold">
                          Date of Birth
                        </Label>
                        <Input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-field space-y-2">
                        <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          Clinic ID
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter clinic ID"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="form-field space-y-2">
                        <Label className="text-gray-700 font-semibold">
                          Clinic Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter clinic name"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="form-field space-y-2">
                    <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="form-field space-y-2">
                    <Label className="text-gray-700 flex items-center gap-2 font-semibold">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {isLogin
                  ? `Don't have an account? Sign up`
                  : `Already have an account? Sign in`}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
