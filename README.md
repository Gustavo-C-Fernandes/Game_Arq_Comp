# Cruzadinha de Arquitetura Computacional

Jogo de cruzadinha que roda no navegador, feito em HTML, CSS e JavaScript puros, para treinar os termos de Tópicos de Arquitetura Computacional.

**Site publicado:** https://SEU-USUARIO.github.io/arqcomp-cruzadinha/

## Como jogar

1. Leia as pistas em **Horizontais** e **Verticais**. O número da pista é o mesmo número da casa no tabuleiro.
2. Clique numa casa (ou numa pista) e digite as letras. O cursor avança sozinho dentro da palavra.
3. Em casas de cruzamento, clique de novo na mesma casa para trocar entre horizontal e vertical.
4. Use as setas do teclado para se mover e Backspace para apagar.
5. Clique em **Conferir** para ver quais palavras estão certas (✓, verde) e quais estão erradas (✗, vermelho). O contador mostra quantas palavras você acertou.
6. Clique em **Reiniciar** para limpar o tabuleiro e jogar de novo.

As respostas não têm acento nem espaço (por exemplo, `MEMORIADEMASSA`).

## Palavras e pistas

### Horizontais

| Palavra | Pista |
|---|---|
| EEPROM | Guarda configurações mesmo desligada e permite regravar um único byte sem apagar o resto. |
| DATABUS | Caminho de duas mãos por onde o conteúdo trafega entre processador e memória. |
| ULA | Circuito do processador que soma, subtrai e compara bits, sem decidir o que fazer. |
| CACHE | Intermediária veloz que evita idas à memória principal, guardando cópias do que é mais usado. |
| ROM | Seu conteúdo de fábrica sobrevive ao desligamento e o processador apenas consulta, sem alterar. |
| DMA | Controlador que move blocos entre periférico e memória, deixando o processador livre para outras tarefas. |

### Verticais

| Palavra | Pista |
|---|---|
| REGISTRADORES | Os menores e mais rápidos espaços do processador, guardam operandos e resultados imediatos. |
| MICROCONTROLADOR | Computador inteiro num só chip, dedicado a uma tarefa embarcada, como ler um sensor. |
| MEMORIADEMASSA | Retém sistema e arquivos mesmo desligado, com capacidade enorme e acesso bem mais lento. |
| FLASH | Mantém dados sem energia e apaga em blocos inteiros; base dos SSDs e pen drives. |
| ADDRESSBUS | Via de sentido único que informa à memória qual posição será lida ou escrita. |
| QUADCORE | Processador em que o dobro de núcleos de um dual permite quatro tarefas simultâneas. |
| UC | Lê cada comando do programa e decide quais componentes agem, e em que ordem. |

## Estrutura

- `index.html`: página e estrutura do jogo
- `style.css`: visual
- `script.js`: dados das palavras, tabuleiro, Conferir e Reiniciar