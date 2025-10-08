import * as React from "react";
import { useOutletStore } from "@/store/outlet";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PickUpOption = "specific" | "asap";

export default function PickUpTime({
  children,
}: {
  children: React.ReactNode;
}) {
  const setPickupTime = useOutletStore((state) => state.setPickupTime);

  const [selectedOption, setSelectedOption] =
    React.useState<PickUpOption>("asap");

  // Get current date and time
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const currentTime = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS

  const [selectedDate, setSelectedDate] = React.useState(currentDate);
  const [selectedTime, setSelectedTime] = React.useState(currentTime);

  // Combine date and time to get timestamp
  const pickupTimestamp = React.useMemo(() => {
    if (selectedOption === "asap") {
      return Date.now(); // Current timestamp for ASAP
    }

    if (selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}`;
      return new Date(dateTimeString).getTime();
    }

    return null;
  }, [selectedOption, selectedDate, selectedTime]);

  return (
    <Dialog>
      <DialogTrigger asChild id="pick-up-dialog">
        {children}
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-md">
        <DialogHeader>
          <DialogTitle>Please Select Date</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {/* Pick up specific date/time option */}
          <div
            className={cn(
              "flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors",
              selectedOption === "specific" && "bg-primary/5"
            )}
            onClick={() => setSelectedOption("specific")}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 grid place-content-center transition-colors",
                selectedOption === "specific"
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 bg-white"
              )}
            >
              {selectedOption === "specific" && <Check className="h-3 w-3" />}
            </div>
            <p className="font-medium">Pick up</p>
          </div>

          <div
            className={cn(
              "flex gap-5 items-start border p-4 rounded-md transition-opacity",
              selectedOption !== "specific" && "opacity-50"
            )}
          >
            <div className="flex gap-4 flex-col lg:flex-row w-full">
              <div className="flex flex-col gap-3 flex-1">
                <Label htmlFor="date-picker" className="px-1">
                  Date
                </Label>
                <Input
                  type="date"
                  id="date-picker"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={selectedOption !== "specific"}
                  className="disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <Label htmlFor="time-picker" className="px-1">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time-picker"
                  step="1"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={selectedOption !== "specific"}
                  className="disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* As soon as possible option */}
          <div
            className={cn(
              "flex gap-5 items-center rounded-md cursor-pointer p-2 transition-colors",
              selectedOption === "asap" && "bg-primary/5"
            )}
            onClick={() => setSelectedOption("asap")}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 grid place-content-center transition-colors",
                selectedOption === "asap"
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 bg-white"
              )}
            >
              {selectedOption === "asap" && <Check className="h-3 w-3" />}
            </div>
            <span className="font-medium">As soon as Possible</span>
          </div>
          <Button
            className="w-full rounded-full mt-5"
            onClick={() => {
              setPickupTime(pickupTimestamp);
              document.getElementById("pick-up-dialog")?.click();
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
