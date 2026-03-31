export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground/10">
              <span className="text-xs font-bold text-foreground/70">D</span>
            </div>
            <span className="text-sm font-semibold">
              Derma<span className="text-foreground/50">Diff</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            KCV (Komputasi Cerdas dan Visi) Lab Assistant Selection &middot;
            Institut Teknologi Sepuluh Nopember &middot; March 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
