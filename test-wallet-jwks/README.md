# Mock Wallet Server

Servidor Node.js para testes locais que publica JWKS e emite JWTs assinados com chave RSA fixa de DEV.

## Funcionalidades
- JWKS público em `/.well-known/jwks.json`
- Endpoint para emissão de JWT assinado: `POST /issue-jwt`
- Chave RSA de DEV fixa (não usar em produção)

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

## Endpoints

### JWKS público
`GET /.well-known/jwks.json`

### Emissão de JWT
`POST /issue-jwt`

Exemplo de requisição:

```bash
curl -s -X POST http://localhost:4001/issue-jwt \
  -H 'Content-Type: application/json' \
  -d '{
    "aud": "sesamo-api",
    "iss": "wallet.mock",
    "expSeconds": 600,
    "payload": {
      "transaction": {
        "reference_key": "4008b8bf-b58e-4abd-b5de-348fc772114e",
        "amount": 100,
        "payment_method": "credit_card",
        "trusted_card": true,
        "additional_information": { "data_only": true }
      },
      "risk_analyses": {
        "session_id": "risk-analyses-session-123",
        "safe_device": true,
        "risk_level": "low"
      }
    }
  }'
```

Resposta:

```json
{ "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRldi1rZXktMSIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2Fjd..." }
```

## Observações
- Não usar em produção!
- Para gerar nova chave RSA, utilize `openssl` ou ferramentas equivalentes.
