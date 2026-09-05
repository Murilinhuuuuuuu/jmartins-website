import assert from "node:assert/strict";
import test from "node:test";
import {
  quoteAttachmentExtension,
  validateQuoteAttachments,
} from "./attachments.ts";

test("aceita assinaturas reais dos formatos principais", async () => {
  const jpeg = new File(
    [new Uint8Array([0xff, 0xd8, 0xff, 0xe0])],
    "cadeira.jpg",
    { type: "image/jpeg" },
  );
  const pdf = new File(
    [new TextEncoder().encode("prefixo%PDF-1.7")],
    "orcamento.pdf",
    { type: "application/pdf" },
  );
  const mp4 = new File(
    [new Uint8Array([0, 0, 0, 24]), new TextEncoder().encode("ftypisom")],
    "video.mp4",
    { type: "video/mp4" },
  );

  assert.equal(await validateQuoteAttachments([jpeg, pdf, mp4]), null);
});

test("rejeita conteúdo que não corresponde ao MIME informado", async () => {
  const fakeImage = new File(
    [new TextEncoder().encode("isto não é uma imagem")],
    "cadeira.jpg",
    { type: "image/jpeg" },
  );
  assert.match(
    await validateQuoteAttachments([fakeImage]),
    /não corresponde ao formato/,
  );
});

test("rejeita arquivo acima do limite antes de ler seu conteúdo", async () => {
  const oversizedImage = {
    name: "grande.jpg",
    type: "image/jpeg",
    size: 15 * 1024 * 1024 + 1,
  };
  assert.match(
    await validateQuoteAttachments([oversizedImage]),
    /ultrapassa o limite/,
  );
});

test("deriva a extensão segura a partir do MIME", () => {
  assert.equal(quoteAttachmentExtension("image/jpeg"), "jpg");
  assert.equal(quoteAttachmentExtension("video/quicktime"), "mov");
  assert.equal(quoteAttachmentExtension("application/octet-stream"), null);
});
