import { getCatalog } from '@/services/catalogService';

export const generatePopMartURL = (character: string, series: string): string => {
  const catalog = getCatalog();
  const seriesData = catalog.seriesData[series];
  
  if (seriesData && seriesData.popmartUrl) {
    return seriesData.popmartUrl;
  }
  
  // Fallback to old hardcoded method if not found in catalog
  const seriesMap: { [key: string]: string } = {
    // Labubu series
    "Big Into Energy": "195",
    "Have A Seat": "196", 
    "Exciting Macaron": "197",
    
    // Skull Panda series
    "Baby Series": "198",
    "Everyday": "199",
    "Music Series": "200",
    
    // Molly series
    "Career Series": "201",
    "Zodiac Series": "202", 
    "Sweet Dreams": "203",
    
    // Pucky series
    "Forest Fairies": "204",
    "Space Babies": "205",
    "Milk Bottle": "206"
  };
  
  const seriesId = seriesMap[series] || "195";
  return `https://www.popmart.com/us/pop-now/set/${seriesId}`;
};

export const generateStockXURL = (character: string, series: string, item: string): string => {
  const catalog = getCatalog();
  const itemsInSeries = catalog.itemsBySeries[series];
  
  if (itemsInSeries) {
    const foundItem = itemsInSeries.find(i => i.name === item);
    if (foundItem && foundItem.stockXUrl) {
      return foundItem.stockXUrl;
    }
  }
  
  // Fallback to generated URL if not found in catalog
  // Convert to URL-friendly format
  const formatForURL = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
  
  const characterSlug = formatForURL(character);
  const seriesSlug = formatForURL(series);
  const itemSlug = formatForURL(item);
  
  // StockX URL pattern: stockx.com/pop-mart-{character}-{series}-{item}-vinyl-plush-pendant
  return `https://stockx.com/pop-mart-${characterSlug}-the-monsters-${seriesSlug}-series-${itemSlug}-vinyl-plush-pendant`;
};

export const getImageUrl = (imageId: string): string => {
  // Check if it's already a full URL
  if (imageId.startsWith('http')) {
    return imageId;
  }
  
  // Check if it's an Unsplash photo ID
  if (imageId.startsWith('photo-')) {
    return `https://images.unsplash.com/${imageId}?w=400&h=400&fit=crop`;
  }
  
  // Return as is if it's already a full URL or other format
  return imageId;
};
