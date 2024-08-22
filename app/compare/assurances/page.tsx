// Fjord Config
import fjord from "@/fjord.config";

// Component Imports
import * as Craft from "@/components/craft/layout";
import PostCard from "@/components/content/post-card";
import SecondaryHero from "@/components/sections/secondary-hero";
import ContentGrid from "@/components/content/content-grid";
import CTA from "@/components/sections/cta";
import PaginationWrapper from "@/components/content/pagination-wrapper";
import { Separator } from "@/components/ui/separator";

// Next Imports
import type { Metadata } from "next";

// Data Imports
import { fetchTags, fetchPosts, fetchAssurances } from "@/lib/data";

// Meta Data
export const metadata: Metadata = {
  title: `Blog | ${fjord.site_name}`,
  description: `Read the ${fjord.site_name} blog. ${fjord.site_description}`,
};

export default async function Assuances({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {


  return (
    
    <Craft.Main>
      <Craft.Section>
        <Craft.Container>
          Hello
          
           {/* <AssuranceComparator/> */}
          
        </Craft.Container>
      </Craft.Section>
    </Craft.Main>
  );
}
