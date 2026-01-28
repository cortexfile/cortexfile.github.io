import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      fog: any;
      group: any;
    }
  }
}
