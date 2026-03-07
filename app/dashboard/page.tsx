"use client";

import { useState, useEffect, useRef } from "react";
import ImmunizationTimeline from "@/components/ImmunizationTimeline";
import { useAccessToken } from "@/MedTrack/hooks/useAccessToken";
import gsap from "gsap";
import { Button } from "@/MedTrack/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/MedTrack/components/ui/dialog";
import { Upload } from "lucide-react";

export default function Page() {
  const { token, isLoading: tokenLoading } = useAccessToken();
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/patient/eligibility");
        const data = await res.json();

        if (data.success) {
          setEligibilityData(data.data);
          setError(null);

          // Animate content entry
          gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          );
        } else {
          setError(data.message || "Failed to load eligibility data");
        }
      } catch (err) {
        console.error("Error fetching eligibility:", err);
        setError("Error loading patient data");
      } finally {
        setIsLoading(false);
      }
    };

    if (!tokenLoading) {
      fetchEligibility();
    }
  }, [tokenLoading]);

  if (isLoading || tokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Loading your immunization records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-2xl border-2 border-red-200">
          <p className="text-red-600 font-semibold text-lg mb-2">Oops!</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleImport = () => {
    if (!selectedFile) return;
    // Optional: parse CSV or send to API here
    setUploadDialogOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          onClick={() => setUploadDialogOpen(true)}
          className="gap-2 border border-border bg-background hover:bg-muted/50 hover:border-muted-foreground/30 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload CSV
        </Button>
      </div>

      <ImmunizationTimeline
        timeline={eligibilityData?.timeline}
        progress={eligibilityData?.progress}
        patientName={eligibilityData?.patientName}
      />

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import from CSV</DialogTitle>
            <DialogDescription>
              Choose a CSV file to import immunization or record data. Supported
              format: .csv
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={openFilePicker}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              {selectedFile ? selectedFile.name : "Choose file"}
            </Button>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!selectedFile}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
