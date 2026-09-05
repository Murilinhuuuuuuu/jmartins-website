export const MAX_QUOTE_ATTACHMENTS = 20;

export const QUOTE_ATTACHMENT_ACCEPT =
  "image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,application/pdf";

const allowedTypes = new Set(QUOTE_ATTACHMENT_ACCEPT.split(","));

const mebibyte = 1024 * 1024;

const extensionByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
};

function sizeLimit(type: string) {
  if (type.startsWith("image/")) return 15 * mebibyte;
  if (type.startsWith("video/")) return 80 * mebibyte;
  return 20 * mebibyte;
}

function bytesMatch(bytes: Uint8Array, expected: number[], offset = 0) {
  return expected.every((value, index) => bytes[offset + index] === value);
}

function containsBytes(bytes: Uint8Array, expected: number[]) {
  for (let offset = 0; offset + expected.length <= bytes.length; offset += 1) {
    if (bytesMatch(bytes, expected, offset)) return true;
  }
  return false;
}

function ascii(bytes: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

function isoBrands(bytes: Uint8Array) {
  if (bytes.length < 12 || ascii(bytes, 4, 4) !== "ftyp") return [];

  const brands = [ascii(bytes, 8, 4)];
  for (let offset = 16; offset + 4 <= bytes.length; offset += 4) {
    brands.push(ascii(bytes, offset, 4));
  }
  return brands;
}

function signatureMatches(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytesMatch(bytes, [0xff, 0xd8, 0xff]);
  if (type === "image/png") return bytesMatch(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "image/webp") return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP";
  if (type === "application/pdf") {
    return containsBytes(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
  }

  const brands = isoBrands(bytes);
  if (type === "image/heic") {
    return brands.some((brand) => ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"].includes(brand));
  }
  if (type === "video/quicktime") return brands.includes("qt  ");
  if (type === "video/mp4") {
    return brands.some(
      (brand) =>
        brand.startsWith("iso") ||
        brand.startsWith("mp4") ||
        brand.startsWith("M4") ||
        brand.startsWith("3g") ||
        ["avc1", "dash", "MSNV"].includes(brand),
    );
  }

  return false;
}

export function quoteAttachmentExtension(type: string) {
  return extensionByType[type] ?? null;
}

export async function validateQuoteAttachments(files: File[]) {
  if (files.length > MAX_QUOTE_ATTACHMENTS) {
    return `Envie no máximo ${MAX_QUOTE_ATTACHMENTS} anexos.`;
  }

  for (const file of files) {
    if (!file.size) return `O arquivo ${file.name} está vazio.`;
    if (!allowedTypes.has(file.type)) return `O tipo do arquivo ${file.name} não é permitido.`;
    if (file.size > sizeLimit(file.type)) return `O arquivo ${file.name} ultrapassa o limite permitido.`;

    try {
      const bytes = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
      if (!signatureMatches(file.type, bytes)) {
        return `O conteúdo do arquivo ${file.name} não corresponde ao formato informado.`;
      }
    } catch {
      return `Não foi possível verificar o arquivo ${file.name}.`;
    }
  }

  return null;
}
