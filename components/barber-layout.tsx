"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart,
  Calendar,
  Menu,
  Scissors,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BarberLayoutProps = {
  children: React.ReactNode;
};

export function BarberLayout({ children }: BarberLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-zinc-900">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40`}
                alt="Barbeiro"
              />
              <AvatarFallback className="bg-red-600">DC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">Deco Barbeiro</h2>
              <p className="text-xs text-zinc-400">Barbeiro Profissional</p>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/barber/dashboard">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname.includes("/barber/dashboard")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Fila de Espera
            </Button>
          </Link>

          <Link href="/barber/history">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname.includes("/barber/history")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Histórico
            </Button>
          </Link>

          <Link href="/barber/analytics">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname.includes("/barber/analytics")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <BarChart className="h-5 w-5 mr-3" />
              Estatísticas
            </Button>
          </Link>

          <Link href="/barber/services">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname.includes("/barber/services")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Scissors className="h-5 w-5 mr-3" />
              Serviços
            </Button>
          </Link>

          <Link href="/barber/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                pathname.includes("/barber/settings")
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Configurações
            </Button>
          </Link>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header para mobile */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={`/placeholder.svg?height=40&width=40`}
                alt="Barbeiro"
              />
              <AvatarFallback className="bg-red-600">DC</AvatarFallback>
            </Avatar>
            <h2 className="font-medium">DecoDoCorte</h2>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-zinc-900 border-zinc-800 p-0"
            >
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40`}
                      alt="Barbeiro"
                    />
                    <AvatarFallback className="bg-red-600">DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">Deco Barbeiro</h2>
                    <p className="text-xs text-zinc-400">
                      Barbeiro Profissional
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <nav className="p-4 space-y-2">
                <Link href="/barber/dashboard">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      pathname.includes("/barber/dashboard")
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Users className="h-5 w-5 mr-3" />
                    Fila de Espera
                  </Button>
                </Link>

                <Link href="/barber/history">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      pathname.includes("/barber/history")
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    Histórico
                  </Button>
                </Link>

                <Link href="/barber/analytics">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      pathname.includes("/barber/analytics")
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <BarChart className="h-5 w-5 mr-3" />
                    Estatísticas
                  </Button>
                </Link>

                <Link href="/barber/services">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      pathname.includes("/barber/services")
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Scissors className="h-5 w-5 mr-3" />
                    Serviços
                  </Button>
                </Link>

                <Link href="/barber/settings">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      pathname.includes("/barber/settings")
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Configurações
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
