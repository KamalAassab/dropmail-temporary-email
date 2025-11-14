import Script from "next/script";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dropmail.app";

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "dropmail",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description: "Professional temporary email service for privacy protection",
  sameAs: [
    // Add your social media links here
    // "https://twitter.com/dropmail",
    // "https://github.com/dropmail",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["English", "French"],
  },
};

// WebApplication Schema
const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "dropmail",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web",
  url: baseUrl,
  description: "Generate temporary email addresses instantly. No signup required. Protect your privacy with disposable emails.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Instant email generation",
    "Custom username selection",
    "Real-time inbox",
    "Auto-delete after 10 minutes",
    "Multiple domain options",
    "Bilingual support",
    "No registration required",
  ],
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  softwareVersion: "2.0.0",
  inLanguage: ["en-US", "fr-FR"],
};

// FAQPage Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does dropmail work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "dropmail generates temporary email addresses that you can use instantly. These addresses receive emails for 10 minutes before auto-deleting. No registration required!",
      },
    },
    {
      "@type": "Question",
      name: "Is dropmail really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! dropmail is 100% free to use. No hidden fees, no subscriptions, no payment required. Generate unlimited temporary emails anytime.",
      },
    },
    {
      "@type": "Question",
      name: "How long do emails last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "By default, your temporary email lasts for 10 minutes. You can extend this time by clicking the 'Extend' button to add another 10 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I choose my own email address?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can enter a custom username, and we'll add a unique suffix to ensure it works. You can also choose from multiple domains.",
      },
    },
    {
      "@type": "Question",
      name: "Will I receive verification codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Dropmail receives all emails including verification codes, password resets, and newsletters. Check your inbox after signing up.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private and secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We don't store any personal information. Your temporary emails auto-delete after the time expires. Zero trace, complete privacy.",
      },
    },
  ],
};

// BreadcrumbList Schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ],
};

// Service Schema
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Temporary Email Service",
  provider: {
    "@type": "Organization",
    name: "dropmail",
  },
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: baseUrl,
    serviceType: "Online",
  },
  description: "Free temporary email service for privacy protection and spam prevention",
};

export function StructuredData() {
  return (
    <>
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="structured-data-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="structured-data-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}

