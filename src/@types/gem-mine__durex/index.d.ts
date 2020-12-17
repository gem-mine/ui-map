declare module '@gem-mine/durex' {
  interface DurexConfig {
    reducers?: {};
    middlewares?: [];
  }
  interface Model {
    name: string;
    state: any;
    reducers?: any;
    effects?: any;
  }
  export const actions: any
  export const smart: any
  export const render: any
  export const defaults: (config: DurexConfig) => void
  export const model: (config: Model) => void
  export const getState: () => any
}
