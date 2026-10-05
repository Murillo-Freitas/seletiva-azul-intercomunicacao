# Azul Intercomunicação

Aplicação web desenvolvida para otimizar e unificar a comunicação de ocorrências de voo em tempo real entre o Centro de Controle Operacional (CCO), a equipe de pátio (Handling) e os Passageiros (Clientes).

## Funcionalidades

* **Autenticação Baseada em Perfis:** Acesso segmentado com interfaces dedicadas para `cco`, `handling` e `cliente`.
* **Atualizações em Tempo Real:** Sincronização instantânea de dados entre todos os usuários ativos utilizando Supabase Realtime (WebSockets).
* **Painel CCO (Controle Operacional):** Gerenciamento completo com criação, edição, exclusão e log histórico de ocorrências de voo.
* **Painel Handling (Pátio):** Visualização de alto contraste focada no Novo Horário de Partida (ETD), status operacional e roteiros padronizados para anúncios (PA / Megafone).
* **Painel Cliente:** Acompanhamento dinâmico do status do voo, exibindo o progresso da solução e mensagens oficiais da equipe.

## Tecnologias Utilizadas

* **Front-end:** React.js, Vite
* **Estilização:** Tailwind CSS
* **Back-end/BaaS:** Supabase (Autenticação, Banco de Dados PostgreSQL, Realtime)
* **Deploy:** Vercel

## Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/seletiva-azul-intercomunicacao.git](https://github.com/seu-usuario/seletiva-azul-intercomunicacao.git)```bash

2. Acesse a pasta do projeto e instale as dependências:
   ```bash
   cd seletiva-azul-intercomunicacao
   npm install```bash

3. Configure as variáveis de ambiente:
   Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Supabase:
   ```bash
   VITE_SUPABASE_URL=sua_url_do_projeto
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_publica```bash

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev```bash

## Autor
Murillo de Freitas Levis Araújo 3DSEM - Etec de Praia Grande 2026
