const getCryptoData = async (coin) => {
 
  const response = await fetch(
      `${process.env.COINGECKO_API_URL}?ids=${coin}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`
    );
  
    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `CoinGecko error: ${response.status} ${errorText}`
      );
    }
  
    const data = await response.json();
  
    if (!data[coin]) {
      throw new Error("Cryptocurrency not found");
    }
  
    return {
      coin,
      price: data[coin].usd,
      change24h: data[coin].usd_24h_change,
      volume24h: data[coin].usd_24h_vol,
    };
  };
  
  module.exports = { getCryptoData };