export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfjs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;
    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import('pdfjs-dist/build/pdf.mjs').then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });
    return loadPromise;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfjs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
        }

        await page.render({ canvasContext: context!, viewport }).promise;
        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: 'image/png',
                            lastModified: Date.now(),
                        });
                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: '',
                            file: null,
                            error: 'Failed to convert PDF to image'
                        });
                    }
                },
                'image/png',
                1.0
            );
        });
    } catch (error) {
        return {
            imageUrl: '',
            file: null,
            error: `Failed to convert PDF: ${error}`
        };
    }
}