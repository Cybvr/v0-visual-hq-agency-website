/** A separate output directory lets demo-emulator verification run beside dev. */
const nextConfig = {
  distDir: process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "true" ? ".next-portal-test" : ".next",
}
export default nextConfig
