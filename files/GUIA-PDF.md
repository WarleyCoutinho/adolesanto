# 📄 Configuração do Relatório em PDF

## 📦 Instalação das Dependências

```bash
npm install jspdf jspdf-autotable
```

## 📁 Estrutura de Arquivos

```
src/
├── types.ts                           # Interface DonationItem
├── components/
│   └── DownloadReportButton.tsx      # Componente do botão
└── app/
    └── page.tsx                      # Página principal
```

## 🎨 Características do PDF

### ✅ O que está incluído:

1. **Cabeçalho Profissional**

   - Fundo azul com título "ADOLESANTO"
   - Subtítulo dourado "Santíssima Trindade"
   - Datas do evento
   - Data de geração do relatório

2. **Estatísticas Gerais**

   - Total de itens
   - Itens doados
   - Itens pendentes
   - Barra de progresso visual com percentual

3. **Tabela de Doações Detalhada**

   - Número sequencial
   - Nome do item
   - Nome do doador
   - Telefone
   - Tipo de doação (Item/PIX)
   - Data e hora da doação
   - Observações
   - Linhas alternadas para melhor leitura
   - Cabeçalho azul destacado

4. **Lista de Doadores**

   - Doadores únicos ordenados por quantidade de doações
   - Nome, telefone e número de itens doados
   - Cabeçalho dourado

5. **Informações de Contato**

   - WhatsApp
   - Dados PIX
   - Banco e titular
   - Box azul destacado

6. **Rodapé**
   - Versículo bíblico
   - Numeração de páginas

## 🎨 Paleta de Cores

```typescript
const primaryColor = [30, 58, 138]; // Azul principal (#1e3a8a)
const secondaryColor = [212, 175, 55]; // Dourado (#d4af37)
const lightGray = [243, 244, 246]; // Cinza claro
```

## 📱 Design Responsivo

O botão tem texto diferente em mobile e desktop:

- **Desktop:** "Baixar Relatório PDF"
- **Mobile:** "Relatório"

## 🔧 Personalização

### Alterar cores:

```typescript
// Em DownloadReportButton.tsx
const primaryColor = [30, 58, 138]; // Mude para sua cor
const secondaryColor = [212, 175, 55]; // Mude para sua cor
```

### Alterar colunas da tabela:

```typescript
columnStyles: {
  0: { cellWidth: 10, halign: 'center' },  // Número
  1: { cellWidth: 40 },                     // Item
  2: { cellWidth: 30 },                     // Doador
  3: { cellWidth: 28 },                     // Telefone
  4: { cellWidth: 20, halign: 'center' },  // Tipo
  5: { cellWidth: 30, fontSize: 7 },       // Data
  6: { cellWidth: 24, fontSize: 7 }        // Obs
}
```

### Adicionar logo (opcional):

```typescript
// Após o cabeçalho, adicione:
const imgData = "data:image/png;base64,..."; // Sua logo em base64
doc.addImage(imgData, "PNG", 15, 10, 30, 30);
```

## 📊 Exemplo de Uso

```typescript
import DownloadReportButton from "@/components/DownloadReportButton";

// No seu componente:
<DownloadReportButton items={items} />;
```

## 🚀 Melhorias Futuras

Você pode adicionar:

1. **Gráficos**

   ```bash
   npm install chart.js chartjs-node-canvas
   ```

2. **Imagens dos Comprovantes PIX**

   - Adicionar preview das imagens no PDF
   - Usar `doc.addImage()` com os comprovantes

3. **Filtros**

   - Permitir filtrar por dia
   - Permitir filtrar por tipo de doação

4. **Assinatura Digital**

   - Adicionar QR Code com link de verificação

5. **Envio por Email**
   - Integrar com SendGrid ou similar
   - Enviar PDF automaticamente

## 📝 Notas Importantes

- O PDF é gerado 100% no client-side (navegador)
- Não precisa de servidor para gerar
- Funciona offline
- Tamanho do arquivo é otimizado
- Fontes embutidas automaticamente

## 🐛 Solução de Problemas

**Erro: "jsPDF is not defined"**

```typescript
// Use importação dinâmica
const { jsPDF } = await import("jspdf");
```

**Tabela cortada na página**

```typescript
// autoTable adiciona páginas automaticamente
// Mas você pode forçar quebra:
if (yPosition > 250) {
  doc.addPage();
  yPosition = 20;
}
```

**Texto cortado**

```typescript
// Use splitTextToSize para texto longo
const lines = doc.splitTextToSize(longText, maxWidth);
doc.text(lines, x, y);
```

## 📚 Documentação

- jsPDF: https://github.com/parallax/jsPDF
- jsPDF-AutoTable: https://github.com/simonbengtsson/jsPDF-AutoTable

## 🎉 Resultado Final

O PDF gerado terá:

- ✅ Visual profissional e limpo
- ✅ Todas as informações organizadas
- ✅ Fácil de ler e imprimir
- ✅ Cores que combinam com o site
- ✅ Múltiplas páginas quando necessário
- ✅ Numeração automática
