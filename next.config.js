const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    domains: ['assurances.comparateur.africa'], // Add the domain here
  },
  // Optionally, add any other Next.js config below
};

module.exports = withMDX(nextConfig);
