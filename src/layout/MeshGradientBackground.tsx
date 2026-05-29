export function MeshGradientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-[#f8d4e8]/30 blur-[120px]" />
      <div className="absolute left-1/2 top-[-80px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#f5f0c8]/30 blur-[120px]" />
      <div className="absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-[#d4e8f8]/30 blur-[120px]" />
    </div>
  );
}
