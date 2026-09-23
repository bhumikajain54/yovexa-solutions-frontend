export const COMPANY_INFO = {
  name: "Yovexa Solutions",

  // Social links are NOT stored here.
  // They are fetched dynamically from the backend SiteSettings API
  // via siteSettingsService and consumed directly by Footer.jsx.

  navLinks: [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Process", href: "/#process" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  footerCompany: [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Process", href: "/#process" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  footerServices: [
    { label: "Web Development", href: "#services" },
    { label: "Mobile App Development", href: "#services" },
    { label: "Custom Software", href: "#services" },
    { label: "UI/UX Design", href: "#services" },
    { label: "API & Backend Development", href: "#services" },
    { label: "Business Automation", href: "#services" },
  ]
};
