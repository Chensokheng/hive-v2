import { useAddresStore } from "@/store/address";
import { BriefcaseBusiness, Home, Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const addressTypes = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export type TAddressType = keyof typeof addressTypes;

export default function SavedAddress() {
  const setSavedAddressModal = useAddresStore(
    (state) => state.setSavedAddressModal
  );

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-base font-semibold">Saved Address</h3>

      <div className="space-y-3">
        {/* Add Home Address */}
        <button
          onClick={() => setSavedAddressModal("home")}
          className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Home className="h-4 w-4 text-primary" strokeWidth={2.5} />
            <span className="text-primary font-medium">Add Home Address</span>
          </div>
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </button>
        <Separator className="mb-0" />

        {/* Add Work Address */}
        <button
          onClick={() => setSavedAddressModal("work")}
          className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <BriefcaseBusiness
              className="h-4 w-4 text-primary"
              strokeWidth={2.5}
            />
            <span className="text-primary font-medium">Add Work Address</span>
          </div>
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </button>
        <Separator className="mb-0" />

        {/* Add Other Address */}
        <button
          onClick={() => setSavedAddressModal("other")}
          className="flex items-center gap-3 w-full mb-0 p-4 hover:bg-primary/10 transition-colors text-left"
        >
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-primary font-semibold">Add Other Address</span>
        </button>
      </div>
    </div>
  );
}
