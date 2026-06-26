'use client'

import { type CSSProperties } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { openExternalLink } from '@/lib/external-link'
import { ChevronDown, ExternalLink, Globe } from '@/lib/icons'
import { allowProvider, setEmbedMode } from '@/store/embed-consent'

import type { EmbedDescriptor } from './providers/types'

// Approval-style placeholder shown before an embed reaches out to a third party.
// Sized to the embed's footprint (aspect ratio or fixed height) so loading it
// causes no layout shift. "Load" consents to this one; "Always allow <service>"
// persists the provider; mirrors tool-approval's primary + dropdown shape.
export function EmbedFacade({ descriptor, onLoad }: { descriptor: EmbedDescriptor; onLoad: () => void }) {
  const style: CSSProperties = descriptor.aspectRatio
    ? { aspectRatio: descriptor.aspectRatio }
    : { height: descriptor.height ?? 320 }

  return (
    <span
      className="grid w-full place-items-center gap-3 rounded-lg border border-border bg-muted/20 p-4 text-center"
      style={style}
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Globe className="size-4 text-(--ui-text-tertiary)" />
        {descriptor.label}
      </span>

      <span className="inline-flex h-7 items-stretch overflow-hidden rounded-md border border-primary/25 bg-primary/10 text-primary">
        <Button
          className="h-full rounded-none px-2.5 text-xs font-medium text-primary hover:bg-primary/15 hover:text-primary"
          onClick={onLoad}
          size="xs"
          variant="ghost"
        >
          Load {descriptor.label}
        </Button>
        <span aria-hidden className="w-px self-stretch bg-primary/20" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="More options"
              className="h-full w-5 rounded-none px-0 text-primary hover:bg-primary/15 hover:text-primary"
              size="xs"
              variant="ghost"
            >
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-48">
            <DropdownMenuItem onSelect={() => allowProvider(descriptor.provider)}>
              Always allow {descriptor.label}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openExternalLink(descriptor.sourceUrl)}>
              <ExternalLink className="size-3.5" />
              Open in browser
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEmbedMode('off')} variant="destructive">
              Never show embeds
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>

      <span className="text-[0.6875rem] text-(--ui-text-tertiary)">Loads content from {hostOf(descriptor)}</span>
    </span>
  )
}

function hostOf(descriptor: EmbedDescriptor): string {
  try {
    return new URL(descriptor.sourceUrl).hostname.replace(/^www\./, '')
  } catch {
    return descriptor.label
  }
}
