import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { PRIVATE_KEY_PEM, getJWKS } from './keys.js'

const app = express()
app.use(bodyParser.json())

// JWKS público
app.get('/.well-known/jwks.json', async (req, res) => {
  const jwks = await getJWKS()
  res.json(jwks)
})

// Endpoint para emitir JWT assinado
app.post('/issue-jwt', (req, res) => {
  console.log('Emitindo JWT...')
  const { payload, aud = 'sesamo-api', iss = 'wallet.mock2', expSeconds = 300 } = req.body || {}

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'payload obrigatório (objeto JSON com { transaction, risk_analyses, ... })' })
  }

  const now = Math.floor(Date.now() / 1000)
  const claims = {
    ...payload,
    iat: now,
    nbf: now - 1,
    exp: now + Number(expSeconds),
    aud,
    iss
  }

  try {
    const token = jwt.sign(claims, PRIVATE_KEY_PEM, {
      algorithm: 'RS256',
      header: { kid: 'dev-key-1', typ: 'JWT' }
    })
    return res.json({ token })
  } catch (e) {
    return res.status(500).json({ error: 'falha ao assinar token', details: e.message })
  }
})

const PORT = process.env.MOCK_WALLET_PORT || 4001
app.listen(PORT, () => {
  console.log(`Mock Wallet rodando em http://localhost:${PORT}`)
  console.log(`JWKS em            http://localhost:${PORT}/.well-known/jwks.json`)
  console.log(`Emita JWT em POST http://localhost:${PORT}/issue-jwt`)
})
