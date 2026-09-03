export type Address = { postalCode: string; street: string; neighborhood: string; city: string; state: string };

async function viaCep(postalCode: string): Promise<Address | null> {
  const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.erro) return null;
  return { postalCode, street: data.logradouro ?? "", neighborhood: data.bairro ?? "", city: data.localidade ?? "", state: data.uf ?? "" };
}

async function brasilApi(postalCode: string): Promise<Address | null> {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${postalCode}`, { signal: AbortSignal.timeout(4000) });
  if (!response.ok) return null;
  const data = await response.json();
  return { postalCode, street: data.street ?? "", neighborhood: data.neighborhood ?? "", city: data.city ?? "", state: data.state ?? "" };
}

export async function findAddress(postalCodeInput: string) {
  const postalCode = postalCodeInput.replace(/\D/g, "");
  if (postalCode.length !== 8) return null;
  try {
    return await viaCep(postalCode) ?? await brasilApi(postalCode);
  } catch {
    try { return await brasilApi(postalCode); } catch { return null; }
  }
}
