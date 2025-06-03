# Usa imagem oficial do Node.js
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de configuração e lockfile primeiro (melhora cache!)
COPY package.json pnpm-lock.yaml prisma ./ 

# Instala dependências
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install

# Gera o client do Prisma (importante!)
RUN pnpm prisma generate

# Copia o restante do projeto
COPY . .

# Faz build do TypeScript
RUN pnpm build

# Cria pasta de sessões
RUN mkdir -p /app/sessions

# Expõe a porta (ajuste se for diferente)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/server.js"]
