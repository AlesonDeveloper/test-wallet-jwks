import fs from 'fs'
import pemJwk from 'pem-jwk'

// Carrega chave pública do arquivo
const PUBLIC_KEY_PEM = fs.readFileSync(new URL('../public-key.pem', import.meta.url), 'utf8')

// Função para gerar JWKS dinâmico
export function getJWKS() {
  console.log('Gerando JWKS dinâmico...')
  const jwk = pemJwk.pem2jwk(PUBLIC_KEY_PEM)
  jwk.use = 'sig'
  jwk.alg = 'RS256'
  jwk.kid = 'dev-key-1'
  return { keys: [jwk] }
}

// Carrega chave privada do arquivo
export const PRIVATE_KEY_PEM = fs.readFileSync(new URL('../private-key.pem', import.meta.url), 'utf8')
