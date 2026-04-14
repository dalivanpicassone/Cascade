'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addPartner } from '@/services/partner-actions'

const formSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  inn: z
    .string()
    .regex(/^\d{10}(\d{2})?$/, 'ИНН должен содержать 10 или 12 цифр')
    .or(z.literal(''))
    .optional(),
  contact_person: z.string().optional(),
  email: z.email('Некорректный email').or(z.literal('')).optional(),
})

type FormValues = z.infer<typeof formSchema>

export function AddPartnerDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      inn: '',
      contact_person: '',
      email: '',
    },
  })

  async function onSubmit(values: FormValues) {
    const result = await addPartner({
      name: values.name,
      inn: values.inn || null,
      contact_person: values.contact_person || null,
      email: values.email || null,
    })

    if (result.success) {
      toast.success('Партнёр добавлен')
      form.reset()
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        Добавить партнёра
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый партнёр</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">
              Название <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="ООО «Пример»"
              aria-invalid={!!form.formState.errors.name}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="inn">ИНН</Label>
            <Input
              id="inn"
              placeholder="1234567890"
              aria-invalid={!!form.formState.errors.inn}
              {...form.register('inn')}
            />
            {form.formState.errors.inn && (
              <p className="text-xs text-destructive">
                {form.formState.errors.inn.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="contact_person">Контактное лицо</Label>
            <Input
              id="contact_person"
              placeholder="Иванов Иван Иванович"
              {...form.register('contact_person')}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@company.ru"
              aria-invalid={!!form.formState.errors.email}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Сохранение…' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
