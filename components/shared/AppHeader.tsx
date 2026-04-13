"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const segmentLabels: Record<string, string> = {
  partners: "Партнеры",
  projects: "Проекты",
  contracts: "Договоры",
  finances: "Финансы",
}

function useBreadcrumbs() {
  const pathname = usePathname()

  if (pathname === "/") {
    return [{ label: "Дашборд", href: "/" }]
  }

  const segments = pathname.split("/").filter(Boolean)
  const crumbs = [{ label: "Дашборд", href: "/" }]

  let accumulatedPath = ""
  for (const segment of segments) {
    accumulatedPath += `/${segment}`
    const label = segmentLabels[segment] ?? segment
    crumbs.push({ label, href: accumulatedPath })
  }

  return crumbs
}

export function AppHeader() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1

            return (
              <Fragment key={crumb.href}>
                {index > 0 && (
                  <li
                    aria-hidden
                    className="text-muted-foreground select-none"
                  >
                    /
                  </li>
                )}
                <li>
                  {isLast ? (
                    <span className="font-medium text-foreground">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              </Fragment>
            )
          })}
        </ol>
      </nav>
    </header>
  )
}
