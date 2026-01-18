"use client";

import { ArrowLeft, Download, File } from "lucide-react";
import { useState } from "react";

export default function ListaCompras() {
  const [formato, setFormato] = useState("visualizar");

  const conteudoMarkdown = `# Lista de Compras

## Caldo da Sexta-feira

### Caldo de Milho:
- 02 mãos de milho
- 05 kg de peito de frango
- 02 lt de óleo
- 03 moldes de cebolinha
- 02 bandejas de pimenta de cheiro
- 02 pacotes de Sazón sabor frango
- 100 g de açafrão
- 200 g de alho
- 02 kg de cebola de cabeça
- 100 g de pimenta do reino

### Caldo de Mandioca:
- 10 kg de mandioca
- 03 kg de costela
- 02 kg de carne acém ou músculo
- 100 g de colorau
- 100 g de pimenta do reino
- 02 Sazón de costela
- 02 kg de cebola
- 01 kg de sal

---

## Almoço de Sábado

- 15 kg de arroz
- 06 kg de feijão
- 30 kg de carne de porco pernil
- 22 kg de batata
- 10 lt de leite
- 01 kg de margarina
- 02 pt Sazón para massa
- 08 lt de óleo
- 1/2 kg de alho
- 04 kg de cebola 🧅
- 100 g de pimenta do reino

### Para Salada 🥗:
- 05 cabeças de repolho grande
- 10 kg de tomate
- 03 moldes de cebolinha
- 12 limões
- 01 vidro de azeite

---

## Macarrão para o Jantar de Sábado

- 20 kg de macarrão:
  - 10 espaguete
  - 10 de sua preferência
- 12 kg de carne moída
- 08 kg de filé de peito de frango
- 05 kg de extrato de tomate
- 10 lt de leite
- 01 kg de margarina
- 01 kg de amido de milho
- 100 g de orégano
- 02 pt Sazón para massas
- 01 kg de sal
- 01 balde de azeitona sem caroço
- 04 kg de mussarela
- 04 kg de presunto
- 01 lata de 5 kg de milho
- 02 lt de creme de leite
- 02 bandejas de pimenta de cheiro
- 03 moldes de cebolinha
- 1/2 kg de alho
- 03 kg de cebola
- 04 kg de cebola de cabeça
- 100 g de pimenta do reino

---

## Almoço do Domingo

- 15 kg de arroz
- 06 kg de feijão
- 02 kg de bacon
- 02 kg de linguiça calabresa
- 01 kg de farinha de mandioca
- 20 kg de filé de peito de frango
- 10 lt de leite
- 03 lt de creme de leite
- 01 kg de amido de milho
- 01 kg de margarina
- 1/2 kg de alho
- 03 kg de cebola
- 04 kg de batata palha
- 01 kg de sal
- 04 lt de óleo
- 01 kg de requeijão
- 1/2 kg de ketchup

---

## Cardápio

**Sexta:**
Caldo de milho e mandioca (com e sem carne)

**Sábado:**
Arroz branco, feijão de caldo, carne de porco frita, purê de batata e salada

**Noite de Massas:**
Macarrão, molho branco, molho bolonhesa e acompanhamentos

**Domingo:**
Estrogonofe, arroz branco, feijão cremoso, batata palha e salada`;

  const gerarPDF = () => {
    const conteudoPDF = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lista de Compras</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; border-bottom: 2px solid #95a5a6; padding-bottom: 5px; }
    h3 { color: #7f8c8d; margin-top: 20px; }
    ul { list-style-type: none; padding-left: 0; }
    li { padding: 5px 0; padding-left: 20px; position: relative; }
    li:before { content: "•"; position: absolute; left: 0; color: #3498db; font-weight: bold; }
    hr { border: none; border-top: 1px solid #bdc3c7; margin: 30px 0; }
    .cardapio { background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin-top: 20px; }
    .cardapio p { margin: 10px 0; }
    .cardapio strong { color: #2c3e50; }
  </style>
</head>
<body>
  <h1>Lista de Compras</h1>
  
  <h2>Caldo da Sexta-feira</h2>
  
  <h3>Caldo de Milho:</h3>
  <ul>
    <li>02 mãos de milho</li>
    <li>05 kg de peito de frango</li>
    <li>02 lt de óleo</li>
    <li>03 moldes de cebolinha</li>
    <li>02 bandejas de pimenta de cheiro</li>
    <li>02 pacotes de Sazón sabor frango</li>
    <li>100 g de açafrão</li>
    <li>200 g de alho</li>
    <li>02 kg de cebola de cabeça</li>
    <li>100 g de pimenta do reino</li>
  </ul>
  
  <h3>Caldo de Mandioca:</h3>
  <ul>
    <li>10 kg de mandioca</li>
    <li>03 kg de costela</li>
    <li>02 kg de carne acém ou músculo</li>
    <li>100 g de colorau</li>
    <li>100 g de pimenta do reino</li>
    <li>02 Sazón de costela</li>
    <li>02 kg de cebola</li>
    <li>01 kg de sal</li>
  </ul>
  
  <hr>
  
  <h2>Almoço de Sábado</h2>
  <ul>
    <li>15 kg de arroz</li>
    <li>06 kg de feijão</li>
    <li>30 kg de carne de porco pernil</li>
    <li>22 kg de batata</li>
    <li>10 lt de leite</li>
    <li>01 kg de margarina</li>
    <li>02 pt Sazón para massa</li>
    <li>08 lt de óleo</li>
    <li>1/2 kg de alho</li>
    <li>04 kg de cebola 🧅</li>
    <li>100 g de pimenta do reino</li>
  </ul>
  
  <h3>Para Salada 🥗:</h3>
  <ul>
    <li>05 cabeças de repolho grande</li>
    <li>10 kg de tomate</li>
    <li>03 moldes de cebolinha</li>
    <li>12 limões</li>
    <li>01 vidro de azeite</li>
  </ul>
  
  <hr>
  
  <h2>Macarrão para o Jantar de Sábado</h2>
  <ul>
    <li>20 kg de macarrão:</li>
    <ul>
      <li>10 espaguete</li>
      <li>10 de sua preferência</li>
    </ul>
    <li>12 kg de carne moída</li>
    <li>08 kg de filé de peito de frango</li>
    <li>05 kg de extrato de tomate</li>
    <li>10 lt de leite</li>
    <li>01 kg de margarina</li>
    <li>01 kg de amido de milho</li>
    <li>100 g de orégano</li>
    <li>02 pt Sazón para massas</li>
    <li>01 kg de sal</li>
    <li>01 balde de azeitona sem caroço</li>
    <li>04 kg de mussarela</li>
    <li>04 kg de presunto</li>
    <li>01 lata de 5 kg de milho</li>
    <li>02 lt de creme de leite</li>
    <li>02 bandejas de pimenta de cheiro</li>
    <li>03 moldes de cebolinha</li>
    <li>1/2 kg de alho</li>
    <li>03 kg de cebola</li>
    <li>04 kg de cebola de cabeça</li>
    <li>100 g de pimenta do reino</li>
  </ul>
  
  <hr>
  
  <h2>Almoço do Domingo</h2>
  <ul>
    <li>15 kg de arroz</li>
    <li>06 kg de feijão</li>
    <li>02 kg de bacon</li>
    <li>02 kg de linguiça calabresa</li>
    <li>01 kg de farinha de mandioca</li>
    <li>20 kg de filé de peito de frango</li>
    <li>10 lt de leite</li>
    <li>03 lt de creme de leite</li>
    <li>01 kg de amido de milho</li>
    <li>01 kg de margarina</li>
    <li>1/2 kg de alho</li>
    <li>03 kg de cebola</li>
    <li>04 kg de batata palha</li>
    <li>01 kg de sal</li>
    <li>04 lt de óleo</li>
    <li>01 kg de requeijão</li>
    <li>1/2 kg de ketchup</li>
  </ul>
  
  <hr>
  
  <div class="cardapio">
    <h2>Cardápio</h2>
    <p><strong>Sexta:</strong><br>
    Caldo de milho e mandioca (com e sem carne)</p>
    
    <p><strong>Sábado:</strong><br>
    Arroz branco, feijão de caldo, carne de porco frita, purê de batata e salada</p>
    
    <p><strong>Noite de Massas:</strong><br>
    Macarrão, molho branco, molho bolonhesa e acompanhamentos</p>
    
    <p><strong>Domingo:</strong><br>
    Estrogonofe, arroz branco, feijão cremoso, batata palha e salada</p>
  </div>
</body>
</html>`;

    const blob = new Blob([conteudoPDF], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista-compras.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const baixarMarkdown = () => {
    const blob = new Blob([conteudoMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista-compras.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copiarMarkdown = () => {
    navigator.clipboard.writeText(conteudoMarkdown);
    alert("Markdown copiado para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-500 pb-3">
          Lista de Compras Integral - AdolesSanto 2026.
        </h1>

        <div className="flex gap-4 mb-6 flex-wrap">
          {/* <button
            onClick={() => setFormato("visualizar")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              formato === "visualizar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FileText size={20} />
            Visualizar
          </button> */}
          <button
            onClick={gerarPDF}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
          >
            <Download size={20} />
            Baixar (para PDF)
          </button>
          <button
            onClick={baixarMarkdown}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition"
          >
            <File size={20} />
            Baixar Markdown
          </button>
          <button
            onClick={copiarMarkdown}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            <File size={20} />
            Copiar Markdown
          </button>

          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            <ArrowLeft size={20} />
            Voltar
          </a>
        </div>

        {formato === "visualizar" && (
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4">
                Caldo da Sexta-feira
              </h2>

              <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
                Caldo de Milho:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>02 mãos de milho</li>
                <li>05 kg de peito de frango</li>
                <li>02 lt de óleo</li>
                <li>03 moldes de cebolinha</li>
                <li>02 bandejas de pimenta de cheiro</li>
                <li>02 pacotes de Sazón sabor frango</li>
                <li>100 g de açafrão</li>
                <li>200 g de alho</li>
                <li>02 kg de cebola de cabeça</li>
                <li>100 g de pimenta do reino</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                Caldo de Mandioca:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>10 kg de mandioca</li>
                <li>03 kg de costela</li>
                <li>02 kg de carne acém ou músculo</li>
                <li>100 g de colorau</li>
                <li>100 g de pimenta do reino</li>
                <li>02 Sazón de costela</li>
                <li>02 kg de cebola</li>
                <li>01 kg de sal</li>
              </ul>

              <hr className="my-8 border-gray-300" />

              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4">
                Almoço de Sábado
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>15 kg de arroz</li>
                <li>06 kg de feijão</li>
                <li>30 kg de carne de porco pernil</li>
                <li>22 kg de batata</li>
                <li>10 lt de leite</li>
                <li>01 kg de margarina</li>
                <li>02 pt Sazón para massa</li>
                <li>08 lt de óleo</li>
                <li>1/2 kg de alho</li>
                <li>04 kg de cebola 🧅</li>
                <li>100 g de pimenta do reino</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                Para Salada 🥗:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>05 cabeças de repolho grande</li>
                <li>10 kg de tomate</li>
                <li>03 moldes de cebolinha</li>
                <li>12 limões</li>
                <li>01 vidro de azeite</li>
              </ul>

              <hr className="my-8 border-gray-300" />

              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4">
                Macarrão para o Jantar de Sábado
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  20 kg de macarrão:
                  <ul className="list-circle list-inside ml-6 mt-1">
                    <li>10 espaguete</li>
                    <li>10 de sua preferência</li>
                  </ul>
                </li>
                <li>12 kg de carne moída</li>
                <li>08 kg de filé de peito de frango</li>
                <li>05 kg de extrato de tomate</li>
                <li>10 lt de leite</li>
                <li>01 kg de margarina</li>
                <li>01 kg de amido de milho</li>
                <li>100 g de orégano</li>
                <li>02 pt Sazón para massas</li>
                <li>01 kg de sal</li>
                <li>01 balde de azeitona sem caroço</li>
                <li>04 kg de mussarela</li>
                <li>04 kg de presunto</li>
                <li>01 lata de 5 kg de milho</li>
                <li>02 lt de creme de leite</li>
                <li>02 bandejas de pimenta de cheiro</li>
                <li>03 moldes de cebolinha</li>
                <li>1/2 kg de alho</li>
                <li>03 kg de cebola</li>
                <li>04 kg de cebola de cabeça</li>
                <li>100 g de pimenta do reino</li>
              </ul>

              <hr className="my-8 border-gray-300" />

              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4">
                Almoço do Domingo
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>15 kg de arroz</li>
                <li>06 kg de feijão</li>
                <li>02 kg de bacon</li>
                <li>02 kg de linguiça calabresa</li>
                <li>01 kg de farinha de mandioca</li>
                <li>20 kg de filé de peito de frango</li>
                <li>10 lt de leite</li>
                <li>03 lt de creme de leite</li>
                <li>01 kg de amido de milho</li>
                <li>01 kg de margarina</li>
                <li>1/2 kg de alho</li>
                <li>03 kg de cebola</li>
                <li>04 kg de batata palha</li>
                <li>01 kg de sal</li>
                <li>04 lt de óleo</li>
                <li>01 kg de requeijão</li>
                <li>1/2 kg de ketchup</li>
              </ul>

              <hr className="my-8 border-gray-300" />

              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Cardápio
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong className="text-blue-600">Sexta:</strong>
                    <br />
                    Caldo de milho e mandioca (com e sem carne)
                  </p>

                  <p>
                    <strong className="text-blue-600">Sábado:</strong>
                    <br />
                    Arroz branco, feijão de caldo, carne de porco frita, purê de
                    batata e salada
                  </p>

                  <p>
                    <strong className="text-blue-600">Noite de Massas:</strong>
                    <br />
                    Macarrão, molho branco, molho bolonhesa e acompanhamentos
                  </p>

                  <p>
                    <strong className="text-blue-600">Domingo:</strong>
                    <br />
                    Estrogonofe, arroz branco, feijão cremoso, batata palha e
                    salada
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
