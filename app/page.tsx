import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, Scissors } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center">
            <Scissors className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2">DecoDoCorte</h1>
        <p className="text-zinc-400 mb-8 max-w-md">Agendamento simplificado para barbeiros e clientes</p>

        <div className="flex flex-col w-full max-w-xs gap-4">
          <Link href="/login?type=barber" className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar como Barbeiro
            </Button>
          </Link>

          <Link href="/login?type=client" className="w-full">
            <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar como Cliente
            </Button>
          </Link>
        </div>
      </div>

      <footer className="py-4 text-center text-zinc-500 text-sm">
        © 2025 DecoDoCorte. Todos os direitos reservados.
      </footer>
    </div>
  )
}
