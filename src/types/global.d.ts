/// <reference types="node" />

declare module '@providers' {
  export * from './providers';
}

declare module '@components' {
  export * from './components';
}

declare module '@components/*' {
  const content: any;
  export default content;
}

declare module '@pages' {
  export * from './pages';
}

declare module '@pages/*' {
  const content: any;
  export default content;
}

declare module '@hooks' {
  export * from './hooks';
}

declare module '@hooks/*' {
  const content: any;
  export default content;
}

declare module '@utils' {
  export * from './utils';
}

declare module '@utils/*' {
  const content: any;
  export default content;
}

declare module '@styles' {
  const content: any;
  export default content;
}

declare module '@styles/*' {
  const content: any;
  export default content;
}

declare module '@themes' {
  export * from './themes';
}

declare module '@themes/*' {
  const content: any;
  export default content;
}

declare module '@types' {
  export * from './types';
}

declare module '@types/*' {
  const content: any;
  export default content;
}

declare module '@' {
  const content: any;
  export default content;
}

declare module '@/*' {
  const content: any;
  export default content;
}
