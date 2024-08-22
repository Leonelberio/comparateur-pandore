// Fjord Config
import fjord from "@/fjord.config";

// Component Imports
import * as Craft from "@/components/craft/layout";


// Next Imports
import type { Metadata } from "next";

// Data Imports
import {  DataComparator } from "@/components/compare/data-comparator";
import { fetchAssurances } from "@/lib/data";

// Meta Data
export const metadata: Metadata = {
  title: `Comparateur | ${fjord.site_name}`,
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
          
                <DataComparator
                  fetchData={ fetchAssurances}
                  title="Assurances"
                  placeholder1="Assurance A"
                  placeholder2="Assurance B"
            />          
        </Craft.Container>
      </Craft.Section>
    </Craft.Main>
  );
}
