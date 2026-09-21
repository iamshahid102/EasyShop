import Image from 'next/image';

// Intrinsic dimensions of /public/easyshop-logo.png (icon above, wordmark below).
const LOGO_WIDTH = 1703;
const LOGO_HEIGHT = 923;

/**
 * EasyShop brand logo — the icon + "EasyShop" wordmark lockup.
 *
 * The source asset is a dark mark on a transparent background, so it reads
 * perfectly on light surfaces (navbar, auth pages, admin header).
 *
 * On dark surfaces (footer, dark heroes) pass `invert` to flip the mark to
 * solid white with a CSS filter. `brightness-0` zeroes the colour channels and
 * `invert` brings them back to white while the alpha channel is preserved, so
 * no second asset is needed.
 *
 * Size the logo from the call site with a height utility, e.g.
 * `<Logo className="h-[54px] lg:h-[62px]" />` — width follows the aspect ratio.
 */
export default function Logo({
  className = '',
  invert = false,
  priority = false,
  alt = 'EasyShop',
}) {
  return (
    <Image
      src="/easyshop-logo.png"
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      sizes="(max-width: 1024px) 120px, 140px"
      className={`w-auto object-contain ${invert ? 'brightness-0 invert' : ''} ${className}`}
    />
  );
}
