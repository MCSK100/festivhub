import { ShieldCheck, FileText } from 'lucide-react'
import SEO from '../components/common/SEO'

function Block({ id, icon: Icon, title, updated, children }) {
  return (
    <section id={id} className="glass-ios scroll-mt-28 rounded-[28px] p-7 sm:p-10">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1e4137] text-white shadow-lg shadow-[#1e4137]/25">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-xs font-semibold text-[#0b1311]/50">Last updated: {updated}</p>
        </div>
      </div>
      <div className="prose-festiv mt-6 space-y-4 text-[15px] leading-relaxed text-[#0b1311]/70">
        {children}
      </div>
    </section>
  )
}

export default function Policy() {
  return (
    <div className="relative overflow-hidden bg-[#fff7f0] text-[#0b1311]">
      <SEO
        title="Privacy Policy & Terms"
        description="How FestivLink handles your data, and the terms for using the marketplace as a host or vendor."
        path="/policy"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bad6ff]/35 blur-[120px]" />
        <div className="absolute -right-48 top-40 h-[520px] w-[520px] rounded-full bg-[#f3d9c8]/55 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 lg:pt-36">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-[-0.02em] sm:text-5xl">Policies, in plain words.</h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#0b1311]/60">
            No legal maze. Here's what we collect, why, and the rules of the marketplace.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a href="#privacy" className="rounded-full bg-[#0b1311] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">Privacy Policy</a>
            <a href="#terms" className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-bold transition-colors hover:border-[#1e4137] hover:text-[#1e4137]">Terms of Service</a>
          </div>
        </div>

        <div className="mt-10 space-y-5">
          <Block id="privacy" icon={ShieldCheck} title="Privacy Policy" updated="September 2026">
            <p><strong className="text-[#0b1311]">What we collect.</strong> Hosts share event details (name, phone, email, event date and location) when sending a booking enquiry. Vendors share business details, portfolio photos and contact info when creating a listing. We also store standard sign-in data (email, encrypted password) for vendor accounts.</p>
            <p><strong className="text-[#0b1311]">Why.</strong> Enquiry details are shared with the chosen vendor so they can respond to your request. Vendor listings are public so hosts can discover and compare them. We never sell your data.</p>
            <p><strong className="text-[#0b1311]">Photos.</strong> Uploaded images are compressed and stored securely; deleting a photo from your dashboard removes it from our storage.</p>
            <p><strong className="text-[#0b1311]">Cookies & analytics.</strong> We use minimal, privacy-friendly storage (sign-in session only). No advertising trackers.</p>
            <p><strong className="text-[#0b1311]">Your rights.</strong> Vendors can edit or unpublish their profile anytime from Settings. To delete your account and data, write to <strong className="text-[#0b1311]">hello@festivlink.com</strong> and we'll remove it within 7 days.</p>
          </Block>

          <Block id="terms" icon={FileText} title="Terms of Service" updated="September 2026">
            <p><strong className="text-[#0b1311]">For hosts.</strong> Browsing and enquiring is free. FestivLink introduces you to vendors; the final agreement, pricing and service quality are between you and the vendor. Always confirm dates, deliverables and advances directly before paying anyone.</p>
            <p><strong className="text-[#0b1311]">For vendors.</strong> You must provide accurate business information, own the rights to photos you upload (JPG/PNG/WEBP/GIF/AVIF only), and respond to enquiries honestly. Misleading listings, fake reviews or spam can lead to removal. You may unpublish your profile at any time.</p>
            <p><strong className="text-[#0b1311]">Acceptable use.</strong> No unlawful content, no harassment, no scraping or automated abuse (rate limits apply). We may suspend accounts that violate these terms.</p>
            <p><strong className="text-[#0b1311]">Liability.</strong> FestivLink is a marketplace, not a party to your event contract. To the extent permitted by law, our liability is limited to the services we directly provide.</p>
            <p><strong className="text-[#0b1311]">Contact.</strong> Questions about these terms? <strong className="text-[#0b1311]">hello@festivlink.com</strong>, Coimbatore, India.</p>
          </Block>
        </div>
      </div>
    </div>
  )
}
