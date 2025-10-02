// Type declarations for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'camera-controls'?: boolean | string;
          'touch-action'?: string;
          autoplay?: boolean | string;
          ar?: boolean | string;
          'ar-modes'?: string;
          scale?: string;
          'shadow-intensity'?: string;
          'auto-rotate'?: boolean | string;
          'max-camera-orbit'?: string;
          alt?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};