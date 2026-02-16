'use client';

import { useState, useEffect } from 'react';
import { useAdminUsers, useBanUser, useVerifyUser } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Ban, CheckCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { data, isLoading } = useAdminUsers({ page, limit: 20, search: debouncedSearch });
  const banUser = useBanUser();
  const verifyUser = useVerifyUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleBan = (id: string, isBanned: boolean) => {
    if (confirm(`${isBanned ? 'Banir' : 'Desbanir'} este usuário?`)) {
      banUser.mutate({ id, isBanned });
    }
  };

  const handleVerify = (id: string, isVerifiedSeller: boolean) => {
    if (confirm(`${isVerifiedSeller ? 'Verificar' : 'Remover verificação de'} este vendedor?`)) {
      verifyUser.mutate({ id, isVerifiedSeller });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {(Array.isArray(data) ? data : data?.users || []).map((user: any) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{user.name || user.email}</h3>
                        {user.isVerifiedSeller && (
                          <Badge className="bg-green-500">
                            <Shield className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                        {user.isBanned && (
                          <Badge variant="destructive">Banido</Badge>
                        )}
                        {user.role === 'ADMIN' && (
                          <Badge>Admin</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Telefone: {user.phone || 'Não informado'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Empresa: {user.company?.name}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span>{user._count?.machines || 0} máquinas</span>
                        <span>{user._count?.proposals || 0} propostas</span>
                        <span>{user._count?.reviews || 0} avaliações</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {user.role !== 'ADMIN' && (
                        <>
                          <Button
                            size="sm"
                            variant={user.isVerifiedSeller ? 'outline' : 'default'}
                            onClick={() => handleVerify(user.id, !user.isVerifiedSeller)}
                            disabled={verifyUser.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {user.isVerifiedSeller ? 'Remover Verificação' : 'Verificar'}
                          </Button>
                          <Button
                            size="sm"
                            variant={user.isBanned ? 'outline' : 'destructive'}
                            onClick={() => handleBan(user.id, !user.isBanned)}
                            disabled={banUser.isPending}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            {user.isBanned ? 'Desbanir' : 'Banir'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(data?.totalPages || 0) > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {data?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (data?.totalPages || 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
