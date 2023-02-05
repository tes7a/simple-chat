/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // eslint-disable-next-line object-curly-newline
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
