# Laboratório Kubernetes com K3s, LXD e Observabilidade

Projeto desenvolvido para estudar, na prática, a implantação e o monitoramento de uma aplicação full stack em um cluster Kubernetes.

A aplicação é simples e utiliza React, Caddy, Node.js e MongoDB. O foco principal é a infraestrutura, e não as funcionalidades do sistema.

## 1. Objetivo

Esta prova de conceito (PoC) foi criada para explorar alguns conceitos do Kubernetes:

- Implantação de aplicações com Deployments, Services e StatefulSets.
- Comunicação entre serviços e distribuição de Pods entre Workers.
- Configuração de variáveis de ambiente e armazenamento persistente.
- Monitoramento de CPU, memória e estado dos recursos com Prometheus e Grafana.

Todo o ambiente foi criado localmente, sem depender de um provedor de nuvem.
