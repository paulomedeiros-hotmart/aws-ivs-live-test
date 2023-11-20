export {};

declare global {
    interface Window {
      registerIVSTech: Function
      registerIVSQualityPlugin: Function
      videojs: Function
    }
  }