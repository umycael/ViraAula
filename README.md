# ViraAula

**Do YouTube para o seu aprendizado!** Resumos e aulas completas.

O ViraAula recebe o link de um vídeo do YouTube e usa inteligência artificial para gerar um **resumo** e uma **aula completa** em Markdown, prontos para copiar e colar no Notion, no Google Docs ou no bloco de notas. Funciona melhor com vídeos em que o conteúdo está no áudio: aulas, podcasts, palestras e relatos.

## Como funciona

```
Link do YouTube
   ↓
yt-dlp + ffmpeg   → baixa o áudio (mp3)
   ↓
Groq (Whisper)    → transcreve o áudio em texto
   ↓
Gemini            → gera o resumo
   ↓
Gemini            → transforma o resumo em uma aula
```

## Tecnologias

- **Back-end** (`viraaula-backend`): Java 21, Spring Boot, Maven
- **Front-end** (`viraaula-frontend`): Next.js, React, TypeScript
- **IA:** Groq (Whisper) para transcrição e Google Gemini para texto, ambos com plano gratuito

## O que você precisa ter instalado

- [Java 21](https://adoptium.net/)
- [Node.js 20 ou superior](https://nodejs.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) e [ffmpeg](https://ffmpeg.org/)

No Mac, com Homebrew:

```bash
brew install yt-dlp ffmpeg
```

Confirme que funcionou:

```bash
java --version
node --version
yt-dlp --version
ffmpeg -version
```

## Chaves de API (gratuitas)

1. **Groq:** crie uma chave em [console.groq.com](https://console.groq.com)
2. **Gemini:** crie uma chave em [aistudio.google.com](https://aistudio.google.com)

Guarde as chaves como **variáveis de ambiente**, para nunca ficarem escritas nos arquivos do projeto.

No Mac ou Linux (zsh):

```bash
echo 'export GROQ_API_KEY="sua-chave-do-groq"' >> ~/.zshrc
echo 'export GEMINI_API_KEY="sua-chave-do-gemini"' >> ~/.zshrc
source ~/.zshrc
```

No Windows (PowerShell):

```powershell
setx GROQ_API_KEY "sua-chave-do-groq"
setx GEMINI_API_KEY "sua-chave-do-gemini"
```

Depois de definir as variáveis, **feche e reabra o terminal e a IDE**.

## Como rodar

### 1. Clonar o projeto

```bash
git clone https://github.com/umycael/viraaula.git
cd viraaula
```

### 2. Back-end (porta 8080)

```bash
cd viraaula-backend
./mvnw spring-boot:run
```

Quando aparecer `Started AnalisadorvideosApplication` no terminal, o back-end está no ar.

### 3. Front-end (porta 3000)

Em **outro terminal**:

```bash
cd viraaula-frontend
npm install
npm run dev
```

Se não existir o arquivo `.env.local` na pasta `viraaula-frontend`, crie com este conteúdo:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

> O front-end precisa rodar na porta **3000**, porque o back-end só aceita requisições dessa origem (CORS).

## Como usar

1. Na tela inicial, clique em **Começar agora**.
2. Cole o link de um vídeo do YouTube e clique em **Gerar aula**.
3. Aguarde de 20 a 40 segundos, pois o vídeo é baixado, transcrito e resumido.
4. Use **Copiar resumo** ou **Copiar aula** e cole onde quiser.

## API do back-end

**POST** `/api/analises`

Corpo da requisição:

```json
{ "url": "https://www.youtube.com/watch?v=..." }
```

Resposta de sucesso:

```json
{ "resumo": "...", "aula": "..." }
```

Resposta de erro:

```json
{ "mensagem": "..." }
```

## Limitações conhecidas

- O áudio enviado para transcrição tem limite de **25 MB**, o que equivale a cerca de 1h40 de vídeo.
- Os planos gratuitos da Groq e do Gemini têm limites de uso, e podem retornar erro em horários de muita demanda.
- Vídeos privados, indisponíveis ou sem fala não podem ser analisados.
- Se o Gemini retornar erro de modelo indisponível (404 ou 503), troque o valor de `gemini.model` em `viraaula-backend/src/main/resources/application.properties` por outro modelo Flash disponível no Google AI Studio.

## Autor

Feito por [umycael](https://github.com/umycael).