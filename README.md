# Multi Tenant - Sistema de Gestão Multi Empresa

## Sobre o Projeto

Este projeto foi desenvolvido como um exercício prático de implementação de uma arquitetura multi-tenant (múltiplos inquilinos) utilizando Clean Architecture. O sistema permite gerenciar múltiplas empresas em uma única instalação, mantendo o isolamento de dados e funcionalidades entre elas.

## Tecnologias Utilizadas

### Backend
- NestJS - Framework Node.js para construção de aplicações escaláveis
- Prisma ORM - ORM moderno para Node.js e TypeScript
- Docker - Containerização da aplicação
- Vitest - Framework de testes
- Swagger - Documentação da API
- Argon2 - Hash de senhas

### Frontend
- React 18 - Biblioteca JavaScript para construção de interfaces
- Next.js 15 - Framework React para produção
- Tailwind CSS v4 - Framework CSS utility-first
- Cypress - Framework de testes E2E
- shadcn/ui - Componentes React reutilizáveis
- HTTP-Only Cookies - Segurança na autenticação

## Arquitetura

O projeto segue os princípios SOLID e Clean Architecture, organizando-se em:

- Camada de Apresentação (Controllers)
- Camada de Casos de Uso (Services)
- Camada de Domínio (Entities)
- Camada de Infraestrutura (Repositories, External Services)

### Estrutura de Pastas Frontend

