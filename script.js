// ---------------------------------------------------------------
// Dados do jogo
// linha/coluna = posição da primeira letra no tabuleiro (começa em 0)
// direcao: "H" = horizontal, "V" = vertical
// ---------------------------------------------------------------
const palavras = [
  { resposta: "EEPROM",           linha: 0,  coluna: 3,  direcao: "H", pista: "Guarda configurações mesmo desligada e permite regravar um único byte sem apagar o resto." },
  { resposta: "ROM",              linha: 13, coluna: 2,  direcao: "H", pista: "Seu conteúdo de fábrica sobrevive ao desligamento e o processador apenas consulta, sem alterar." },
  { resposta: "ULA",              linha: 8,  coluna: 2,  direcao: "H", pista: "Circuito do processador que soma, subtrai e compara bits, sem decidir o que fazer." },
  { resposta: "DATABUS",          linha: 4,  coluna: 0,  direcao: "H", pista: "Caminho de duas mãos por onde o conteúdo trafega entre processador e memória." },
  { resposta: "CACHE",            linha: 11, coluna: 2,  direcao: "H", pista: "Intermediária veloz que evita idas à memória principal, guardando cópias do que é mais usado." },
  { resposta: "DMA",              linha: 13, coluna: 8,  direcao: "H", pista: "Controlador que move blocos entre periférico e memória, deixando o processador livre para outras tarefas." },

  { resposta: "REGISTRADORES",    linha: 0,  coluna: 6,  direcao: "V", pista: "Os menores e mais rápidos espaços do processador, guardam operandos e resultados imediatos." },
  { resposta: "MICROCONTROLADOR", linha: 0,  coluna: 8,  direcao: "V", pista: "Computador inteiro num só chip, dedicado a uma tarefa embarcada, como ler um sensor." },
  { resposta: "MEMORIADEMASSA",   linha: 0,  coluna: 10, direcao: "V", pista: "Retém sistema e arquivos mesmo desligado, com capacidade enorme e acesso bem mais lento." },
  { resposta: "FLASH",            linha: 2,  coluna: 3,  direcao: "V", pista: "Mantém dados sem energia e apaga em blocos inteiros; base dos SSDs e pen drives." },
  { resposta: "ADDRESSBUS",       linha: 3,  coluna: 0,  direcao: "V", pista: "Via de sentido único que informa à memória qual posição será lida ou escrita." },
  { resposta: "QUADCORE",         linha: 7,  coluna: 2,  direcao: "V", pista: "Processador em que o dobro de núcleos de um dual permite quatro tarefas simultâneas." },
  { resposta: "UC",               linha: 10, coluna: 4,  direcao: "V", pista: "Lê cada comando do programa e decide quais componentes agem, e em que ordem." }
];

// ---------------------------------------------------------------
// Estado
// ---------------------------------------------------------------
const casas = new Map();   // "linha,coluna" -> { linha, coluna, letra, palavras: [índices], div, input }
let palavraAtiva = null;   // índice em `palavras`
let direcaoAtual = "H";
let ultimaCasa = null;

const chave = (l, c) => `${l},${c}`;

const tabuleiroEl = document.getElementById("tabuleiro");
const contadorEl = document.getElementById("contador");
const mensagemEl = document.getElementById("mensagem");
const listaH = document.getElementById("pistas-h");
const listaV = document.getElementById("pistas-v");

// ---------------------------------------------------------------
// Montagem dos dados
// ---------------------------------------------------------------
let totalLinhas = 0;
let totalColunas = 0;

palavras.forEach((p, i) => {
  p.casas = [];
  for (let k = 0; k < p.resposta.length; k++) {
    const l = p.linha + (p.direcao === "V" ? k : 0);
    const c = p.coluna + (p.direcao === "H" ? k : 0);
    const id = chave(l, c);
    if (!casas.has(id)) {
      casas.set(id, { linha: l, coluna: c, letra: p.resposta[k], palavras: [] });
    }
    casas.get(id).palavras.push(i);
    p.casas.push(id);
    totalLinhas = Math.max(totalLinhas, l + 1);
    totalColunas = Math.max(totalColunas, c + 1);
  }
});

// Numeração: lê o tabuleiro da esquerda para a direita, de cima para baixo
let numero = 0;
for (let l = 0; l < totalLinhas; l++) {
  for (let c = 0; c < totalColunas; c++) {
    const comecam = palavras.filter(p => p.linha === l && p.coluna === c);
    if (comecam.length > 0) {
      numero++;
      comecam.forEach(p => { p.numero = numero; });
      casas.get(chave(l, c)).numero = numero;
    }
  }
}

// ---------------------------------------------------------------
// Desenho do tabuleiro
// ---------------------------------------------------------------
function desenharTabuleiro() {
  tabuleiroEl.style.gridTemplateColumns = `repeat(${totalColunas}, var(--cell))`;
  tabuleiroEl.innerHTML = "";

  for (let l = 0; l < totalLinhas; l++) {
    for (let c = 0; c < totalColunas; c++) {
      const casa = casas.get(chave(l, c));
      if (!casa) {
        const vazio = document.createElement("div");
        vazio.className = "vazio";
        tabuleiroEl.appendChild(vazio);
        continue;
      }

      const div = document.createElement("div");
      div.className = "casa";
      div.setAttribute("role", "gridcell");

      if (casa.numero) {
        const n = document.createElement("span");
        n.className = "num";
        n.textContent = casa.numero;
        div.appendChild(n);
      }

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 2;               // aceita 2 para conseguir trocar a letra ao digitar por cima
      input.autocomplete = "off";
      input.autocapitalize = "characters";
      input.spellcheck = false;
      input.setAttribute("aria-label", `Linha ${l + 1}, coluna ${c + 1}`);
      div.appendChild(input);

      casa.div = div;
      casa.input = input;

      input.addEventListener("focus", () => aoFocar(casa));
      input.addEventListener("click", () => aoClicar(casa));
      input.addEventListener("input", () => aoDigitar(casa));
      input.addEventListener("keydown", (e) => aoTecla(e, casa));

      tabuleiroEl.appendChild(div);
    }
  }
}

function desenharPistas() {
  listaH.innerHTML = "";
  listaV.innerHTML = "";

  const ordenadas = palavras
    .map((p, i) => ({ p, i }))
    .sort((a, b) => a.p.numero - b.p.numero);

  ordenadas.forEach(({ p, i }) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pista";
    btn.dataset.indice = i;
    btn.innerHTML =
      `<span class="n">${p.numero}</span>` +
      `<span class="texto"></span>` +
      `<span class="status" aria-hidden="true"></span>`;
    btn.querySelector(".texto").textContent = `${p.pista} (${p.resposta.length} letras)`;
    btn.addEventListener("click", () => irParaPalavra(i));
    p.pistaEl = btn;
    li.appendChild(btn);
    (p.direcao === "H" ? listaH : listaV).appendChild(li);
  });
}

// ---------------------------------------------------------------
// Navegação e destaque
// ---------------------------------------------------------------
function escolherPalavra(casa) {
  const daDirecao = casa.palavras.find(i => palavras[i].direcao === direcaoAtual);
  if (daDirecao !== undefined) return daDirecao;
  const outra = casa.palavras[0];
  direcaoAtual = palavras[outra].direcao;
  return outra;
}

function destacar(casa) {
  document.querySelectorAll(".casa.ativa, .casa.foco").forEach(el => el.classList.remove("ativa", "foco"));
  document.querySelectorAll(".pista.ativa").forEach(el => el.classList.remove("ativa"));

  if (palavraAtiva !== null) {
    palavras[palavraAtiva].casas.forEach(id => casas.get(id).div.classList.add("ativa"));
    palavras[palavraAtiva].pistaEl.classList.add("ativa");
  }
  if (casa) casa.div.classList.add("foco");
}

function aoFocar(casa) {
  palavraAtiva = escolherPalavra(casa);
  destacar(casa);
}

function aoClicar(casa) {
  // clicar de novo na mesma casa de cruzamento troca a direção
  const id = chave(casa.linha, casa.coluna);
  if (ultimaCasa === id && casa.palavras.length > 1) {
    direcaoAtual = direcaoAtual === "H" ? "V" : "H";
    palavraAtiva = escolherPalavra(casa);
    destacar(casa);
  }
  ultimaCasa = id;
  casa.input.select();
}

function irParaPalavra(indice) {
  const p = palavras[indice];
  direcaoAtual = p.direcao;
  const idVazia = p.casas.find(id => !casas.get(id).input.value);
  const alvo = casas.get(idVazia || p.casas[0]);
  ultimaCasa = chave(alvo.linha, alvo.coluna);
  palavraAtiva = indice;
  alvo.input.focus();
  destacar(alvo);
}

function moverNaPalavra(casa, passo) {
  const p = palavras[palavraAtiva];
  const pos = p.casas.indexOf(chave(casa.linha, casa.coluna));
  const prox = p.casas[pos + passo];
  if (prox) {
    const alvo = casas.get(prox);
    ultimaCasa = prox;
    alvo.input.focus();
    alvo.input.select();
    return alvo;
  }
  return null;
}

function moverPorSeta(casa, dl, dc) {
  const alvo = casas.get(chave(casa.linha + dl, casa.coluna + dc));
  if (!alvo) return;
  direcaoAtual = dl !== 0 ? "V" : "H";
  ultimaCasa = chave(alvo.linha, alvo.coluna);
  alvo.input.focus();
  alvo.input.select();
}

// ---------------------------------------------------------------
// Digitação
// ---------------------------------------------------------------
function limparLetra(texto) {
  // tira acentos e qualquer coisa que não seja A-Z; pega a última letra digitada
  const limpo = texto.normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase();
  return limpo.slice(-1);
}

function aoDigitar(casa) {
  const letra = limparLetra(casa.input.value);
  casa.input.value = letra;
  casa.div.classList.remove("certa", "errada");
  if (letra) moverNaPalavra(casa, +1);
}

function aoTecla(e, casa) {
  switch (e.key) {
    case "ArrowRight": e.preventDefault(); moverPorSeta(casa, 0, +1); break;
    case "ArrowLeft":  e.preventDefault(); moverPorSeta(casa, 0, -1); break;
    case "ArrowDown":  e.preventDefault(); moverPorSeta(casa, +1, 0); break;
    case "ArrowUp":    e.preventDefault(); moverPorSeta(casa, -1, 0); break;
    case "Backspace":
      if (!casa.input.value) {
        e.preventDefault();
        const anterior = moverNaPalavra(casa, -1);
        if (anterior) {
          anterior.input.value = "";
          anterior.div.classList.remove("certa", "errada");
        }
      }
      break;
    case "Enter":
      e.preventDefault();
      conferir();
      break;
  }
}

// ---------------------------------------------------------------
// Conferir, contador e reiniciar
// ---------------------------------------------------------------
function palavraEstaCerta(p) {
  return p.casas.every(id => {
    const c = casas.get(id);
    return c.input.value === c.letra;
  });
}

function conferir() {
  const certas = palavras.map(palavraEstaCerta);

  // pistas: ✓ ou ✗ em cada palavra
  palavras.forEach((p, i) => {
    p.pistaEl.classList.remove("certa", "errada");
    p.pistaEl.classList.add(certas[i] ? "certa" : "errada");
    p.pistaEl.querySelector(".status").textContent = certas[i] ? "✓" : "✗";
    p.pistaEl.title = certas[i] ? "Palavra certa" : "Palavra errada ou incompleta";
  });

  // casas: verde se faz parte de alguma palavra certa; vermelha se tem letra errada
  casas.forEach((casa) => {
    casa.div.classList.remove("certa", "errada");
    const emPalavraCerta = casa.palavras.some(i => certas[i]);
    if (emPalavraCerta) {
      casa.div.classList.add("certa");
    } else if (casa.input.value && casa.input.value !== casa.letra) {
      casa.div.classList.add("errada");
    }
  });

  const acertos = certas.filter(Boolean).length;
  contadorEl.textContent = `${acertos} de ${palavras.length} palavras`;

  if (acertos === palavras.length) {
    mensagemEl.textContent = "Acesso liberado! Você completou a cruzadinha.";
  } else {
    mensagemEl.textContent = "Palavras com ✗ estão erradas ou incompletas. Ajuste e confira de novo.";
  }
}

function reiniciar() {
  casas.forEach((casa) => {
    casa.input.value = "";
    casa.div.classList.remove("certa", "errada", "ativa", "foco");
  });
  palavras.forEach((p) => {
    p.pistaEl.classList.remove("certa", "errada", "ativa");
    p.pistaEl.querySelector(".status").textContent = "";
    p.pistaEl.removeAttribute("title");
  });
  contadorEl.textContent = `0 de ${palavras.length} palavras`;
  mensagemEl.textContent = "";
  palavraAtiva = null;
  ultimaCasa = null;
  direcaoAtual = "H";
  document.activeElement.blur();
}

// ---------------------------------------------------------------
// Início
// ---------------------------------------------------------------
document.getElementById("btn-conferir").addEventListener("click", conferir);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciar);

desenharTabuleiro();
desenharPistas();
contadorEl.textContent = `0 de ${palavras.length} palavras`;
