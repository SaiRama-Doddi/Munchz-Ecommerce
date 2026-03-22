import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

/**
 * Custom hook to update document metadata for SEO.
 * This is a zero-dependency alternative to react-helmet.
 */
export const useSEO = ({ title, description, keywords }: SEOProps) => {
  useEffect(() => {
    // 🏷️ Update Title
    const fullTitle = title ? `${title} | GoMunchZ` : "GoMunchZ | Premium Snacks & Dry Fruits";
    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }

    // 📄 Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 🗝️ Update Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);
};
