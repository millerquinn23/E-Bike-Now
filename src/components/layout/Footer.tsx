export function Footer() {
  return (
    <footer className="py-4 px-4 shrink-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} eBikeNow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
