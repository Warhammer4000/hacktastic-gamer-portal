import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateVEVENTUrl } from "../utils/calendar";

interface EventQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
}

export function EventQRDialog({ open, onOpenChange, event }: EventQRDialogProps) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    if (open && event) {
      const calendarData = generateVEVENTUrl(event);
      const calendarUrl = `data:text/calendar;charset=utf-8,${calendarData}`;
      
      QRCode.toDataURL(calendarUrl)
        .then(url => setQrCode(url))
        .catch(err => console.error(err));
    }
  }, [open, event]);

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `event-${event.title}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to add the event to your calendar
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-4">
          {qrCode && (
            <>
              <img src={qrCode} alt="Event QR Code" className="w-64 h-64" />
              <Button onClick={downloadQRCode} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}