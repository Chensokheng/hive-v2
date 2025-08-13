import React from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "../../ui/button";

export default function SearchButton() {
  return (
    <div>
      <Button size={"icon"} className="rounded-full">
        <SearchIcon />
      </Button>
    </div>
  );
}
