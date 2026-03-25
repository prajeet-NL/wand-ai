import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ── MRZ / label parsing (inlined from src/lib/passportMrz.ts) ── */

interface ParsedPassportDetails {
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
}

function normalizeMrzLine(line: string) {
  return line.replace(/\s+/g, "").toUpperCase();
}

function splitMergedMrzLine(line: string) {
  if (line.startsWith("P<") && line.length >= 88) {
    return [line.slice(0, 44), line.slice(44, 88)];
  }
  return [line];
}

function getCandidateMrzLines(text: string) {
  const normalizedLines = text
    .split(/\r?\n/)
    .flatMap((line) => splitMergedMrzLine(normalizeMrzLine(line)))
    .filter(Boolean);

  const mrzLineIndex = normalizedLines.findIndex((l) => l.startsWith("P<"));
  if (mrzLineIndex !== -1 && normalizedLines[mrzLineIndex + 1]) {
    return [normalizedLines[mrzLineIndex], normalizedLines[mrzLineIndex + 1]];
  }

  const collapsed = normalizeMrzLine(text).replace(/[^A-Z0-9<]/g, "");
  const collapsedIndex = collapsed.indexOf("P<");
  if (collapsedIndex === -1) return [];

  const mrzBlock = collapsed.slice(collapsedIndex, collapsedIndex + 88);
  if (mrzBlock.length >= 88) {
    return [mrzBlock.slice(0, 44), mrzBlock.slice(44, 88)];
  }
  return [];
}

function formatMrzDate(dobRaw: string) {
  if (!/^\d{6}$/.test(dobRaw)) return "";
  const year = Number(dobRaw.slice(0, 2));
  const month = dobRaw.slice(2, 4);
  const day = dobRaw.slice(4, 6);
  const currentYear = new Date().getFullYear() % 100;
  const century = year > currentYear ? "19" : "20";
  return `${century}${dobRaw.slice(0, 2)}-${month}-${day}`;
}

function formatName(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function normalizeDate(value: string) {
  const cleaned = value.replace(/\./g, "/").replace(/-/g, "/").trim();
  const ymdMatch = cleaned.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (ymdMatch) return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
  const dmyMatch = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  return "";
}

function matchField(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function parseLabeledPassportText(text: string): ParsedPassportDetails | null {
  const compactText = text.replace(/\r/g, "");
  const passportNumber = matchField(compactText, [
    /passport\s*(?:no|number)\s*[:\-]?\s*([A-Z0-9]{6,12})/i,
    /document\s*(?:no|number)\s*[:\-]?\s*([A-Z0-9]{6,12})/i,
  ]).toUpperCase();
  const nationality = matchField(compactText, [
    /nationality\s*[:\-]?\s*([A-Z]{3,}|[A-Za-z ]{4,})/i,
    /country\s*code\s*[:\-]?\s*([A-Z]{3})/i,
  ]).toUpperCase();
  const dateOfBirth = normalizeDate(
    matchField(compactText, [
      /date\s*of\s*birth\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      /birth\s*date\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      /date\s*of\s*birth\s*[:\-]?\s*(\d{4}[\/\-]\d{2}[\/\-]\d{2})/i,
    ])
  );
  const surname = matchField(compactText, [
    /surname\s*[:\-]?\s*([A-Z][A-Z ]{1,})/i,
    /last\s*name\s*[:\-]?\s*([A-Z][A-Z ]{1,})/i,
  ]);
  const givenName = matchField(compactText, [
    /given\s*name[s]?\s*[:\-]?\s*([A-Z][A-Z ]{1,})/i,
    /first\s*name[s]?\s*[:\-]?\s*([A-Z][A-Z ]{1,})/i,
    /name\s*[:\-]?\s*([A-Z][A-Z ]{3,})/i,
  ]);
  const fullName = formatName(`${givenName} ${surname}`.trim() || givenName);
  if (!passportNumber || !nationality || !dateOfBirth || !fullName) return null;
  return { fullName, passportNumber, nationality, dateOfBirth };
}

function parseMRZ(text: string): ParsedPassportDetails | null {
  const lines = getCandidateMrzLines(text);
  const nameLineIndex = lines.findIndex((l) => l.startsWith("P<"));
  if (nameLineIndex === -1 || nameLineIndex === lines.length - 1) return null;

  const nameLine = lines[nameLineIndex];
  const detailLine = lines[nameLineIndex + 1];
  const issuingCountry = nameLine.slice(2, 5);
  const nameParts = nameLine.split("<<");
  const surname = nameParts[0].replace(`P<${issuingCountry}`, "").replace(/</g, " ").trim();
  const givenName = (nameParts[1] || "").replace(/</g, " ").trim();
  const separator = detailLine.charAt(8);
  const possibleCheckDigit = detailLine.charAt(9);
  const passportNumber = detailLine
    .slice(0, separator === "<" || /\d/.test(separator) ? 9 : 8)
    .replace(/</g, "")
    .trim();
  const hasExplicitCheckDigit = /\d/.test(possibleCheckDigit);
  const nationalityStart = /\d/.test(separator) ? 10 : separator === "<" ? (hasExplicitCheckDigit ? 10 : 9) : 8;
  const dobStart = /\d/.test(separator) ? 13 : separator === "<" ? (hasExplicitCheckDigit ? 13 : 12) : 11;
  const nationality =
    detailLine.slice(nationalityStart, nationalityStart + 3).replace(/</g, "").trim() || issuingCountry;
  const dobRaw = detailLine.slice(dobStart, dobStart + 6).replace(/</g, "").trim();
  const dateOfBirth = formatMrzDate(dobRaw);
  const fullName = formatName(`${givenName} ${surname}`.trim());
  if (!passportNumber || !nationality || !dateOfBirth || !fullName) return null;
  return { fullName, passportNumber, nationality, dateOfBirth };
}

function extractPassportDetailsFromOcr(parsedText: string) {
  return parseMRZ(parsedText) || parseLabeledPassportText(parsedText);
}

/* ── Multipart parser ── */

function getFileFromFormData(body: Uint8Array, contentType: string) {
  const boundaryMatch = contentType.match(/boundary=(.+)$/i);
  if (!boundaryMatch) return null;

  const boundary = `--${boundaryMatch[1]}`;
  const text = new TextDecoder("latin1").decode(body);
  const parts = text.split(boundary);

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
    const raw = part.slice(contentStart, contentEnd);
    const buffer = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) buffer[i] = raw.charCodeAt(i);

    return {
      filename: filenameMatch?.[1] || "passport.jpg",
      mimeType: typeMatch?.[1]?.trim() || "image/jpeg",
      buffer,
    };
  }
  return null;
}

/* ── Handler ── */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Deno.env.get("OCR_SPACE_API_KEY");
    if (!apiKey) {
      throw { status: 500, message: "OCR service is not configured." };
    }

    const contentType = req.headers.get("content-type") || "";
    const body = new Uint8Array(await req.arrayBuffer());
    const file = getFileFromFormData(body, contentType);

    if (!file) {
      return new Response(JSON.stringify({ error: "Passport image is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call OCR.space
    const ocrForm = new FormData();
    ocrForm.append("file", new Blob([file.buffer], { type: file.mimeType }), file.filename);
    ocrForm.append("language", "eng");
    ocrForm.append("isOverlayRequired", "false");
    ocrForm.append("detectOrientation", "true");
    ocrForm.append("scale", "true");
    ocrForm.append("OCREngine", "2");

    const ocrRes = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { apikey: apiKey },
      body: ocrForm,
    });

    if (!ocrRes.ok) {
      throw { status: 502, message: "Automatic passport reading failed. Please enter details manually." };
    }

    const ocrData = await ocrRes.json();

    if (ocrData.IsErroredOnProcessing) {
      const msg = Array.isArray(ocrData.ErrorMessage)
        ? ocrData.ErrorMessage.join(", ")
        : ocrData.ErrorMessage || "Automatic passport reading failed. Please enter details manually.";
      throw { status: 502, message: msg };
    }

    const parsedText = (ocrData.ParsedResults || [])
      .map((r: { ParsedText?: string }) => r.ParsedText || "")
      .join("\n")
      .trim();

    const result = extractPassportDetailsFromOcr(parsedText);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Unable to auto-read passport. Please enter details manually." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e?.status || 500;
    const message = e?.message || "Automatic passport reading failed. Please enter details manually.";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
