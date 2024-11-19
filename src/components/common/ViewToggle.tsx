import { ViewType } from "@/hooks/useViewTypesTab";
import { cn } from "@/utils/utils";
import { AlignLeft, Grid2x2 } from "lucide-react";

interface ViewToggleProps {
  viewType: ViewType;
  onChangeViewType: () => void;
}

const ViewToggle = ({ viewType, onChangeViewType }: ViewToggleProps) => {
  return (
    <section className="flex justify-end">
      <article
        className="flex w-20 h-10 bg-foreground rounded cursor-pointer"
        onClick={onChangeViewType}
      >
        <div className="p-1 w-full relative flex">
          <div
            className={cn(
              "w-9 h-8 bg-background rounded absolute transition",
              viewType === "list" ? "translate-x-0" : "translate-x-[36px]"
            )}
          />
          <span className="relative z-10 flex justify-center items-center flex-1">
            <AlignLeft
              className={
                viewType === "list"
                  ? "dark:stroke-foreground stroke-background"
                  : "dark:stroke-background stroke-foreground"
              }
            />
          </span>
          <span className="relative z-10 flex justify-center items-center flex-1">
            <Grid2x2
              className={
                viewType === "card"
                  ? "dark:stroke-foreground stroke-background"
                  : "dark:stroke-background stroke-foreground"
              }
            />
          </span>
        </div>
      </article>
    </section>
  );
};

export default ViewToggle;
