/**
 * Type declarations for csv-parser
 * csv-parser doesn't have official @types package
 */
declare module 'csv-parser' {
  import { Transform } from 'stream';

  interface Options {
    headers?: boolean | string[];
    skipLinesWithError?: boolean;
    skipEmptyLines?: boolean;
    skipLinesWithEmptyValues?: boolean;
    mapHeaders?: (args: { header: string; index: number }) => string;
    mapValues?: (args: { header: string; index: number; value: any }) => any;
  }

  function csv(options?: Options): Transform;
  export default csv;
}
