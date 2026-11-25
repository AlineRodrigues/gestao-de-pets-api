

# Testes de carga da API de pets com JMeter

O arquivo `pets-load-test.jmx` contém dois cenários independentes. Ambos executam o mesmo fluxo autenticado: fazem login em `POST /api/auth/login`, extraem `$.token` da resposta, enviam `Authorization: Bearer <token>`, cadastram um pet em `POST /api/pets` e consultam a coleção em `GET /api/pets`.

## Pré-requisitos

- Node.js e dependências do projeto instaladas.
- Java e Apache JMeter 5.5 ou superior.
- API em execução e banco MongoDB disponível.
- Arquivo `.env` configurado na raiz do projeto, com `ADMIN_EMAIL` e `ADMIN_PASSWORD` definidos.

As credenciais são fornecidas ao JMeter por parâmetros externos. Elas não ficam armazenadas no arquivo `.jmx` nem nesta documentação.

## Cenários

- **Modelo fechado:** 10 usuários concorrentes, rampa de 10 segundos e duração de 60 segundos. Cada usuário inicia uma iteração após a anterior completar.
- **Modelo aberto:** chegada de 2 novos fluxos por segundo durante 60 segundos. Uma pausa final de 30 segundos permite concluir os fluxos já iniciados.

Ambos os grupos começam habilitados. Para comparar os modelos, execute-os juntos como fornecidos ou desabilite um grupo pela interface do JMeter para medir cada cenário separadamente.

## Execução no Windows PowerShell

Execute os comandos na raiz do projeto. Primeiro, carregue as credenciais do arquivo `.env` na sessão atual do PowerShell:

```powershell
$env:ADMIN_EMAIL = ((Get-Content .env | Where-Object { $_ -match '^ADMIN_EMAIL=' } | Select-Object -First 1) -replace '^ADMIN_EMAIL=', '').Trim()

$env:ADMIN_PASSWORD = ((Get-Content .env | Where-Object { $_ -match '^ADMIN_PASSWORD=' } | Select-Object -First 1) -replace '^ADMIN_PASSWORD=', '').Trim()
```

Depois, execute os testes em modo não gráfico:

```powershell
jmeter -n -t ".\jmeter\pets-load-test.jmx" -Jbase_host=localhost -Jbase_port=3000 "-Jadmin_email=$env:ADMIN_EMAIL" "-Jadmin_password=$env:ADMIN_PASSWORD" -Jduration=60 -Jopen_duration=60 -l ".\results.jtl"
```

Caso o Windows não reconheça o comando `jmeter`, utilize o caminho completo do arquivo `jmeter.bat`, localizado na pasta `bin` da instalação do Apache JMeter.

Para alterar a quantidade de usuários e a rampa do modelo fechado, também podem ser utilizados `-Jclosed_users=20` e `-Jclosed_ramp=15`.

Os resultados de carga podem criar muitos documentos de pets. Utilize uma instância de teste, nunca produção.

## O que cada peça faz

1. Os HTTP Request Defaults definem protocolo, host e porta em um único lugar.
2. O sampler de login envia JSON para a autenticação da API.
3. O JSON PostProcessor guarda o JWT por usuário virtual. Uma asserção confirma HTTP 200 no login.
4. O sampler POST envia um corpo válido; o nome inclui UUID para evitar colisões. A asserção espera HTTP 201.
5. O sampler GET lista os pets com o mesmo JWT. A asserção espera HTTP 200.
6. Os grupos diferem na geração de carga: usuários concorrentes fixos no modelo fechado e taxa de chegadas definida pelo tempo no modelo aberto.
