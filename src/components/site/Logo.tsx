import Image from 'next/image'

// Brand logo — the AIPEA app icon, used everywhere on the site and as the
// favicon (src/app/icon.png). Source: /public/logo/icon.png, a 1024×1024
// square asset. Same file drives the browser-tab favicon so the mark stays
// consistent across the site and the tab.
export function Logo({
  height = 30,
  priority = false,
}: {
  height?: number
  priority?: boolean
}) {
  // icon.png is square (1:1).
  const width = height
  return (
    <Image
      src="/logo/icon.png"
      alt="AIPEA — Africa Institute of Personal & Executive Assistants"
      width={width}
      height={height}
      priority={priority}
      style={{ display: 'block', width: 'auto', height }}
    />
  )
}
