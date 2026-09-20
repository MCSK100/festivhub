import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Exact Studio Modular primary button:
 * deep-green pill, light-blue label, arrow circle on each end;
 * on hover the circles trade places (padding slide).
 */
const StudioButton = ({ to, href, children, variant = 'primary', onClick, className = '', type = 'button', disabled = false }) => {
  const cls = `studio-btn${variant === 'beige' ? ' studio-btn--beige' : ''} ${className}`;
  const inner = (
    <>
      <span className="sb-circle sb-circle-left" aria-hidden>
        <ArrowRight className="h-5 w-5" />
      </span>
      <span className="sb-label">{children}</span>
      <span className="sb-circle sb-circle-right" aria-hidden>
        <ArrowRight className="h-5 w-5" />
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} className={`${cls} disabled:opacity-50 disabled:cursor-not-allowed`} onClick={onClick}>
      {inner}
    </button>
  );
};

export default StudioButton;
