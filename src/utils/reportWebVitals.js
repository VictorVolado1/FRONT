import * as webVitals from 'web-vitals';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    webVitals.onCLS(onPerfEntry);
    webVitals.onFID(onPerfEntry);
    webVitals.onLCP(onPerfEntry);
    webVitals.onFCP(onPerfEntry);
    webVitals.onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
