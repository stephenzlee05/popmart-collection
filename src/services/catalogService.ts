import catalogData from '@/data/catalog-data.json';

export interface CatalogData {
  characters: string[];
  seriesByCharacter: { [key: string]: string[] };
  itemsBySeries: { [key: string]: { name: string; imageId: string; stockXUrl?: string }[] };
  seriesData: { [key: string]: { name: string; character: string; popmartUrl: string } };
}

export const getCatalog = (): CatalogData => {
  // Transform JSON data into the format expected by the frontend
  const catalog: CatalogData = {
    characters: [],
    seriesByCharacter: {},
    itemsBySeries: {},
    seriesData: {}
  };
  
  // Extract characters
  catalog.characters = catalogData.characters.map(char => char.name);
  
  // Build seriesByCharacter and seriesData
  catalogData.series.forEach(series => {
    if (!catalog.seriesByCharacter[series.character]) {
      catalog.seriesByCharacter[series.character] = [];
    }
    catalog.seriesByCharacter[series.character].push(series.name);
    
    // Store series data for URL generation
    catalog.seriesData[series.name] = {
      name: series.name,
      character: series.character,
      popmartUrl: series.popmartUrl || ""
    };
  });
  
  // Build itemsBySeries
  catalogData.items.forEach(item => {
    if (!catalog.itemsBySeries[item.series]) {
      catalog.itemsBySeries[item.series] = [];
    }
    catalog.itemsBySeries[item.series].push({ 
      name: item.name, 
      imageId: item.imageUrl,
      stockXUrl: item.stockXUrl
    });
  });
  
  return catalog;
}; 