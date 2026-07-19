export function Alert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-full border border-[#E2231A]/30 bg-[#F9E1D7] px-4 py-2 text-center font-mono text-xs text-[#E2231A]"
    >
      {message}
    </div>
  );
}
