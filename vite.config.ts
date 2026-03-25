import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import { defineConfig } from "vite";
import { PassportOcrError, processPassportOcr } from "./api/_lib/passportOcr";

function readRequestBody(req: IncomingMessage) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getUploadedFile(body: Buffer, contentType: string) {
  const boundaryMatch = contentType.match(/boundary=(.+)$/i);
  if (!boundaryMatch) return null;

  const boundary = `--${boundaryMatch[1]}`;
  const parts = body.toString("latin1").split(boundary);

  for (const part of parts) {
    if (!part.includes('name="file"')) continue;

    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headers = part.slice(0, headerEnd);
    const contentStart = headerEnd + 4;
    const contentEnd = part.lastIndexOf("\r\n");
    if (contentEnd <= contentStart) continue;

    const filenameMatch = headers.match(/filename="([^"]+)"/i);
    const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
    const fileText = part.slice(contentStart, contentEnd);

    return {
      filename: filenameMatch?.[1] || "passport.jpg",
      mimeType: typeMatch?.[1] || "image/jpeg",
      buffer: Buffer.from(fileText, "latin1"),
    };
  }

  return null;
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function handlePassportOcr(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const contentType = req.headers["content-type"] || "";
    const body = await readRequestBody(req);
    const uploadedFile = getUploadedFile(body, contentType);

    if (!uploadedFile) {
      sendJson(res, 400, { error: "Passport image is required" });
      return;
    }

    const parsedPassport = await processPassportOcr(
      uploadedFile.buffer,
      uploadedFile.filename,
      uploadedFile.mimeType,
    );

    sendJson(res, 200, parsedPassport);
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

function passportOcrPlugin() {
  return {
    name: "passport-ocr-api",
    configureServer(server: { middlewares: { use: (pathName: string, handler: typeof handlePassportOcr) => void } }) {
      server.middlewares.use("/api/passport-ocr", handlePassportOcr);
    },
    configurePreviewServer(server: { middlewares: { use: (pathName: string, handler: typeof handlePassportOcr) => void } }) {
      server.middlewares.use("/api/passport-ocr", handlePassportOcr);
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), passportOcrPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
