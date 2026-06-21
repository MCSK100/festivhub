export const DoodleBanner = ({ className }) => (
  <svg className={className} viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wedding cake */}
    <path d="M200 300c0 20-10 30-30 30s-30-10-30-30v-100c0-20 10-30 30-30s30 10 30 30v100z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Camera */}
    <path d="M500 250c-20 0-40 10-40 30v40c0 20 20 30 40 30s40-10 40-30v-40c0-20-20-30-40-30z" stroke="currentColor" strokeWidth="3"/>
    {/* Layers */}
    <ellipse cx="500" cy="260" rx="25" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
    {/* DJ turntable */}
    <circle cx="800" cy="250" r="40" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M780 230l10 10m10 -10l-10 10" stroke="currentColor" strokeWidth="3"/>
    {/* Floral arch */}
    <path d="M100 150q50 50 100 0t100 0q50 -50 100 0" stroke="currentColor" strokeWidth="4" fill="none"/>
    <circle cx="150" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
    {/* Balloons */}
    <circle cx="300" cy="80" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
    <path d="M310 100 L310 150" stroke="currentColor" strokeWidth="2"/>
    {/* Professionals doodle */}
    <path d="M900 320 L880 300 L920 280" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="890" cy="290" r="5" fill="currentColor"/>
    {/* Swirl background */}
    <path d="M0 0 Q300 200 600 0 T1200 200" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none"/>
  </svg>
)

export const DoodleIcons = {
  camera: () => <svg className="w-8 h-8" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M23 3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V3zM9 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" strokeWidth="2" strokeLinecap="round"/></svg>,
  catering: () => <svg className="w-8 h-8" viewBox="0 0 24 24" stroke="currentColor" fill="none"><circle cx="9" cy="7" r="3"/><path d="M12 18v-1a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"/><path d="M4 15v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/></svg>,
  decor: () => <svg className="w-8 h-8" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M22 12h-4l-3 9H5l-1 -6H2"/><path d="m9 16 3 -9 4 7 1 -3h5"/></svg>,
  // Add more: dj, photo, etc.
}
