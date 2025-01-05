import { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateICSString } from "../utils/calendar";

interface EventQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
}

export function EventQRDialog({ open, onOpenChange, event }: EventQRDialogProps) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    if (open && event) {
      const icsData = generateICSString(event);
      // Use the webcal:// protocol to trigger calendar app
      const calendarUrl = `webcal://${window.location.host}/calendar?data=${encodeURIComponent(icsData)}`;
      
      QRCode.toDataURL(calendarUrl)
        .then(url => setQrCode(url))
        .catch(err => console.error(err));
    }
  }, [open, event]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Event QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to add the event to your calendar
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {qrCode && <img src={qrCode} alt="Event QR Code" className="w-64 h-64" />}
        </div>
      </DialogContent>
    </Dialog>
  );
}