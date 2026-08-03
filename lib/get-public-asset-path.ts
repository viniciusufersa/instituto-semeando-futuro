const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function getPublicAssetPath(assetPath: string): string {
  if (!assetPath.startsWith("/") || assetPath.startsWith("//")) {
    return assetPath;
  }

  return `${publicBasePath}${assetPath}`;
}
