export interface ParsedPassportDetails {
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

  const mrzLineIndex = normalizedLines.findIndex((line) => line.startsWith("P<"));
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
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
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
    if (match?.[1]) {
      return match[1].trim();
    }
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
  const dateOfBirth = normalizeDate(matchField(compactText, [
    /date\s*of\s*birth\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
    /birth\s*date\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
    /date\s*of\s*birth\s*[:\-]?\s*(\d{4}[\/\-]\d{2}[\/\-]\d{2})/i,
  ]));
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

  return {
    fullName,
    passportNumber,
    nationality,
    dateOfBirth,
  };
}

export function parseMRZ(text: string): ParsedPassportDetails | null {
  const lines = getCandidateMrzLines(text);

  const nameLineIndex = lines.findIndex((line) => line.startsWith("P<"));
  if (nameLineIndex === -1 || nameLineIndex === lines.length - 1) return null;

  const nameLine = lines[nameLineIndex];
  const detailLine = lines[nameLineIndex + 1];
  const issuingCountry = nameLine.slice(2, 5);
  const nameParts = nameLine.split("<<");
  const surname = nameParts[0].replace(`P<${issuingCountry}`, "").replace(/</g, " ").trim();
  const givenName = (nameParts[1] || "").replace(/</g, " ").trim();
  const separator = detailLine.charAt(8);
  const possibleCheckDigit = detailLine.charAt(9);
  const passportNumber = detailLine.slice(0, separator === "<" || /\d/.test(separator) ? 9 : 8).replace(/</g, "").trim();
  const hasExplicitCheckDigit = /\d/.test(possibleCheckDigit);
  const nationalityStart = /\d/.test(separator) ? 10 : separator === "<" ? (hasExplicitCheckDigit ? 10 : 9) : 8;
  const dobStart = /\d/.test(separator) ? 13 : separator === "<" ? (hasExplicitCheckDigit ? 13 : 12) : 11;
  const nationality = detailLine.slice(nationalityStart, nationalityStart + 3).replace(/</g, "").trim() || issuingCountry;
  const dobRaw = detailLine.slice(dobStart, dobStart + 6).replace(/</g, "").trim();
  const dateOfBirth = formatMrzDate(dobRaw);
  const fullName = formatName(`${givenName} ${surname}`.trim());

  if (!passportNumber || !nationality || !dateOfBirth || !fullName) return null;

  return {
    fullName,
    passportNumber,
    nationality,
    dateOfBirth,
  };
}

export function extractPassportDetailsFromOcr(parsedText: string) {
  return parseMRZ(parsedText) || parseLabeledPassportText(parsedText);
}
