# ☀️ GreenTech - Marketplace de Energia Renovável

![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![Node](https://img.shields.io/badge/Node-Express-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 📋 Sobre o Projeto

O **GreenTech** é uma plataforma fullstack desenvolvida para facilitar a compra e venda de créditos de energia solar. O sistema conecta produtores a consumidores, permitindo negociações transparentes, gestão de contratos e geração de faturas automatizadas.

O projeto foi construído com uma arquitetura separada (Client/Server), focando em performance, tipagem estática forte e uma interface de usuário moderna.

## 🚀 Funcionalidades Principais

* **Autenticação Segura:** Login e registro de usuários com criptografia (Bcrypt) e autenticação via Token JWT.
* **Gestão de Vendas:** CRUD completo para produtores cadastrarem novas cotas de energia, definindo valores e quantidades disponíveis.
* **Fluxo de Checkout Completo:** Experiência de compra fluida que engloba gerenciamento do carrinho, revisão de pedidos e simulação de pagamento.
* **Gerenciamento de Endereços:** Modal interativo para cadastro e seleção de endereço de entrega.
* **Emissão de Notas Fiscais:** Geração automática da Nota Fiscal e faturas em PDF (`pdfkit`) logo após a conclusão do pedido.
* **Sistema de Avaliações:** Funcionalidade que permite aos compradores avaliarem as cotas adquiridas, gerando confiabilidade na plataforma.
* **Validação de Dados:** Formulários robustos no frontend com Zod e React Hook Form para cadastro de clientes e endereço.
* **Interface Moderna:** UI moderna construída com Tailwind CSS v4 e componentes Radix UI.

## 🛠 Tecnologias Utilizadas

### Frontend (Client)
* **Core:** React 19, Vite, TypeScript
* **Estilização:** Tailwind CSS v4, Radix UI, Lucide React (Ícones)
* **Gerenciamento de Estado/Rotas:** React Router Dom v7
* **Formulários:** React Hook Form, Zod
* **HTTP Client:** Axios

### Backend (Server)
* **Core:** Node.js, Express, TypeScript
* **Banco de Dados:** PostgreSQL, TypeORM
* **Segurança:** BCrypt.js, JSON Web Token (JWT), CORS
* **Utils:** PDFKit (Geração de PDFs)

## 📦 Como Rodar o Projeto

### Pré-requisitos
* Node.js (v18+)
* Gerenciador de pacotes (NPM ou Yarn)
* Docker (Recomendado para o banco de dados)

### 1. Configuração do Banco de Dados (Docker)

O projeto está configurado para utilizar a porta **5433** (para evitar conflitos com instalações padrão do Postgres na 5432).

Se você estiver utilizando Docker, suba o container com o mapeamento de portas correto:

```bash
# Entre na pasta do servidor
cd backend

#Rode o docker
docker-compose up -d

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do backend e cole o conteúdo abaixo:
DB_HOST=localhost
DB_PORT=5433
DB_USER=app
DB_PASSWORD=secret
DB_NAME=tasksdb
JWT_SECRET=abacaxi

# Rode as migrations para criar as tabelas
npm run migration:up

# Popule o banco com dados iniciais
npm run seed

# Inicie o servidor em modo de desenvolvimento
npm run dev

# Em um novo terminal, entre na pasta do cliente
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (Opcional)
# Crie um arquivo .env na raiz do frontend caso precise alterar a URL da API
# Exemplo: VITE_API_BASE_URL=http://localhost:3000/api

# Inicie o servidor de desenvolvimento
npm run dev
```
Acesse a aplicação em: http://localhost:5173

## 👥 Desenvolvido por

* **Danillo Gustavo Monteiro** – Backend e Banco de Dados
* **Davi Aldivino Marques** – Frontend
* **Felipe Henrique Da Silva** – Backend e Banco de Dados
* **Giovanna Jürgensen** – QA
* **Felipe Kenzo Ogaçawara Sunakozawa** – Frontend
* **Yuri Chryst Oliveira Vieira** – Product Owner
