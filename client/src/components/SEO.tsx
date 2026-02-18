import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any;
  additionalStructuredData?: any[];
  locality?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords,
  ogImage = "/og-image.jpg",
  ogType = "website",
  structuredData,
  additionalStructuredData,
  locality = "Ganderkesee"
}: SEOProps) {
  const [location] = useLocation();
  const baseUrl = "https://ergo-ganderkesee.replit.app";
  const fullUrl = `${baseUrl}${location}`;

  useEffect(() => {
    document.title = title;

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords || "ERGO Versicherung, Versicherungen, Ganderkesee, Hausrat, Haftpflicht, Wohngebäude, Rechtsschutz, Zahnzusatz");
    
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:type", ogType, "property");
    updateMetaTag("og:url", fullUrl, "property");
    updateMetaTag("og:image", `${baseUrl}${ogImage}`, "property");
    updateMetaTag("og:site_name", "ERGO Versicherung Ganderkesee", "property");
    
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", title, "name");
    updateMetaTag("twitter:description", description, "name");
    updateMetaTag("twitter:image", `${baseUrl}${ogImage}`, "name");
    
    updateLinkTag("canonical", fullUrl);

    updateMetaTag("geo.region", "DE-NI");
    updateMetaTag("geo.placename", locality);

    updateMetaTag("google", "notranslate");
    updateMetaTag("format-detection", "telephone=no");

    document.querySelectorAll('script[data-seo-schema]').forEach(el => el.remove());

    const allSchemas = [
      ...(structuredData ? [structuredData] : []),
      ...(additionalStructuredData || [])
    ];

    allSchemas.forEach((schema, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      script.setAttribute("data-seo-schema", `schema-${index}`);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-seo-schema]').forEach(el => el.remove());
    };
  }, [title, description, keywords, location, fullUrl, ogImage, ogType, structuredData, additionalStructuredData, locality]);

  return null;
}

function updateMetaTag(name: string, content: string, attributeName: string = "name") {
  if (!content) return;
  
  let metaTag = document.querySelector(`meta[${attributeName}="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute(attributeName, name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string) {
  let linkTag = document.querySelector(`link[rel="${rel}"]`);
  
  if (!linkTag) {
    linkTag = document.createElement("link");
    linkTag.setAttribute("rel", rel);
    document.head.appendChild(linkTag);
  }
  
  linkTag.setAttribute("href", href);
}
