import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import StudioButton from './ui/StudioButton';

/**
 * Header rebuilt exactly like studiomodular.be:
 * - fixed top row: wordmark left, double-circle pill CTA right
 *   (light-blue "Menu" pill below 1440px)
 * - centered frosted pill nav (desktop >= 1440px) with sliding
 *   light-blue indicator behind the hovered / active link
 * - full-screen deep-green circle-reveal overlay menu on smaller screens
 */
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/join', label: 'Contact' },
];

const NavBar = () => {
  const { user, logout, dashboardPath } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const pillRef = useRef(null);
  const itemRefs = useRef({});

  const isDashboard = location.pathname.includes('-dashboard');
  const dark = isDashboard; // dark surfaces -> light header variant

  const links = user ? [...NAV_LINKS, { href: dashboardPath, label: 'Dashboard' }] : NAV_LINKS;
  const ctaTo = user ? dashboardPath : '/join';
  const ctaLabel = user ? 'My dashboard' : 'Start your event';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const moveIndicator = (href) => {
    const el = itemRefs.current[href];
    const pill = pillRef.current;
    if (!el || !pill) return;
    const pillRect = pill.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({ left: rect.left - pillRect.left, width: rect.width, visible: true });
  };

  const showFor = (href) => moveIndicator(href);
  const hideToActive = () => {
    const active = links.find((l) => l.href === location.pathname);
    if (active) moveIndicator(active.href);
    else setIndicator((s) => ({ ...s, visible: false }));
  };

  useLayoutEffect(() => {
    hideToActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* ===== fixed top bar: logo left, CTA / Menu right ===== */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled && !menuOpen
            ? dark
              ? 'bg-[#0a0a12]/85 backdrop-blur-xl'
              : 'bg-[#fff7f0]/85 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[100rem] items-center justify-between px-6 pt-[30px] lg:px-10">
          <Link
            to="/"
            className={`text-[26px] font-black leading-none tracking-tight lg:text-[32px] ${
              dark || menuOpen ? 'text-[#fff7f0]' : 'text-[#1e4137]'
            }`}
          >
            FESTIVLINK
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <span
                className={`hidden text-sm font-medium xl:block ${
                  dark || menuOpen ? 'text-white/60' : 'text-[#0b1311]/60'
                }`}
              >
                {user.name || user.email}
              </span>
            )}
            {/* CTA pill on very wide screens, like theirs */}
            <div className="show-wide">
              <StudioButton to={ctaTo} variant={dark ? 'beige' : 'primary'}>
                {ctaLabel}
              </StudioButton>
            </div>
            {/* Menu trigger below 1440px */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="studio-menu-btn hide-wide"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {/* ===== centered frosted pill nav (desktop) ===== */}
        {!isDashboard && (
          <nav aria-label="Main navigation" className="show-wide pointer-events-none absolute left-1/2 top-[30px] -translate-x-1/2">
            <div
              ref={pillRef}
              onMouseLeave={hideToActive}
              className="frost-pill pointer-events-auto relative flex h-[68px] items-center overflow-hidden"
            >
              {/* sliding indicator */}
              <span
                aria-hidden
                className="absolute top-1/2 h-[52px] -translate-y-1/2 rounded-full bg-[#bad6ff] transition-all duration-300 ease-out"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.visible ? 1 : 0,
                }}
              />
              {links.map((link) => (
                <Link
                  key={link.href}
                  ref={(el) => {
                    if (el) itemRefs.current[link.href] = el;
                  }}
                  to={link.href}
                  onMouseEnter={() => showFor(link.href)}
                  onFocus={() => showFor(link.href)}
                  className={`relative z-10 block px-7 text-[17px] font-medium transition-colors ${
                    dark ? 'text-[#0b1311]' : 'text-[#0b1311]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* ===== full-screen overlay menu ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(142% at 50% 50%)' }}
            exit={{ clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 0.45, ease: 'linear' }}
            className="fixed inset-0 z-40 overflow-hidden bg-[#1e4137]"
          >
            <div className="flex h-full flex-col items-center justify-center overflow-auto px-6 py-28 text-center">
              <nav aria-label="Main navigation">
                <ul className="flex flex-col gap-2">
                  {links.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                    >
                      <Link
                        to={link.href}
                        className="block py-1 text-[clamp(2rem,8vw,4.375rem)] font-semibold leading-tight text-[#fff7f0] transition-colors hover:text-[#bad6ff]"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-12"
              >
                <StudioButton to={ctaTo} variant="beige">
                  {ctaLabel}
                </StudioButton>
              </motion.div>
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 text-sm font-medium text-[#fff7f0]/70 underline underline-offset-4 hover:text-[#fff7f0]"
                >
                  Log out ({user.email})
                </button>
              ) : (
                <p className="mt-6 text-sm text-[#fff7f0]/70">
                  New here?{' '}
                  <Link to="/signup" className="font-semibold text-[#bad6ff] underline underline-offset-4">
                    Create an account
                  </Link>
                </p>
              )}
              <p className="mt-10 text-sm text-[#fff7f0]/50">hello@festivlink.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
