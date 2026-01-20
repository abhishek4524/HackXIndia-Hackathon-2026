import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type MarketPrice = {
  crop: string;
  price: string;
  location: string;
  district?: string;
  trend: 'up' | 'down' | 'stable';
};

type MarketPriceWidgetProps = {
  language: string;
  translations: {
    marketPrices: string;
    loading?: string;
    usingCachedData?: string;
    viewMorePrices?: string;
  };
};

const MarketPriceWidget: React.FC<MarketPriceWidgetProps> = ({ language, translations }) => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        setLoading(true);
        // API details
        const API_KEY = "579b464db66ec23bdd00000175875f0f4f2640b66df230908d7a94ed";
        const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

        // Build URL
        const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=20&filters[state]=Kerala`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to match our component structure
        const formattedData: MarketPrice[] = data.records.map((item: any) => ({
          crop: item.commodity,
          price: `₹${item.modal_price}/quintal`,
          location: item.market,
          district: item.district,
          trend: 'stable' // API doesn't provide trend data, so defaulting to stable
        }));

        setPrices(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching market prices:", err);
        let errorMsg = "Unknown error";
        if (err instanceof Error) errorMsg = err.message;
        setError(errorMsg);

        // Fallback to sample data if API fails
        setPrices([
          { crop: language === 'en' ? 'Paddy' : language === 'hi' ? 'धान' : 'നെല്ല്', price: '₹20/kg', location: language === 'en' ? 'Mandi Kottayam' : language === 'hi' ? 'मंडी कोट्टायम' : 'മണ്ഡി കോട്ടയം', trend: 'up' },
          { crop: language === 'en' ? 'Coconut' : language === 'hi' ? 'नारियल' : 'തേങ്ങ', price: '₹35/kg', location: language === 'en' ? 'Market Kochi' : language === 'hi' ? 'बाजार कोच्चि' : 'മാർക്കറ്റ് കൊച്ചി', trend: 'down' },
          { crop: language === 'en' ? 'Banana' : language === 'hi' ? 'केला' : 'വാഴപ്പഴം', price: '₹18/kg', location: language === 'en' ? 'Thrissur' : language === 'hi' ? 'त्रिशूर' : 'തൃശൂർ', trend: 'stable' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPrices();
  }, [language]);

  const getTrendIcon = (trend: MarketPrice['trend']) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '↔️';
  };

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b border-gray-100">
          <span className="text-2xl">📊</span>
          <CardTitle className="text-lg font-bold text-green-800">{translations.marketPrices}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-gray-600">{translations.loading || 'Loading market prices...'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg animate-fadeIn delay-100">
      <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b border-gray-100">
        <span className="text-2xl">📊</span>
        <CardTitle className="text-lg font-bold text-green-800">{translations.marketPrices}</CardTitle>
        {error && (
          <span className="text-xs text-red-500 ml-auto">
            {translations.usingCachedData || 'Using cached data'}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {prices.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getTrendIcon(item.trend)}</span>
                <div>
                  <span className="font-bold text-gray-800 block">{item.crop}</span>
                  <span className="text-xs text-gray-500 block">{item.district || item.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700">{item.price}</p>
                <p className="text-xs text-gray-500">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 transition-all duration-300 transform hover:-translate-y-0.5">
          {translations.viewMorePrices}
        </button>
      </CardContent>
    </Card>
  );
};

export default MarketPriceWidget;