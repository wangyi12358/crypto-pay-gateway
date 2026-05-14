import { createHash } from "crypto"

/**
 * 与 EPusdt 兼容的签名算法
 * 1. 取所有非空参数（排除 signature），按 key 字典序排序
 * 2. 拼成 key1=value1&key2=value2 字符串
 * 3. 末尾拼接 secretKey，做 MD5
 */
export function generateSignature(
  params: Record<string, unknown>,
  secretKey: string
): string {
  const entries = Object.entries(params)
    .filter(([k, v]) => k !== "signature" && v !== "" && v != null)
    .sort(([a], [b]) => a.localeCompare(b))

  const sortedStr = entries.map(([k, v]) => `${k}=${v}`).join("&")
  return createHash("md5")
    .update(sortedStr + secretKey)
    .digest("hex")
}

export function verifySignature(
  params: Record<string, unknown>,
  secretKey: string,
  signature: string
): boolean {
  const expected = generateSignature(params, secretKey)
  return expected === signature
}
