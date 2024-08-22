//@ts-nocheck


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
    
   <div className="md:container">
          
                <DataComparator
                  fetchData={ fetchAssurances}
                  title="Comparateur Assurance"
                  placeholder1="Assurance A"
                  placeholder2="Assurance B"
                  />          
                  </div>
       
  );
}
