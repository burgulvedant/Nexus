// TEMPORARY PRODUCT HUNT LAUNCH BADGE
// Added: August 25, 2026
// Remove this entire component and its import/render call after the Product Hunt launch promotion ends.
// Do not modify other landing-page sections when removing this badge.

export default function ProductHuntBadge() {
  return (
    <div className="w-full flex justify-center items-center px-4 pt-24 sm:pt-28 pb-2 md:pb-3 relative z-20 -mb-20 sm:-mb-24 md:-mb-28">
      <a
        href="https://www.producthunt.com/products/nexus-36/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-nexus&#0045;36"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md rounded-xl overflow-hidden"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1300254&theme=light"
          alt="Nexus - Verify whether your documentation matches your code | Product Hunt"
          style={{ width: '250px', height: '54px' }}
          width="250"
          height="54"
          className="w-[250px] h-[54px] max-w-full"
        />
      </a>
    </div>
  );
}
