# Project Constitution

> This document defines the non-negotiable principles and governance rules for **neuro-acoustic-analyzer**.
> All agents and workflows must respect these principles.

## Project Overview

- **Name**: neuro-acoustic-analyzer
- **Type**: greenfield
- **Track**: solo
- **Created**: 2026-02-03

## Technical Stack

| Layer | Technology |
|-------|------------|
| **Stack** | Next.js (App Router) |
| **Language** | typescript |
| **Database** | postgresql |
| **ORM** | Prisma |
| **Auth** | none |

## Architecture: Domain-Driven Design

### Core Principles

1. Domain logic is the heart of the application
2. Entities have identity and lifecycle
3. Value objects are immutable and compared by value
4. Aggregates enforce consistency boundaries
5. Repositories abstract persistence
6. Domain events capture things that happened
7. Ubiquitous language shared between code and stakeholders

### Layer Responsibilities

### Domain
Core business logic - entities, value objects, domain services
**Rules:**
  - No dependencies on other layers
  - Pure business logic, no framework code
  - Entities encapsulate business rules
  - Value objects are immutable
  - Domain services contain cross-entity logic

### Application
Use cases and orchestration
**Rules:**
  - Depends only on Domain layer
  - Contains use case implementations
  - Defines port interfaces (repositories, external services)
  - No direct infrastructure dependencies
  - Coordinates domain objects to perform tasks

### Infrastructure
External concerns - database, APIs, frameworks
**Rules:**
  - Implements port interfaces from Application layer
  - Contains database repositories
  - Handles external API integrations
  - Framework-specific code lives here

### Presentation
User interface - controllers, views, CLI
**Rules:**
  - Depends on Application layer
  - Handles HTTP requests/responses
  - Maps between DTOs and domain objects
  - Validation of external input

## Quality Standards

### Testing Requirements

- **Unit Tests**: Required for all business logic
- **Framework**: Vitest
- **Command**: `npm run test`


### Code Quality

- **Linting**: ESLint (`npm run lint`)
- **Formatting**: Prettier (`npm run format`)
- **Type Checking**: TypeScript (`npm run typecheck`)

### Before Every Commit

```bash
npm run lint && npm run format && npm run typecheck && npm run test
```

## Security Principles

1. **No secrets in code** - Use environment variables
2. **Validate all inputs** - At system boundaries
3. **Parameterized queries only** - Never concatenate SQL
4. **Principle of least privilege** - Minimal permissions

## Anti-Patterns to AVOID

**Anemic Domain Model**: Entities with only getters/setters, no behavior
  Fix: Add business logic methods to entities. Domain rules should live in the domain layer.

**Domain Layer Database Dependency**: Domain entities importing ORM decorators or database types
  Fix: Keep domain entities pure. Use mappers in infrastructure layer to convert between domain and persistence.

**Leaking Domain Logic**: Business rules implemented in controllers or services outside domain
  Fix: Move business rules into domain entities or domain services.

## Governance

- This constitution is **immutable** during the project lifecycle
- All architectural decisions must reference this document
- Exceptions require explicit documentation and approval
