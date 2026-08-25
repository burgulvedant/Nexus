// TEMPORARY PRODUCT HUNT LAUNCH BADGE
// Added: August 25, 2026
// Remove this entire component and its import/render call after the Product Hunt launch promotion ends.
// Do not modify other landing-page sections when removing this badge.

export default function ProductHuntBadge() {
  return (
    <div className="w-full flex justify-center items-center px-4 -mt-2 sm:-mt-3 md:-mt-4 mb-8 sm:mb-10 md:mb-12 relative z-20">
      <a
        href="https://www.producthunt.com/products/nexus-36?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-nexus-ef1a9ad3-a197-4589-9d6e-01d68a58749c"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md rounded-xl overflow-hidden"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1230891&theme=light&t=1787647577526"
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
