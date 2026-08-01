import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  useEffect,
  useState
} from "react";

const NAVIGATION_EVENT = "app:navigate";

function currentAddress(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function navigate(path: string): void {
  const destination = new URL(path, window.location.href);

  if (destination.origin !== window.location.origin) {
    window.location.assign(destination.href);
    return;
  }

  const nextAddress = `${destination.pathname}${destination.search}${destination.hash}`;
  if (nextAddress === currentAddress()) return;

  window.history.pushState({}, "", nextAddress);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
}

export function usePathname(): string {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", updatePathname);
    window.addEventListener(NAVIGATION_EVENT, updatePathname);
    return () => {
      window.removeEventListener("popstate", updatePathname);
      window.removeEventListener(NAVIGATION_EVENT, updatePathname);
    };
  }, []);

  return pathname;
}

interface AppLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

export function AppLink({
  href,
  onClick,
  target,
  ...props
}: AppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (target && target !== "_self") ||
      event.currentTarget.hasAttribute("download")
    ) {
      return;
    }

    const destination = new URL(event.currentTarget.href);
    if (destination.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(destination.href);
  }

  return (
    <a {...props} href={href} target={target} onClick={handleClick} />
  );
}
