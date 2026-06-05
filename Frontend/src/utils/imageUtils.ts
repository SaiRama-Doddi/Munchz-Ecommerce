/**
 * Optimizes a Cloudinary image URL by appending auto format (f_auto) and auto quality (q_auto) parameters.
 * If the URL is not a Cloudinary URL or already has optimization params, it returns the URL unchanged.
 */
export function optimizeCloudinaryUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // Check if it's a Cloudinary URL
  if (url.includes("cloudinary.com") && url.includes("/image/upload/")) {
    // Check if it already has f_auto or q_auto to avoid duplicating
    if (!url.includes("f_auto") && !url.includes("q_auto")) {
      return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }
  }
  return url;
}
