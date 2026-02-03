/**
 * GenerateAvatar - Utility to generate user avatars
 * Can be used with services like ui-avatars.com or generate custom initials
 */

export interface AvatarConfig {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Generate an avatar URL using the UI Avatars service
 */
export function generateAvatarUrl(config: AvatarConfig): string {
  const {
    name,
    size = 128,
    backgroundColor = "0ea5b7",
    textColor = "ffffff",
  } = config;

  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${backgroundColor}&color=${textColor}`;
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
