export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-primary text-primary-foreground py-6 md:py-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-xs sm:text-sm leading-loose text-primary-foreground/80 md:text-left">
          Data provided by{' '}
          <a
            href="https://www.espn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-accent"
          >
            ESPN
          </a>
        </p>
        <p className="text-center text-xs sm:text-sm text-primary-foreground/80 md:text-right">
          NFL Stats App
        </p>
      </div>
    </footer>
  );
}
