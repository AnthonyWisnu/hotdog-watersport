import { ArrowDown, ArrowUp } from "lucide-react";

interface MoveOrderButtonsProps {
  moveUpAction: NonNullable<
    React.ButtonHTMLAttributes<HTMLButtonElement>["formAction"]
  >;
  moveDownAction: NonNullable<
    React.ButtonHTMLAttributes<HTMLButtonElement>["formAction"]
  >;
  disableUp?: boolean;
  disableDown?: boolean;
  className?: string;
}

export default function MoveOrderButtons({
  moveUpAction,
  moveDownAction,
  disableUp = false,
  disableDown = false,
  className = "",
}: MoveOrderButtonsProps) {
  const buttonClass =
    "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        type="submit"
        formAction={moveUpAction}
        disabled={disableUp}
        className={buttonClass}
        aria-label="Move item up"
      >
        <ArrowUp aria-hidden="true" size={15} />
        Move Up
      </button>
      <button
        type="submit"
        formAction={moveDownAction}
        disabled={disableDown}
        className={buttonClass}
        aria-label="Move item down"
      >
        <ArrowDown aria-hidden="true" size={15} />
        Move Down
      </button>
    </div>
  );
}
