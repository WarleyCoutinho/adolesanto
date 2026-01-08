# 🚀 Guia Rápido - Adolesanto Doações

## O que é este projeto?

Um site para acompanhar as doações de alimentos para o evento Adolesanto (06, 07 e 08 de fevereiro) da Paróquia Santíssima Trindade.

## ✨ Funcionalidades

- **Progresso Visual**: Barra de progresso mostrando % de doações recebidas
- **Filtro por Dia**: Ver doações de sexta, sábado ou domingo
- **Sistema de Doação**: Pessoas podem clicar em "Doar" e registrar seu nome
- **Persistência**: Dados salvos no navegador (não precisa banco de dados)
- **Design Elegante**: Cores do evento (azul e dourado) com animações suaves

## 📦 Como usar

### Opção 1: Deploy Rápido (Recomendado)

1. Crie conta gratuita em [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Importe este projeto
4. Clique em "Deploy"
5. Pronto! Link disponível em 2 minutos

### Opção 2: Rodar Localmente

```bash
cd adolesanto-doacoes
npm install
npm run dev
```

Abra http://localhost:3000

## 📱 Compartilhando com a Comunidade

Após o deploy, você terá um link tipo:
```
https://adolesanto-doacoes.vercel.app
```

Compartilhe:
- ✅ Grupos de WhatsApp
- ✅ Redes sociais da paróquia
- ✅ Mural da igreja
- ✅ QR Code impresso

## 🔄 Como Atualizar Itens

Edite o arquivo `app/data.ts` para adicionar/remover itens.

Exemplo:
```typescript
{ 
  id: 'novo-item-1', 
  name: '10 kg de açúcar', 
  category: 'Sobremesa', 
  day: 'Sábado 07/02', 
  meal: 'Almoço', 
  donated: false, 
  donorName: '' 
}
```

Depois:
```bash
git add .
git commit -m "Adiciona novos itens"
git push
```

Vercel atualiza automaticamente!

## 💾 Dados e Privacidade

- **Armazenamento**: LocalStorage do navegador (cada pessoa vê seus próprios dados)
- **Não há servidor**: Tudo funciona no navegador do usuário
- **Sem cadastro**: Não precisa login ou senha
- **Gratuito**: Sem custos de hospedagem ou banco de dados

## ⚠️ Limitações

- Dados salvos apenas no navegador (se limpar cookies, perde tudo)
- Cada dispositivo tem sua própria lista
- Não há sincronização entre usuários
- Para uso real com múltiplos usuários, considere adicionar backend

## 🎯 Próximos Passos

Se quiser evolução:
1. Adicionar backend (Firebase, Supabase)
2. Sistema de autenticação
3. Dashboard administrativo
4. Notificações em tempo real
5. Geração de relatórios

## 📞 Suporte

Dúvidas sobre o código:
- Leia DEPLOY.md para guia completo
- Consulte README.md para detalhes técnicos

Dúvidas sobre o evento:
- WhatsApp: (62) 99248-6492 | (62) 99248-6496

---

**Que Deus abençoe o evento! 🙏✨**
