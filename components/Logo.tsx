export default function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo-ads.png"
      alt="Art Department Studio"
      className={className}
    />
  );
}
