import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { GitHubMark, Wordmark } from "./github-mark";
import { ThemeSwitcher } from "./theme-switcher";

const navigation = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/project" },
  { label: "Contact", href: "/contact" },
];

const seo = {
  repository: "https://github.com/",
};

const personal = {
  name: "Portfolio",
};

/** Everything a keyboard can reach inside the mobile header. */
const FOCUSABLE = 'a[href], button:not([disabled])';

export function SiteHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);
  const mobileBarRef = useRef(null);
  const mobileNavRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Close the menu on navigation, adjusted during render rather than in an
  // effect so there is no extra commit.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Give the focus back to the button that opened the menu, so a
      // keyboard user never loses their place on the page.
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the menu when it opens, so the next Tab lands on the
  // first link rather than somewhere further down the page.
  useEffect(() => {
    if (!open) return;
    const first = mobileNavRef.current?.querySelector(FOCUSABLE);
    first?.focus();
  }, [open]);

  /**
   * Keep Tab inside the open menu.
   *
   * The mobile menu drops over the page, so tabbing out of it leaves the
   * keyboard user on content they cannot see. The tab stop is the menu
   * button plus everything inside the menu itself.
   */
  const onHeaderKeyDown = (event) => {
    if (!open || event.key !== "Tab") return;
    const targets = [
      ...Array.from(mobileBarRef.current?.querySelectorAll(FOCUSABLE) ?? []),
      ...Array.from(mobileNavRef.current?.querySelectorAll(FOCUSABLE) ?? []),
    ].filter((node) => node.tabIndex >= 0);
    if (targets.length === 0) return;
    const first = targets[0];
    const last = targets[targets.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isActive = (href) => {
    if (href === "/home") {
      return pathname === "/" || pathname === "/home";
    }
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div data-fe-transfer="study1-navbar">
      <header
        onKeyDown={onHeaderKeyDown}
        className="sticky top-0 z-40 border-b border-[var(--color-line,rgba(255,255,255,0.1))] bg-[color-mix(in_oklab,var(--color-paper,#111)_86%,transparent)] backdrop-blur-md text-gray-200"
      >
        <div aria-hidden className="filmstrip h-[5px] w-full opacity-40 bg-gradient-to-r from-amber-500/20 via-amber-400/50 to-amber-500/20" />

        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/home" className="flex items-baseline gap-2" aria-label={`${personal.name} — home`}>
            <Wordmark />
            <span className="mono hidden text-[10px] uppercase tracking-widest text-gray-400 sm:inline">
              template
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  isActive(item.href)
                    ? "text-[var(--color-ink,#fff)]"
                    : "text-gray-400 hover:text-[var(--color-ink,#fff)]"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-px h-[2px] bg-amber-400"
                  />
                )}
              </Link>
            ))}

            <div className="ml-2 flex items-center gap-2">
              <ThemeSwitcher />
              <a
                href={seo.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-700 rounded hover:border-gray-500 transition-colors"
                aria-label="Star this template on GitHub (opens in a new tab)"
              >
                <GitHubMark size={14} />
                <span className="hidden lg:inline">Star</span>
              </a>
            </div>
          </nav>

          <div ref={mobileBarRef} className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center border border-gray-700 rounded bg-black/20 text-gray-200"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-nav" ref={mobileNavRef} className="border-t border-gray-800 md:hidden bg-[#121212]">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-1 sm:px-6" aria-label="Mobile">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-center justify-between border-b border-gray-800 py-3 font-mono text-[11px] uppercase tracking-widest last:border-0"
                >
                  <span className={isActive(item.href) ? "text-amber-400 font-semibold" : "text-gray-300"}>
                    {item.label}
                  </span>
                  <span aria-hidden className="text-gray-500">
                    →
                  </span>
                </Link>
              ))}
              <a
                href={seo.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 font-mono text-[11px] uppercase tracking-widest text-gray-300"
              >
                <GitHubMark size={14} /> Star on GitHub
              </a>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
