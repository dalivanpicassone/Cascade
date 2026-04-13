'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/supabase'

export type Partner = Tables<'partners'>

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const PartnerSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(255),
  inn: z
    .string()
    .regex(/^\d{10}(\d{2})?$/, 'ИНН должен содержать 10 или 12 цифр')
    .nullable()
    .optional(),
  contact_person: z.string().max(255).nullable().optional(),
  email: z.email('Некорректный email').nullable().optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Некорректный номер телефона')
    .nullable()
    .optional(),
  website: z.url('Некорректный URL сайта').nullable().optional(),
})

export type PartnerInput = z.infer<typeof PartnerSchema>

// ---------------------------------------------------------------------------
// Action result type
// ---------------------------------------------------------------------------

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// ---------------------------------------------------------------------------
// getPartners — список партнёров, отсортированный по дате добавления (новые первые)
// ---------------------------------------------------------------------------

export async function getPartners(): Promise<ActionResult<Partner[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data ?? [] }
}

// ---------------------------------------------------------------------------
// addPartner — добавление нового партнёра с валидацией через zod
// ---------------------------------------------------------------------------

export async function addPartner(
  input: unknown,
): Promise<ActionResult<Partner>> {
  const parsed = PartnerSchema.safeParse(input)

  if (!parsed.success) {
    const flat = z.flattenError(parsed.error)
    return {
      success: false,
      error: 'Ошибка валидации данных',
      fieldErrors: flat.fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('partners')
    .insert(parsed.data)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
