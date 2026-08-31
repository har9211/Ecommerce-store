import { SERVER_URL } from "../api/axios";

// Product images can be either a full external URL (https://...) or a path
// to a file uploaded through the admin panel (/uploads/xyz.jpg). This makes
// sure both display correctly no matter which one was used.
export function resolveImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${SERVER_URL}${image}`;
}
