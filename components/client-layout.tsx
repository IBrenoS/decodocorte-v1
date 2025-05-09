"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Home, User } from "lucide-react"

type ClientLayoutProps = {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <main className="flex-1">{children}</main>

      <div className="border-t border-zinc-800 bg-zinc-900 p-2">
        <div className="flex items-center justify-around">
          <Link href="/client/queue">
            <Button
              variant="ghost"
              className={`flex flex-col h-16 items-center justify-center rounded-lg px-3 ${
                pathname.includes("/client/queue")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Início</span>
            </Button>
          </Link>

          <Link href="/client/history">
            <Button
              variant="ghost"
              className={`flex flex-col h-16 items-center justify-center rounded-lg px-3 ${
                pathname.includes("/client/history")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-xs">Histórico</span>
            </Button>
          </Link>

          <Link href="/profile">
            <Button
              variant="ghost"
              className={`flex flex-col h-16 items-center justify-center rounded-lg px-3 ${
                pathname.includes("/profile")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs">Perfil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
