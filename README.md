# 🏗️ Projeto de Estudo: Clean Architecture com LocalStack e DynamoDB

Este repositório foi criado para estudar e praticar conceitos de **Clean Architecture** (Arquitetura Limpa) utilizando **LocalStack** para simular serviços AWS localmente, com foco no **DynamoDB**.

## 💡 Ideia do Repositório

O objetivo principal deste projeto é demonstrar na prática como implementar uma aplicação seguindo os princípios da Clean Architecture, utilizando DynamoDB como banco de dados e LocalStack para desenvolvimento local. Isso permite:

- **Desenvolvimento offline**: Sem necessidade de conectar aos serviços AWS reais
- **Testes rápidos**: Execução de testes sem custos ou latência da AWS
- **Aprendizado prático**: Implementação hands-on dos conceitos de arquitetura limpa
- **Simulação real**: Ambiente que replica fielmente o comportamento do DynamoDB

## 🎯 Conceitos Estudados

### Clean Architecture

- **Separação de responsabilidades** em camadas bem definidas
- **Inversão de dependências** para baixo acoplamento
- **Domain-driven design** com entidades de domínio
- **Use cases** como regras de negócio da aplicação
- **Repositories pattern** para abstração do acesso a dados

### Estrutura do Projeto

```
src/
├── domain/           # Camada de domínio (regras de negócio)
│   ├── entities/     # Entidades do domínio
│   └── repositories/ # Contratos dos repositórios
├── application/      # Camada de aplicação (casos de uso)
│   └── use-cases/    # Casos de uso da aplicação
└── infra/           # Camada de infraestrutura
    ├── config/      # Configurações (AWS, etc.)
    ├── factories/   # Factories para injeção de dependência
    ├── http/        # Servidor HTTP (Fastify)
    ├── repositories/# Implementações dos repositórios
    └── services/    # Serviços externos (AWS SDK)
```

## 🛠️ Tecnologias Utilizadas

### Core

- **TypeScript** - Linguagem principal
- **Node.js** - Runtime JavaScript

### Framework Web

- **Fastify** - Framework web rápido e eficiente
- **@fastify/sensible** - Plugin com utilitários para Fastify

### Banco de Dados

- **DynamoDB** - Banco NoSQL da AWS
- **@aws-sdk/client-dynamodb** - SDK oficial da AWS para DynamoDB

### Desenvolvimento Local

- **LocalStack** - Simula serviços AWS localmente
- **Docker & Docker Compose** - Containerização
- **DynamoDB Admin** - Interface web para visualizar dados do DynamoDB

### Observabilidade

- **Prometheus** - Coleta e armazenamento de métricas
- **Loki** - Agregação e consulta de logs
- **Grafana** - Visualização de métricas e logs
- **Grafana Alloy** - Coleta de logs de containers

### Ferramentas de Desenvolvimento

- **tsx** - Execução direta de TypeScript
- **TypeScript Compiler** - Compilação para JavaScript

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ instalado

### Passo a Passo

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd localStackWithDynamoDB
```

2. **Instale as dependências**

```bash
npm install
```

3. **Inicie o LocalStack com DynamoDB**

```bash
docker-compose up -d
```

4. **Execute a aplicação**

```bash
npm run dev
```

### Acessos

- **API**: http://localhost:3000
- **DynamoDB Admin**: http://localhost:8001
- **LocalStack**: http://localhost:4566
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Loki**: http://localhost:3100

## 📋 Funcionalidades Implementadas

- ✅ Criação de usuários
- ✅ Configuração do DynamoDB local
- ✅ Estrutura de Clean Architecture
- ✅ Injeção de dependências
- ✅ Mapeamento de dados (DynamoDB ↔ Domain)
- ✅ Stack completa de observabilidade (Prometheus, Loki, Grafana)
- ✅ Coleta automática de métricas da aplicação
- ✅ Agregação de logs de containers e aplicação

## 📊 Observabilidade

O projeto inclui uma stack completa de observabilidade configurada:

### Prometheus

- **Coleta de métricas** da aplicação Fastify em `/metrics`
- **Métricas disponíveis**: HTTP requests, response times, status codes
- **Configuração**: `prometheus.yml` com scraping da aplicação

### Loki

- **Agregação de logs** de containers Docker
- **Logs da aplicação** estruturados em JSON
- **Coleta via Grafana Alloy** com parsing automático

### Grafana

- **Dashboards pré-configurados** para métricas e logs
- **Data sources** automaticamente provisionados
- **Visualizações** de performance da aplicação e logs em tempo real

### Como Monitorar

1. **Acesse o Grafana** em http://localhost:3000 (admin/admin)
2. **Visualize métricas** no dashboard "Application Metrics"
3. **Consulte logs** no dashboard "Application Logs"
4. **Explore métricas** diretamente no Prometheus em http://localhost:9090

## 🧪 Testando a API

Utilize o arquivo `api.http` na raiz do projeto para testar os endpoints disponíveis.

## 📚 Aprendizados

Este projeto demonstra:

- Como estruturar uma aplicação seguindo Clean Architecture
- Integração com DynamoDB usando LocalStack
- Padrões de design como Repository e Factory
- Separação clara entre camadas de domínio, aplicação e infraestrutura
- Configuração de ambiente de desenvolvimento local para AWS
- Implementação completa de observabilidade com Prometheus, Loki e Grafana
- Coleta e visualização de métricas e logs em aplicações containerizadas

---

💻 **Desenvolvido para fins de estudo e aprendizado de Clean Architecture, LocalStack e DynamoDB**
