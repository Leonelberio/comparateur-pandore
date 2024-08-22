//@ts-nocheck


import fjord from "@/fjord.config";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseText(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Récupère le texte sans les balises HTML
  const text = doc.body.textContent || '';

  // Récupère les éléments <br> et remplace-les par des sauts de ligne
  const lineBreaks = [];
  const brElements = doc.getElementsByTagName('br');

  // Collecte les sections de texte entre les <br>
  let lastIndex = 0;
  for (let br of brElements) {
    const precedingText = text.substring(lastIndex, br.previousSibling.textContent.length);
    lineBreaks.push(precedingText.trim());
    lastIndex = br.previousSibling.textContent.length;
  }

  // Ajoute le reste du texte après le dernier <br>
  lineBreaks.push(text.substring(lastIndex).trim());

  return lineBreaks.filter(line => line); // Filtrer les lignes vides
}




export function formatMachineNames(text: string, specialCases: Record<string, string> = {}): string {
  // Check if the text matches a special case, and return the mapped value if it does
  if (specialCases[text]) {
    return specialCases[text];
  }

  // Replace underscores and hyphens with spaces
  let readableText = text.replace(/[_-]/g, " ");

  // Capitalize the first letter of each word
  readableText = readableText.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return readableText;
}




interface DataOption {
  id: number;
  title: string;
  image?: string;
  content?: string;
  date?: string;
  [key: string]: any; // To allow additional dynamic properties
}

interface FetchDataProps {
  endpoint: string;
  sortByDate?: boolean; // Optional: Sort data by date if needed
  embedImages?: boolean; // Optional: Embed images if needed
}


export async function fetchData({
  endpoint,
  sortByDate = false,
  embedImages = false,
}: FetchDataProps): Promise<{ data: DataOption[]; totalItems: number }> {
  const embedQuery = embedImages ? "?_embed" : "";
  const res = await fetch(
    `${fjord.wordpress_url}/wp-json/wp/v2/${endpoint}${embedQuery}`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const rawData: any[] = await res.json();
  const totalItems = Number(res.headers.get("X-WP-Total"));

  let data: DataOption[] = rawData.map((item) => ({
    id: item.id,
    title: item.title?.rendered || "",
    image: item._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url,
    content: item.content?.rendered || "",
    date: item.date,
    acf: item.acf
  }));

  // Optionally sort data by date if the sortByDate flag is set to true
  if (sortByDate) {
    data.sort(
      (a: DataOption, b: DataOption) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
  }

  return { data, totalItems };
}
