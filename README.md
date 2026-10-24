# Projeto 1 — Microblog

Back-end de uma aplicação de microblog desenvolvida para a disciplina de **Programação Web Backend**. Usuários podem publicar textos, encontrar publicações e interagir por meio de comentários.

## Integrante

- Vinícius Souza Dias — [@vinicius-10](https://github.com/vinicius-10)

## Descrição

A aplicação oferece uma API HTTP e páginas HTML simples para cadastrar usuários, criar e buscar postagens, visualizar detalhes e gerenciar comentários vinculados às publicações. Os dados são armazenados no MongoDB usando Mongoose.

## Entidades e classes implementadas

| Entidade | Campos principais | Relacionamentos |
| --- | --- | --- |
| **Usuario** | Nome, e-mail e senha | Pode criar postagens e comentários |
| **Postagem** | Título e conteúdo | Pertence a um usuário |
| **Comentario** | Conteúdo | Pertence a um usuário e a uma postagem |

Os schemas estão em `app/models/`; o acesso ao banco é organizado pelos DAOs em `app/dao/`; os endpoints são tratados pelos controllers em `app/controllers/`.

## Funcionalidades

- Cadastro de usuários com validação de e-mail e senha.
- Criação de postagens associadas a usuários identificados por e-mail.
- Listagem e busca de postagens por título ou conteúdo.
- Visualização individual da postagem e dos comentários vinculados.
- Edição e exclusão de postagens.
- Criação, edição e exclusão de comentários.
- Remoção dos comentários vinculados ao excluir uma postagem.

> A aplicação ainda não possui autenticação. As rotas de edição e exclusão não verificam a identidade de quem as solicita.

## Tecnologias

- Node.js 20.19 ou superior (necessário para as versões instaladas do MongoDB Driver e do Mongoose).
- npm 9 ou superior (compatível com o lockfile versão 3; versões atuais do Node.js incluem npm).
- Express.
- MongoDB Atlas.
- Mongoose.
- Docker Desktop com Docker Compose v2 (opcional, para execução containerizada).

## Requisitos para executar

Escolha uma das formas de execução:

- **Com Docker:** Docker Desktop instalado e em execução, com Docker Compose disponível.
- **Localmente:** Node.js 20.19 ou superior e npm 9 ou superior instalados.
- **Banco de dados:** uma instância MongoDB Atlas acessível pela rede. O serviço MongoDB local do `docker-compose.yml` está desativado; o Compose executa a aplicação Node.js e usa o Atlas configurado no `.env`.

Para conferir as versões instaladas localmente, execute `node --version` e `npm --version`. A execução por Docker usa a versão de Node.js definida na imagem do [Dockerfile](./Dockerfile); não é necessário instalar Node.js ou npm na máquina host nesse caso.

## Configuração do MongoDB Atlas

1. Crie uma conta e um cluster no [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Crie um usuário de banco de dados e defina uma senha.
3. Em **Network Access**, autorize o endereço IP da máquina que executará a aplicação.
4. No cluster, escolha **Connect** e copie a connection string para Node.js.
5. Substitua o usuário, a senha e o cluster na URI. Inclua o nome do banco, por exemplo:

   ```text
   mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority
   ```

   Se a senha contiver caracteres especiais, faça o URL encoding desses caracteres.

Consulte também o material de configuração MongoDB disponibilizado pela disciplina: [guia no Moodle da UTFPR](https://moodle.utfpr.edu.br/mod/book/view.php?id=2172296).

## Instalação e configuração com Docker

Na raiz do repositório, crie o arquivo local `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Edite o `.env` e configure os valores:

```env
PORT_SERVER=8080
MONGO_URL_ATLAS=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority
```

O arquivo `.env` contém credenciais e não deve ser enviado ao Git.

## Instalar e executar sem Docker

Instale as dependências na pasta `app` usando o lockfile do projeto:

```bash
cd app
npm ci
```

Configure as variáveis de ambiente no terminal antes de iniciar. Substitua a URI de exemplo pelas credenciais do seu MongoDB Atlas.

No Linux ou macOS:

```bash
export PORT_SERVER=8080
export MONGO_URL_ATLAS='mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority'
npm start
```

No PowerShell:

```powershell
$env:PORT_SERVER = "8080"
$env:MONGO_URL_ATLAS = "mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/microblog?retryWrites=true&w=majority"
npm start
```

O comando `npm start` inicia a aplicação em `http://localhost:8080`. A execução local não carrega o arquivo `.env` automaticamente; configure as variáveis no terminal como mostrado acima.

## Executar com Docker Compose

Com o `.env` configurado e o Docker Desktop em execução, volte à raiz do repositório e execute:

```bash
docker compose up --build
```

A aplicação estará disponível em `http://localhost:8080` (ou na porta definida em `PORT_SERVER`). Para encerrar:

```bash
docker compose down
```

## Páginas e endpoints

| Método | Caminho | Descrição |
| --- | --- | --- |
| GET | `/cadastroUsuario` | Formulário para cadastro de usuário |
| POST | `/cadastroUsuario` | Cadastra usuário recebendo JSON |
| GET | `/criarPostagem` | Formulário para criar postagem |
| POST | `/criarPostagem` | Cria postagem associada ao e-mail de um usuário |
| GET | `/visualizarPostagens` | Lista e busca postagens |
| GET | `/visualizarPostagem/:id` | Página de detalhes da postagem e comentários |
| GET | `/postagens?q=termo` | Lista postagens; `q` filtra título e conteúdo |
| GET | `/postagens/:id` | Consulta uma postagem |
| PATCH | `/postagens/:id` | Edita título e conteúdo |
| DELETE | `/postagens/:id` | Exclui postagem e comentários vinculados |
| GET | `/postagens/:id/comentarios` | Lista comentários da postagem |
| POST | `/postagens/:id/comentarios` | Cria comentário |
| PATCH | `/postagens/:id/comentarios/:comentarioId` | Edita comentário |
| DELETE | `/postagens/:id/comentarios/:comentarioId` | Exclui comentário |

## Estrutura do projeto

```text
.
├── app/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── logs/
│   │   ├── errors.log
│   │   └── validations.log
│   ├── models/
│   ├── public/
│   ├── utils/
│   ├── app.js
│   ├── package.json
│   └── server.js
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

As exceções da aplicação são registradas em `app/logs/errors.log`, incluindo data e hora, operação, tipo e mensagem. Os resultados das validações de entrada são registrados em `app/logs/validations.log`, indicando se cada validação foi aprovada ou reprovada, a regra validada, a operação e a data e hora.
