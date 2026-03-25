import { extractPassportDetailsFromOcr, type ParsedPassportDetails } from "../src/lib/passportMrz";

export class PassportOcrError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "PassportOcrError";
    this.statusCode = statusCode;
  }
}

export async function extractPassportData(fileBuffer: Buffer, filename: string, mimeType: string) {
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer], { type: mimeType }), filename);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: "K86639615588957",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new PassportOcrError("OCR.space request failed", 502);
  }

  return response.json() as Promise<{
    ParsedResults?: Array<{ ParsedText?: string }>;
    IsErroredOnProcessing?: boolean;
    ErrorMessage?: string[] | string;
  }>;
}

export async function processPassportOcr(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<ParsedPassportDetails> {
  const ocrResponse = await extractPassportData(fileBuffer, filename, mimeType);

  if (ocrResponse.IsErroredOnProcessing) {
    throw new PassportOcrError(
      Array.isArray(ocrResponse.ErrorMessage)
        ? ocrResponse.ErrorMessage.join(", ")
        : ocrResponse.ErrorMessage || "Automatic passport reading failed. Please enter details manually.",
      502,
    );
  }

  const parsedText = (ocrResponse.ParsedResults || [])
    .map((result) => result.ParsedText || "")
    .join("\n")
    .trim();
  const parsedPassport = extractPassportDetailsFromOcr(parsedText);

  if (!parsedPassport) {
    throw new PassportOcrError("Unable to auto-read passport. Please enter details manually.", 422);
  }

  return parsedPassport;
}
