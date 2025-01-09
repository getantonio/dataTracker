import { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, IChartApi, SeriesMarker, Time } from 'lightweight-charts';
import { X, Loader2 } from 'lucide-react';
import { Trade } from '../types';

interface TradingChartProps {
  token: string;
  trade: Trade;
  onClose: () => void;
}

export const TradingChart = ({ token, trade, onClose }: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'rgb(24, 24, 27)' },
        textColor: 'rgb(161, 161, 170)',
      },
      grid: {
        vertLines: { color: 'rgba(39, 39, 42, 0.5)' },
        horzLines: { color: 'rgba(39, 39, 42, 0.5)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: 'rgb(39, 39, 42)',
      },
      rightPriceScale: {
        borderColor: 'rgb(39, 39, 42)',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'rgb(34, 197, 94)',
      downColor: 'rgb(239, 68, 68)',
      borderVisible: false,
      wickUpColor: 'rgb(34, 197, 94)',
      wickDownColor: 'rgb(239, 68, 68)',
    });

    const markers: SeriesMarker<Time>[] = [{
      time: trade.timestamp / 1000 as Time,
      position: trade.type === 'buy' ? 'belowBar' : 'aboveBar',
      color: trade.type === 'buy' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
      shape: trade.type === 'buy' ? 'arrowUp' : 'arrowDown',
      text: `${trade.type.toUpperCase()} ${trade.amount}`,
      size: 2,
    }];

    const fetchPriceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${token}&tsym=USDT&limit=168`
        );
        const data = await response.json();

        if (data.Response === 'Error') {
          throw new Error(data.Message);
        }

        const candleData = data.Data.Data.map((d: any) => ({
          time: d.time as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        candlestickSeries.setData(candleData);
        candlestickSeries.setMarkers(markers);

        chart.timeScale().fitContent();
        chart.timeScale().scrollToPosition(
          trade.timestamp / 1000,
          true
        );
      } catch (error) {
        console.error('Error fetching price data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch price data');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [token, trade]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-4xl p-4 m-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-zinc-100">
              {token}/USDT - {new Date(trade.timestamp).toLocaleString()}
            </h3>
            {loading && (
              <Loader2 className="h-4 w-4 text-zinc-500 animate-spin" />
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error ? (
          <div className="h-[400px] flex items-center justify-center text-red-400 text-sm">
            {error}
          </div>
        ) : (
          <div ref={chartContainerRef} />
        )}

        <div className="mt-4 text-xs text-zinc-500">
          Trade Details: {trade.type.toUpperCase()} {trade.amount} @ {trade.price}
        </div>
      </div>
    </div>
  );
}; 