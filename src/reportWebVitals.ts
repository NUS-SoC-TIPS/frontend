import {
  CLSMetric,
  FCPMetric,
  FIDMetric,
  LCPMetric,
  TTFBMetric,
} from 'web-vitals';

const reportWebVitals = (
  onPerfEntry?: (
    metric: CLSMetric | FIDMetric | FCPMetric | LCPMetric | TTFBMetric,
  ) => void,
): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
