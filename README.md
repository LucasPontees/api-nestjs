1 - cd api
2 - npm install
3 - docker compose up -d
4 - npx prisma migrate dev
5 - 


# Documentação de Integração Backend e Frontend - Projeto E-coletas

## 🔧 Backend - NestJS + Prisma + Auth

### 1. Configuração do Prisma

* Banco configurado via Docker (PostgreSQL).
* `.env`:

  ```env
  DATABASE_URL="postgresql://root:root@localhost:5432/ecoleta"
  ```
* Comando para iniciar migração:

  ```bash
  npx prisma migrate dev --name init
  ```
* Prisma Service criado para centralizar o acesso ao banco:

  ```ts
  // prisma.service.ts
  @Injectable()
  export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
      await this.$connect();
    }
  }
  ```

### 2. Módulo de Criação de Usuário

* Rota: `POST /users`
* Validação de dados com DTO (Data Transfer Object).
* Controller, Service e Repository implementados seguindo arquitetura MVC.

### 3. Autenticação com JWT + Argon2

* Utilizado `@nestjs/jwt` e `argon2`.
* Autenticação feita por rota `POST /auth/login`.
* Payload JWT inclui apenas o `sub` (userId).
* `JwtStrategy` atualizado para validar e injetar `userId` no `request.user`.

### 4. Proteção de Rotas

* Criado `JwtAuthGuard` usando:

  ```ts
  @UseGuards(AuthGuard('jwt'))
  ```
* Middleware de validação JWT nas rotas privadas.

---

## 👁️ Frontend - Next.js + React + Ky + Zod

### 1. Configuração de Ambiente

* Arquivo `src/env.ts`:

  ```ts
  import { createEnv } from '@t3-oss/env-nextjs';
  import { z } from 'zod';

  export const env = createEnv({
    shared: {
      NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
  });
  ```

### 2. Client HTTP (Ky)

* Arquivo `src/http/api.ts`:

  ```ts
  import ky from 'ky';
  import { env } from '@/env';

  export const api = ky.create({
    prefixUrl: env.NEXT_PUBLIC_API_BASE_URL,
    hooks: {
      beforeRequest: [
        (request) => {
          const token = localStorage.getItem('token');
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
    },
  });
  ```

### 3. Tela de Login

* Armazena JWT no `localStorage`.
* Redireciona para `/dashboard` ao logar.
* Usa `react-toast` para feedback visual.

### 4. Proteção de Rotas no Frontend

* Componente `AuthGuard` em `src/components/AuthGuard.tsx`:

  ```tsx
  'use client';
  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';

  export function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) router.replace('/login');
      else setIsAuth(true);
    }, [router]);

    if (!isAuth) return null;
    return <>{children}</>;
  }
  ```

### 5. Aplicando AuthGuard

* Exemplo com a página `/dashboard/page.tsx`:

  ```tsx
  'use client';
  import { AuthGuard } from '@/components/AuthGuard';

  export default function DashboardPage() {
    return (
      <AuthGuard>
        {/* conteúdo protegido */}
      </AuthGuard>
    );
  }
  ```

---

## ✅ Status Atual

* Backend pronto com login e proteção JWT.
* Frontend integrado com autenticação.
* Tela de login funcional.
* Rotas privadas protegidas com `AuthGuard`.

---

Se desejar, podemos evoluir para uso de cookies HttpOnly e middleware no Next.js para proteção no lado do servidor.
