"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/MedTrack/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/MedTrack/components/ui/card";
import { Badge } from "@/MedTrack/components/ui/badge";
import {
  Loader2,
  ShieldCheck,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
} from "lucide-react";
import gsap from "gsap";

const ACCESS_TOKEN_KEY = "med_access_token";
const ACCESS_EXPIRES_KEY = "med_access_expires";

export default function DoctorAccessPage() {
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tokenBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedExpires = localStorage.getItem(ACCESS_EXPIRES_KEY);
    if (stored) {
      setToken(stored);
      if (storedExpires) setExpiresAt(storedExpires);
    }
  }, []);

  const generateToken = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/access/generate", {
        method: "POST",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      const newToken = data.data.token;
      const newExpires = data.data.expiresAt;

      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
      if (newExpires) localStorage.setItem(ACCESS_EXPIRES_KEY, newExpires);

      setToken(newToken);
      setExpiresAt(newExpires);

      // Animate token appearance
      gsap.fromTo(
        tokenBoxRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out" },
      );
    } finally {
      setLoading(false);
    }
  };

  const revokeToken = async () => {
    if (!token) return;

    setLoading(true);
    const tokenToRevoke = token;

    try {
      const res = await fetch("/api/access/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToRevoke.trim() }),
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      setToken(null);
      setExpiresAt(null);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(ACCESS_EXPIRES_KEY);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    gsap.to(".copy-feedback", { opacity: 1, duration: 0.2 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={cardRef} className="max-w-2xl w-full">
      <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50/50 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            Temporary Doctor Access
          </CardTitle>
          <p className="text-gray-600 mt-3">
            Generate a secure, time-limited access token for clinics to view
            your medical records. Tokens expire after 24 hours.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!token ? (
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-2 border-dashed border-blue-300">
              <p className="text-gray-700 text-sm font-medium">
                ✨ No active access token. Generate one now to share your
                records safely.
              </p>

              <Button
                onClick={generateToken}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Generate Access Token
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div ref={tokenBoxRef} className="space-y-5">
              <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-center justify-between gap-4">
                  <span className="text-lg font-mono tracking-wider text-emerald-400 font-semibold breaks-all">
                    {token}
                  </span>

                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={copyToken}
                    className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>

                {copied && (
                  <div className="copy-feedback absolute top-2 right-16 bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0">
                    ✓ Copied!
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Token is currently active
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">
                      Expires
                    </span>
                  </div>
                  {expiresAt && (
                    <p className="text-xs text-gray-600 font-mono">
                      {new Date(expiresAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={revokeToken}
                disabled={loading}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                {loading ? "Revoking..." : "Revoke Access Token"}
              </Button>

              <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-sm text-blue-800">
                <p className="font-semibold mb-2">💡 How to use:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Copy this token above</li>
                  <li>Share with your healthcare provider</li>
                  <li>They use it to access your records</li>
                  <li>Token automatically expires in 24 hours</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
