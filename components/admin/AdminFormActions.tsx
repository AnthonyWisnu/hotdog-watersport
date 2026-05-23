interface AdminFormActionsProps {
  children: React.ReactNode;
}

export default function AdminFormActions({ children }: AdminFormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
      {children}
    </div>
  );
}
