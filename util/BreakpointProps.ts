import { Breakpoint } from '@/style/Breakpoint';

export type BreakpointProps<T> = {
  [TKey in keyof T as TKey extends string
    ? `${TKey}On${Capitalize<Breakpoint>}`
    : never]: T[TKey];
} & T;
