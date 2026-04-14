import { getPartners } from '@/services/partner-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddPartnerDialog } from '@/components/partners/add-partner-dialog'

export default async function PartnersPage() {
  const result = await getPartners()
  const partners = result.success ? result.data : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Партнёры</h1>
        <AddPartnerDialog />
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>ИНН</TableHead>
              <TableHead>Контактное лицо</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-muted-foreground"
                >
                  Партнёры не добавлены
                </TableCell>
              </TableRow>
            ) : (
              partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.inn ?? '—'}</TableCell>
                  <TableCell>{partner.contact_person ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!result.success && (
        <p className="mt-4 text-sm text-destructive">
          Ошибка загрузки: {result.error}
        </p>
      )}
    </div>
  )
}
