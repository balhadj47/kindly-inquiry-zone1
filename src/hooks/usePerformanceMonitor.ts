import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

const performanceLog: PerformanceMetrics[] = [];
const MAX_LOG_SIZE = 100;

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    renderCountRef.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;
    
    // Log slow renders (>16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    // Store metrics
    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };

    performanceLog.push(metrics);
    
    // Keep log size manageable
    if (performanceLog.length > MAX_LOG_SIZE) {
      performanceLog.shift();
    }
  });

  const getMetrics = useCallback(() => {
    return {
      renderCount: renderCountRef.current,
      averageRenderTime: performanceLog
        .filter(log => log.componentName === componentName)
        .reduce((sum, log, _, arr) => sum + log.renderTime / arr.length, 0)
    };
  }, [componentName]);

  return { getMetrics };
};

export const getPerformanceReport = () => {
  const componentStats = performanceLog.reduce((acc, log) => {
    if (!acc[log.componentName]) {
      acc[log.componentName] = {
        count: 0,
        totalTime: 0,
        maxTime: 0,
        slowRenders: 0
      };
    }
    
    const stats = acc[log.componentName];
    stats.count += 1;
    stats.totalTime += log.renderTime;
    stats.maxTime = Math.max(stats.maxTime, log.renderTime);
    
    if (log.renderTime > 16) {
      stats.slowRenders += 1;
    }
    
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(componentStats).map(([name, stats]) => ({
    componentName: name,
    renderCount: stats.count,
    averageRenderTime: stats.totalTime / stats.count,
    maxRenderTime: stats.maxTime,
    slowRenderPercentage: (stats.slowRenders / stats.count) * 100
  }));
};
