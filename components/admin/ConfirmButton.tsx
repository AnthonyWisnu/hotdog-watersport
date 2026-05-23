"use client";

interface ConfirmButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  message: string;
}

export default function ConfirmButton({
  message,
  onClick,
  ...props
}: ConfirmButtonProps) {
  return (
    <button
      {...props}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    />
  );
}
