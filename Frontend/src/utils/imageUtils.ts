export function optimizeCloudinaryUrl(url: string | null | undefined, width?: number): string {
  if (!url) return "";
  
  // Check if it's a Cloudinary URL
  if (url.includes("cloudinary.com") && url.includes("/image/upload/")) {
    // Remove existing basic transformations if present to avoid nesting duplicates
    let cleanUrl = url;
    cleanUrl = cleanUrl.replace(/\/image\/upload\/f_auto,q_auto[^\/]*\//, "/image/upload/");
    cleanUrl = cleanUrl.replace(/\/image\/upload\/f_auto,q_auto,w_\d+(?:,c_scale)?\//, "/image/upload/");
    cleanUrl = cleanUrl.replace(/\/image\/upload\/w_\d+(?:,c_scale)?,f_auto,q_auto\//, "/image/upload/");
    
    // Construct new transformation params
    const params = ["f_auto", "q_auto"];
    if (width) {
      params.push(`w_${width}`);
      params.push("c_scale");
    }
    
    const transformStr = params.join(",");
    return cleanUrl.replace("/image/upload/", `/image/upload/${transformStr}/`);
  }
  return url;
}
