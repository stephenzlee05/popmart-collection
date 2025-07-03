import { getCatalog } from '@/services/catalogService';

export const generatePopMartURL = (character: string, series: string): string => {
  const catalog = getCatalog();
  const seriesData = catalog.seriesData[series];
  
  if (seriesData && seriesData.popmartUrl) {
    return seriesData.popmartUrl;
  }
  // Default PopMart URL if not found
  return 'https://www.popmart.com/';
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
  // Default StockX URL if not found
  return 'https://stockx.com/';
};

export const getImageUrl = (imageId: string): string => {
  // Check if it's already a full URL
  if (imageId.startsWith('http')) {
    return imageId;
  }
  
  // Default placeholder image
  return '/LABUBU_240x240.avif';
};
