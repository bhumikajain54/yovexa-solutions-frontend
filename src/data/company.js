export const COMPANY_INFO = {
  name: "Yovexa Solutions",

  // Social links are NOT stored here.
  // They are fetched dynamically from the backend SiteSettings API
  // via siteSettingsService and consumed directly by Footer.jsx.

  navLinks: [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Portfolio", href: "/#portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ],

  // Footer company navigation links — these are static internal page anchors (UI configuration),
  // not CMS content. They define the website navigation structure and must remain here.
  footerCompany: [
    { label: "Home", href: "/#hero" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
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
