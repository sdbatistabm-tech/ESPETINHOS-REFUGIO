# Refúgio Distribuidora — Cardápio & Pedidos (PWA)

Sistema completo em **React (Vite) + Firebase** para venda de espetinhos crus temperados.

## Funcionalidades

- Cardápio público com controle de quantidade
- Pedido mínimo de 50 unidades
- Retirada ou Entrega (frete R$ 10,00)
- Pagamento via PIX (chave + QR Code)
- Envio do pedido para WhatsApp
- Histórico de pedidos do cliente
- Painel administrativo completo
- Upload de fotos dos produtos
- PWA (instalável no celular)

## Stack

- React 18 + Vite + React Router
- Firebase (Auth, Firestore, Storage, Cloud Messaging, Cloud Functions)
- PWA via vite-plugin-pwa

## Como rodar

1. Clone o repositório
2. Copie `.env.example` para `.env` e preencha as chaves do Firebase
3. `npm install`
4. `npm run dev`

Veja o README completo após o setup do Firebase.
