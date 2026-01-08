# 📘 Guia Completo de Deploy na Vercel

## Pré-requisitos

1. Conta no GitHub (gratuita) - [github.com](https://github.com)
2. Conta na Vercel (gratuita) - [vercel.com](https://vercel.com)

## Passo a Passo Detalhado

### 1. Preparar o Código no GitHub

1. Crie um repositório no GitHub:
   - Acesse github.com
   - Clique em "New repository"
   - Nome: `adolesanto-doacoes`
   - Deixe como público
   - Clique em "Create repository"

2. Suba o código para o GitHub:
   ```bash
   cd adolesanto-doacoes
   git init
   git add .
   git commit -m "Initial commit - Sistema de doações Adolesanto"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/adolesanto-doacoes.git
   git push -u origin main
   ```

### 2. Deploy na Vercel

1. Acesse [vercel.com/signup](https://vercel.com/signup)
2. Faça login com sua conta do GitHub
3. Autorize a Vercel a acessar seus repositórios
4. Na dashboard da Vercel, clique em "Add New..." → "Project"
5. Selecione o repositório `adolesanto-doacoes`
6. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `./` (deixe como está)
   - **Build Command**: `npm run build` (já configurado)
   - **Output Directory**: `.next` (já configurado)
   - **Install Command**: `npm install` (já configurado)
7. Clique em "Deploy"
8. Aguarde 2-3 minutos para o build completar
9. Seu site estará disponível em: `https://adolesanto-doacoes.vercel.app`

### 3. Configurar Domínio Personalizado (Opcional)

Se você tem um domínio próprio:

1. Na dashboard do projeto na Vercel
2. Vá em "Settings" → "Domains"
3. Adicione seu domínio
4. Siga as instruções para configurar o DNS

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

- [ ] Site abre corretamente
- [ ] Todas as doações estão listadas
- [ ] Filtros por dia funcionam
- [ ] Modal de doação abre e fecha
- [ ] Doações são salvas (recarregue a página)
- [ ] Barra de progresso atualiza
- [ ] Design responsivo funciona em mobile

## 🔄 Atualizações Futuras

Sempre que você fizer alterações:

```bash
git add .
git commit -m "Descrição da alteração"
git push
```

A Vercel detecta automaticamente e faz o deploy da nova versão!

## 🆘 Problemas Comuns

### Build falhou
- Verifique se todos os arquivos foram commitados
- Confira se não há erros de TypeScript
- Execute `npm run build` localmente primeiro

### Site não carrega
- Verifique o log de build na Vercel
- Confirme que a porta 3000 não está sendo especificada (Vercel usa porta própria)

### Doações não salvam
- Verifique se o navegador permite LocalStorage
- Teste em modo anônimo/privado para descartar extensões

## 📊 Recursos Gratuitos da Vercel

- ✅ Deploys ilimitados
- ✅ HTTPS automático
- ✅ Preview de branches
- ✅ 100GB de bandwidth por mês
- ✅ Atualizações automáticas

## 💡 Dicas

1. **Compartilhe o Link**: Após o deploy, compartilhe o link com a comunidade
2. **QR Code**: Gere um QR code do link para facilitar o acesso
3. **Redes Sociais**: Divulgue nas redes da paróquia
4. **WhatsApp**: Envie nos grupos da comunidade

## 🔗 Links Úteis

- Documentação Next.js: https://nextjs.org/docs
- Documentação Vercel: https://vercel.com/docs
- Suporte Vercel: https://vercel.com/support

---

**Sucesso no evento! 🙏**

*Dúvidas? Entre em contato com os organizadores.*
