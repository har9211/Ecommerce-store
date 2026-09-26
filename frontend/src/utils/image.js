import { SERVER_URL } from "../api/axios";

// Product images can be either a full external URL (https://...) or a path
// to a file uploaded through the admin panel (/uploads/xyz.jpg). This makes
// sure both display correctly no matter which one was used.
export function resolveImageUrl(image) {
  if (!image) return "";
  const normalizedImage = image.replaceAll("\\", "/");
  if (normalizedImage.startsWith("http://") || normalizedImage.startsWith("https://")) {
    return normalizedImage;
  }
  return `${SERVER_URL}/${normalizedImage.replace(/^\/+/, "")}`;
}
