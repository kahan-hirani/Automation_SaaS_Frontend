import { Link } from 'react-router-dom';
import { Bot, Github, Linkedin, ExternalLink, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const footerLinks = [
  {
    heading: 'Product',
    items: [
      { label: 'Automations', to: '/' },
      { label: 'Logs', to: '/logs' },
      { label: 'Metrics', to: '/metrics' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Status Page', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-auto border-t border-white/8 bg-black/60 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">

        {/* Top row: brand + links */}
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white text-black shadow-[0_8px_20px_rgba(255,255,255,0.06)] transition duration-300 group-hover:-translate-y-0.5">
                <Bot className="h-5 w-5" />
              </div>
              <span className="font-display text-xl tracking-[0.08em] text-white">
                Automation SaaS
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-7 text-zinc-500">
              Scheduled URL monitoring and automated web-execution checks — built for clarity and control.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/kahan-hirani"
                target='_blank'
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-white/30 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/kahan-hirani-7934b92ab/"
                target='_blank'
                aria-label="Linkedin"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-white/30 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://kahan-hirani.github.io/"
                target='_blank'
                aria-label="External site"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-white/30 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map(({ heading, items }) => (
              <div key={heading}>
                <p className="section-kicker mb-5">{heading}</p>
                <ul className="flex flex-col gap-3">
                  {items.map(({ label, to, href }) => (
                    <li key={label}>
                      {to ? (
                        <Link
                          to={to}
                          className="text-sm text-zinc-500 transition hover:text-white"
                        >
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={href}
                          className="text-sm text-zinc-500 transition hover:text-white"
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hairline my-8" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {year} Automation SaaS. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-zinc-600">
            Built with
            <Heart className="h-3 w-3 fill-zinc-600 text-zinc-600" />
            using Node.js, React &amp; BullMQ
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
