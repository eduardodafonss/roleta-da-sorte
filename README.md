# Roleta da Sorte

Plataforma inicial (esqueleto) para "Roleta da Sorte" — app de investimento com roleta.

Arquivos incluídos:
- backend/ (API Node.js + Express)
- frontend/ (React Vite skeleton)
- db/schema.sql
- scripts/seed-admin.js (gera usuário admin; senha por padrão LAWISA11 ou use ADMIN_PASS env)
- docker-compose.yml (Postgres)

Instruções rápidas:
1. Copie .env.example -> .env e preencha DATABASE_URL e JWT_SECRET.
2. Rodar PostgreSQL (docker-compose up -d) ou use DATABASE_URL apontando para um Postgres.
3. Rodar schema SQL: psql -d roleta -f db/schema.sql
4. Rodar node scripts/seed-admin.js para criar o admin ou execute: ADMIN_PASS=LAWISA11 node scripts/seed-admin.js
5. Backend: cd backend && npm install && npm run dev
6. Frontend: cd frontend && npm install && npm run dev

Admin:
- Telefone: 938970887
- Senha (default): LAWISA11 (mude no primeiro login)

Observação: este é um ponto de partida. Implemente revisões de segurança e troca de senhas antes de uso em produção.
