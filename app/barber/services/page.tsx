"use client";

import { BarberLayout } from "@/components/barber-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import {
  addBarberService,
  deleteBarberService,
  getBarberServices,
  Service,
  updateBarberService,
} from "@/lib/barber";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BarberServicesPage() {
  const { requireAuth } = useAuth();
  const { loading: authLoading } = requireAuth("barber");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Estado para novo serviço ou para edição
  const [currentService, setCurrentService] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    active: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Carregar serviços ao montar
  useEffect(() => {
    if (authLoading) return;

    const loadServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getBarberServices();
        setServices(data);
      } catch (err: any) {
        setError(
          "Erro ao carregar serviços: " +
            (err.friendlyMessage || err.message || "Tente novamente")
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [authLoading]);

  // Abrir dialog para adicionar serviço
  const handleAddService = () => {
    setCurrentService({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      active: true,
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  // Abrir dialog para editar serviço
  const handleEditService = (service: Service) => {
    setCurrentService({ ...service });
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Salvar serviço (criar novo ou atualizar existente)
  const handleSaveService = async () => {
    if (
      !currentService.name ||
      currentService.price === undefined ||
      currentService.duration === undefined
    ) {
      return; // Validação básica
    }

    setActionLoading(true);

    try {
      if (isEditing && currentService.id) {
        // Editar serviço existente
        const updated = await updateBarberService(
          currentService.id,
          currentService
        );
        setServices(services.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        // Adicionar novo serviço
        const newService = await addBarberService(
          currentService as Omit<Service, "id">
        );
        setServices([...services, newService]);
      }

      setDialogOpen(false);
    } catch (err: any) {
      setError(
        "Erro ao salvar serviço: " +
          (err.friendlyMessage || err.message || "Tente novamente")
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Remover serviço
  const handleDeleteService = async (id: string) => {
    // Confirmação
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    setActionLoading(true);

    try {
      await deleteBarberService(id);
      setServices(services.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(
        "Erro ao excluir serviço: " +
          (err.friendlyMessage || err.message || "Tente novamente")
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <BarberLayout>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciar Serviços</h1>
          <Button
            onClick={handleAddService}
            className="bg-red-600 hover:bg-red-700"
            disabled={actionLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Serviço
          </Button>
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="p-4 text-red-200">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : services.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center text-zinc-400">
              <p>Nenhum serviço cadastrado.</p>
              <p className="mt-2">
                Adicione serviços para que seus clientes saibam o que você
                oferece.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`bg-zinc-900 border-zinc-800 ${
                  !service.active ? "opacity-70" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {service.name}
                    {!service.active && (
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                        Inativo
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {service.description && (
                    <p className="text-zinc-400 text-sm mb-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-lg font-semibold">
                      R$ {service.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {service.duration} min
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-zinc-700 hover:bg-zinc-800"
                      onClick={() => handleEditService(service)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog para adicionar/editar serviço */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Nome do serviço"
                className="bg-zinc-800 border-zinc-700"
                value={currentService.name || ""}
                onChange={(e) =>
                  setCurrentService({ ...currentService, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Descrição breve"
                className="bg-zinc-800 border-zinc-700"
                value={currentService.description || ""}
                onChange={(e) =>
                  setCurrentService({
                    ...currentService,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="bg-zinc-800 border-zinc-700"
                  value={currentService.price || ""}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  step="5"
                  className="bg-zinc-800 border-zinc-700"
                  value={currentService.duration || 30}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={currentService.active}
                onCheckedChange={(checked) =>
                  setCurrentService({ ...currentService, active: checked })
                }
              />
              <Label htmlFor="active">Serviço ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-zinc-700 hover:bg-zinc-800"
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveService}
              className="bg-red-600 hover:bg-red-700"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BarberLayout>
  );
}
