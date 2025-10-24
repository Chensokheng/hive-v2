import { useEffect, useState } from "react";
import { getOutletInfo } from "@/services/outlet/get-outlet-info";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletInfo(
  merchantName?: string,
  outletName?: string,
  latitude?: number | null,
  longitude?: number | null
) {
  const [resolvedMerchantName, setResolvedMerchantName] = useState<string>("");
  const [resolvedOutletName, setResolvedOutletName] = useState<string>("");

  // Resolve merchant name from params or localStorage
  useEffect(() => {
    if (merchantName) {
      setResolvedMerchantName(merchantName);
    } else if (typeof window !== "undefined") {
      const lastSelectedMerchant = localStorage.getItem("lastSelectedMerchant");
      if (lastSelectedMerchant) {
        setResolvedMerchantName(lastSelectedMerchant);
      }
    }
  }, [merchantName]);

  // Resolve outlet name from params or localStorage
  useEffect(() => {
    if (outletName) {
      setResolvedOutletName(outletName);
    } else if (typeof window !== "undefined") {
      const lastSelectedOutletName = localStorage.getItem(
        "lastSelectedOutletName"
      );
      if (lastSelectedOutletName) {
        setResolvedOutletName(lastSelectedOutletName);
      }
    }
  }, [outletName]);

  return useQuery({
    queryKey: [
      "merchant",
      resolvedMerchantName,
      resolvedOutletName,
      latitude,
      longitude,
    ],
    queryFn: () =>
      getOutletInfo({
        merchantName: resolvedMerchantName,
        outletName: resolvedOutletName,
        latitude: latitude || null,
        longitude: longitude || null,
      }),
    enabled: !!resolvedMerchantName && !!resolvedOutletName,
  });
}
