"use client";

import { useState } from "react";

export type ViewType = "list" | "card";

const useViewTypesTab = () => {
  const [viewType, setViewType] = useState<ViewType>("list");

  const onChangeViewType = () => {
    setViewType((prev) => {
      const nextViewType = prev === "list" ? "card" : "list";

      // localStorage.setItem("viewType", nextViewType);

      return nextViewType;
    });
  };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedViewType = localStorage.getItem("viewType");

  //     if (storedViewType === "list" || storedViewType === "card") {
  //       setViewType(storedViewType);
  //     } else {
  //       setViewType("list");
  //       localStorage.setItem("viewType", "list");
  //     }
  //   }
  // }, []);

  return { viewType, onChangeViewType };
};

export default useViewTypesTab;
