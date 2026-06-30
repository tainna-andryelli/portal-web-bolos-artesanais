# Portal Web Bolos Artesanais

Projeto desenvolvido para a cadeira de Projeto Integrador - Portal Web no curso de Sistemas Para Internet da Universidade do Vale do Rio dos Sinos (Unisinos).

## Tecnologias

### Frontend

- React 19 + TypeScript
- Tailwind CSS 4
- Vite

### Backend

- Node.js 22 + TypeScript
- Express 4
- Prisma ORM 5
- PostgreSQL 16

---

## Estrutura de Pastas

```
portal-web-bolos-artesanais/
├── frontend/
│   └── src/
│       ├── components/   # componentes React reutilizáveis
│       ├── pages/        # páginas da aplicação
│       ├── services/     # chamadas à API do backend
│       └── types/        # tipos TypeScript compartilhados
└── backend/
    ├── src/
    │   ├── index.ts      # ponto de entrada do servidor Express
    │   ├── controllers/  # lógica de cada rota
    │   ├── routes/       # definição das rotas da API
    │   └── middlewares/  # autenticação, validação, etc
    └── prisma/
        └── schema.prisma # schema e migrations do banco
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 22 LTS
- PostgreSQL 14 instalado e rodando localmente

### Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/` com base no `.env.example`:

```env
DATABASE_URL="postgresql://SEU_USUARIO@localhost:5432/bolos_artesanais"
PORT=3333
JWT_SECRET="uma-string-longa-e-aleatoria"
NODE_ENV=development
```

> Substitua `SEU_USUARIO` pelo seu usuário do sistema (rode `whoami` no terminal para descobrir).

Continue com os comandos:

```bash
npx prisma generate   # gera o Prisma Client
npx prisma migrate dev --name init  # cria as tabelas no banco
npm run db:seed       # cria a conta da vendedora
npm run dev           # inicia o servidor
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Como testar

O frontend e o backend precisam estar **rodando ao mesmo tempo**, cada um em um terminal separado.

| Parte    | Endereço                  | Como iniciar                  |
|----------|---------------------------|-------------------------------|
| Frontend | `http://localhost:5173`   | `cd frontend && npm run dev`  |
| Backend  | `http://localhost:3333`   | `cd backend && npm run dev`   |

Para confirmar que o backend está rodando, acesse `http://localhost:3333/products` — deve retornar um array JSON.

---

## Rotas da API

| Método | Rota                        | Descrição                        | Auth |
|--------|-----------------------------|----------------------------------|------|
| GET    | `/products`                 | Lista produtos disponíveis       | —    |
| GET    | `/products/:id`             | Detalhe de um produto            | —    |
| POST   | `/products`                 | Cria produto                     | sim  |
| PUT    | `/products/:id`             | Edita produto                    | sim  |
| DELETE | `/products/:id`             | Remove produto                   | sim  |
| POST   | `/orders`                   | Cria encomenda (cliente)         | —    |
| GET    | `/orders`                   | Lista pedidos                    | sim  |
| GET    | `/orders/:id`               | Detalhe do pedido                | sim  |
| PATCH  | `/orders/:id/status`        | Atualiza status do pedido        | sim  |
| POST   | `/auth/login`               | Login da vendedora               | —    |
| POST   | `/auth/logout`              | Logout                           | sim  |

Rotas marcadas com **sim** exigem o cookie de sessão obtido no login.

---

## Scripts disponíveis (backend)

```bash
npm run dev          # inicia o servidor em modo desenvolvimento com hot reload
npm run build        # compila o TypeScript para JavaScript
npm start            # inicia o servidor a partir do build compilado
npm run db:generate  # gera o Prisma Client
npm run db:migrate   # aplica migrations no banco
npm run db:seed      # cria a conta admin inicial
```

---

## Variáveis de Ambiente

O arquivo `.env` **não deve ser versionado**. Use o `.env.example` como referência:

```env
DATABASE_URL="postgresql://SEU_USUARIO@localhost:5432/bolos_artesanais"
PORT=3333
JWT_SECRET="sua-chave-secreta-aqui"
NODE_ENV=development
```

---

## Conta admin padrão (após rodar o seed)

| Campo | Valor           |
|-------|-----------------|
| Email | admin@bolos.com |
| Senha | admin123        |

> Troque a senha após o primeiro acesso.
