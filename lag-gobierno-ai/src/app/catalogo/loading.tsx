export default function CatalogoLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-[#F5F7F0] rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-lg bg-[#F5F7F0] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
