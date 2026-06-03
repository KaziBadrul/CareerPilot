declare module 'pdf-parse-fork' {
    interface PDFData {
        text: string;
        numpages: number;
        numrender: number;
        info: any;
        metadata: any;
        version: string;
    }

    interface PDFOptions {
        pagerender?: (pageData: any) => Promise<string> | string;
        max?: number;
        version?: string;
    }

    function pdf(dataBuffer: Buffer | ArrayBuffer | Uint8Array, options?: PDFOptions): Promise<PDFData>;

    export = pdf;
}
