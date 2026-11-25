# Gestão de Pets API

API REST para cadastro e consulta de pets, desenvolvida com Node.js, Express e MongoDB, utilizando autenticação JWT.

## Funcionalidades

- Autenticação de administrador por JWT.
- Cadastro de pets.
- Consulta de pets cadastrados.
- Persistência dos dados no MongoDB.
- Documentação interativa com Swagger.
- Testes automatizados com Mocha, Chai e SuperTest.
- Testes de carga com Apache JMeter.

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Swagger / OpenAPI
- Mocha
- Chai
- SuperTest
- Apache JMeter

## Pré-requisitos

- Node.js 24 LTS.
- MongoDB em execução.
- Java e Apache JMeter 5.5 ou superior para os testes de carga.

## Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/AlineRodrigues/gestao-de-pets-api.git
cd gestao-de-pets-api
```

Instale as dependências:

```bash
npm install
```

## Configuração do ambiente

Crie o arquivo `.env` a partir do modelo disponibilizado:

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Abra o arquivo `.env` e configure as variáveis:

- `PORT`: porta de execução da API.
- `MONGODB_URI`: endereço do banco de dados principal.
- `MONGODB_TEST_URI`: endereço do banco de dados utilizado nos testes.
- `JWT_SECRET`: chave secreta forte para assinatura dos tokens JWT.
- `JWT_EXPIRES_IN`: tempo de validade do token.
- `ADMIN_EMAIL`: e-mail do administrador inicial.
- `ADMIN_PASSWORD`: senha forte do administrador inicial.

Gere uma chave JWT aleatória com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Substitua os valores fictícios do `.env.example` pelas configurações locais. Não publique o arquivo `.env`.

O administrador inicial é criado automaticamente quando a aplicação é iniciada, caso ainda não exista.

## Executar a API

Com o MongoDB em execução e o arquivo `.env` configurado:

```bash
npm start
```

A API estará disponível em:

`http://localhost:3000`

A documentação interativa Swagger estará disponível em:

`http://localhost:3000/api-docs`

## Endpoints

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/auth/login` | Realizar login e obter token JWT | Não |
| POST | `/api/pets` | Cadastrar um pet | Sim |
| GET | `/api/pets` | Consultar pets cadastrados | Sim |

As rotas de pets exigem um token JWT válido no cabeçalho `Authorization`, no formato `Bearer <token>`.

## Executar os testes automatizados

Para executar os testes:

```bash
npm test
```

Os testes verificam a autenticação, o bloqueio de acessos não autorizados, o cadastro e a consulta de pets.

Os testes utilizam um banco MongoDB separado do banco principal.

## Testes de carga com Apache JMeter

O projeto inclui o arquivo `jmeter/pets-load-test.jmx`, com dois modelos de carga:

- **Modelo fechado:** utiliza usuários virtuais concorrentes.
- **Modelo aberto:** utiliza uma taxa de chegada de novos fluxos ao longo do tempo.

Os dois cenários executam login, cadastro e consulta de pets.

As instruções de configuração e execução estão disponíveis em:

`jmeter/README.md`

## Documentação da API

A especificação OpenAPI está disponível em:

`docs/openapi.yaml`

A documentação interativa também pode ser acessada pelo Swagger após iniciar a aplicação.

## Segurança

- Credenciais e chaves secretas devem ser configuradas por variáveis de ambiente.
- O arquivo `.env` não deve ser versionado.
- O arquivo `.env.example` contém apenas valores fictícios.
- As senhas dos administradores são armazenadas com hash.

## Licença

Projeto acadêmico desenvolvido para fins educacionais.