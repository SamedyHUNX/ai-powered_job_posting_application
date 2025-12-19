import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export const NavBar = () => {
  return (
    <div className="sticky top-0 right-0 h-[68px] z-50 hidden md:flex items-center justify-end px-6 bg-gradient-to-b from-black/20 to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </div>
  );
};
