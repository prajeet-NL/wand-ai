import formidable from "formidable";
import type { IncomingMessage, ServerResponse } from "http";
import { PassportOcrError, processPassportOcr } from "../server/passportOcr";

export const config = {
  api: {
    bodyParser: false,
  },
};

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function parseMultipartForm(req: IncomingMessage) {
  return new Promise<{ filepath: string; originalFilename: string; mimetype: string }>((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });

    form.parse(req, (error, _fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      const fileEntry = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!fileEntry?.filepath) {
        reject(new PassportOcrError("Passport image is required", 400));
        return;
      }

      resolve({
        filepath: fileEntry.filepath,
        originalFilename: fileEntry.originalFilename || "passport.jpg",
        mimetype: fileEntry.mimetype || "image/jpeg",
      });
    });
  });
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const { readFile, unlink } = await import("fs/promises");
    const uploadedFile = await parseMultipartForm(req);
    const fileBuffer = await readFile(uploadedFile.filepath);

    try {
      const parsedPassport = await processPassportOcr(
        fileBuffer,
        uploadedFile.originalFilename,
        uploadedFile.mimetype,
      );
      sendJson(res, 200, parsedPassport);
    } finally {
      await unlink(uploadedFile.filepath).catch(() => {});
    }
  } catch (error) {
    if (error instanceof PassportOcrError) {
      sendJson(res, error.statusCode, { error: error.message });
      return;
    }

    sendJson(res, 500, {
      error: "Automatic passport reading failed. Please enter details manually.",
    });
  }
}
