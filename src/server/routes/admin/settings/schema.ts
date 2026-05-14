import { z } from "zod"

export const listSettingsSchema = z.object({
  group: z.string().optional(),
})

export const settingItemSchema = z.object({
  group: z.string(),
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(["string", "int", "bool", "json"]).default("string"),
})

export const upsertSettingsSchema = z.object({
  items: z.array(settingItemSchema).min(1),
})

export const settingParamSchema = z.object({
  key: z.string(),
})

export type ListSettingsInput = z.infer<typeof listSettingsSchema>
export type UpsertSettingsInput = z.infer<typeof upsertSettingsSchema>
export type SettingParamInput = z.infer<typeof settingParamSchema>
