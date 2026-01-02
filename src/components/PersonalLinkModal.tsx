"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Step1Form, type Step1Data } from "@/components/Step1Form";
import { Copy, Check, Download } from "lucide-react";
import QRCode from "react-qr-code";
import { downloadQRCode } from "@/lib/qr";

interface PersonalLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Step1Data>;
}

export function PersonalLinkModal({ open, onOpenChange, initialValues }: PersonalLinkModalProps) {
  const [formData, setFormData] = useState<Step1Data | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleFormDataChange = (data: Step1Data) => {
    setFormData(data);
  };

  const handleGenerate = () => {
    if (!formData) return;

    // Format date as YYYY-MM-DD if it exists
    let dateParam = "";
    if (formData.date) {
      const year = formData.date.getFullYear();
      const month = String(formData.date.getMonth() + 1).padStart(2, "0");
      const day = String(formData.date.getDate()).padStart(2, "0");
      dateParam = `${year}-${month}-${day}`;
    }

    // Build query parameters - include all params to match expected format
    // Trim whitespace from all values to avoid trailing spaces in URLs
    const params = new URLSearchParams();
    params.set("name", (formData.missionerName || "").trim());
    params.set("nation", (formData.nation || "").trim());
    params.set("date", dateParam);
    params.set("church", (formData.church || "").trim());

    // Get current origin (domain)
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}?${params.toString()}`;
    setGeneratedLink(link);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeRef.current || !generatedLink) return;
    downloadQRCode(qrCodeRef.current);
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    // Reset state when closing
    if (!open) {
      setTimeout(() => {
        setGeneratedLink(null);
        setCopied(false);
        setFormData(null);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => handleClose(open)}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {!generatedLink ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Generate a Pre-filled Form</DialogTitle>
              <DialogDescription>So that it&apos;s easier for missioners when sending to mission partners!</DialogDescription>
            </DialogHeader>

            <div className="mt-1">
              <Step1Form initialValues={initialValues} onDataChange={handleFormDataChange} hideHeader />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleGenerate}
                variant="outline"
                className="bg-white hover:border-white/80 hover:bg-white/10 hover:text-white"
                disabled={!formData?.missionerName || !formData?.nation || !formData?.date || !formData?.church}
              >
                Generate
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Your Personal Link</DialogTitle>
              <DialogDescription>Share this link with mission partners to pre-fill their form!</DialogDescription>
            </DialogHeader>

            <div className="mt-1 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Generated Link</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 px-3 py-2 bg-bc-1/20 border border-bc-1/30 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-bc-1/50"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="bg-white hover:border-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && <p className="text-sm text-green-400">Link copied to clipboard!</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">QR Code</label>
                <div className="flex justify-center mt-1">
                  <div
                    ref={qrCodeRef}
                    className="inline-flex bg-white p-4 border border-bc-1/30 rounded-md items-center justify-center"
                  >
                    {generatedLink && <QRCode value={generatedLink} size={323} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="bg-white hover:border-white/80 hover:bg-white/10 hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

