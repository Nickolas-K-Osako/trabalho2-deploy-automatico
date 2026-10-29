# Trabalho 2 — Deploy Automático em VM

## Descrição

Aplicação web para gerenciamento de usuários, com funcionalidades de cadastro, listagem, edição e exclusão (CRUD).

O projeto utiliza Docker Compose para executar o frontend e o backend em uma máquina virtual Ubuntu Server, com deploy automatizado pelo GitHub Actions.

## Tecnologias utilizadas

- Next.js e React
- TypeScript
- JSON Server
- Docker e Docker Compose
- Ubuntu Server
- Git e GitHub
- GitHub Actions (self-hosted runner)
- Oracle VirtualBox

## Infraestrutura

- **Sistema operacional:** Ubuntu Server
- **Virtualização:** Oracle VirtualBox
- **IP da VM:** `192.168.18.215`
- **Porta da aplicação:** `3000`
- **Endereço:** `http://192.168.18.215:3000`

O endereço é acessível a partir da rede local, enquanto a VM estiver ligada e os contêineres estiverem em execução.

## Funcionamento do deploy automático

O GitHub Actions utiliza um runner self-hosted instalado na máquina virtual Ubuntu Server.

A cada push na branch `main`, o workflow executa:

1. Atualização do repositório com `git pull`.
2. Reconstrução e inicialização dos contêineres com `docker compose up -d --build`.
3. Verificação dos serviços com `docker compose ps`.

Dessa forma, as alterações enviadas ao GitHub são publicadas automaticamente na VM.

## Execução manual

Na pasta do projeto, execute:

```bash
docker compose up -d --build
```

Para verificar os contêineres:

```bash
docker compose ps
```

## Integrantes

- Nickolas Keiji Osako

## Repositório

https://github.com/Nickolas-K-Osako/trabalho2-deploy-automatico