# Todo List App

Uma aplicação moderna de Todo List desenvolvida com NextJS, TypeScript, Tailwind CSS e Supabase.

## Funcionalidades

- ✅ **Criar** - Adicionar novas tarefas
- ✅ **Editar** - Modificar tarefas existentes
- ✅ **Excluir** - Remover tarefas
- ✅ **Marcar como Feito** - Marcar/desmarcar conclusão
- ✅ **Campos obrigatórios:**
  - Título (obrigatório)
  - Descrição (opcional)
  - Data de vencimento (opcional)
- ✅ **Botão "Aperfeiçoar com AI"** - Integração com IA para melhorar tarefas

## Design

O design segue a referência fornecida com:
- Fundo vermelho escuro
- Cards brancos para tarefas
- Layout limpo e moderno
- Interface responsiva

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute o script SQL do arquivo `database/schema.sql` no SQL Editor do Supabase
4. Copie as credenciais do projeto

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Executar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── TodoList.tsx
│   ├── TodoItem.tsx
│   └── TodoForm.tsx
├── lib/
│   ├── supabase.ts
│   └── todoService.ts
└── types/
    └── todo.ts
```

## Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e autenticação
- **React Hooks** - Gerenciamento de estado

## Funcionalidades da IA

O botão "Aperfeiçoar com AI" permite:
- Melhorar títulos de tarefas
- Expandir descrições
- Sugerir melhorias baseadas no prompt do usuário

Para integrar com uma API de IA real (como OpenAI), modifique a função `handleAIImprove` no componente `TodoItem.tsx`.

## Scripts Disponíveis

- `npm run dev` - Executar em modo de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar build de produção
- `npm run lint` - Executar linter

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
