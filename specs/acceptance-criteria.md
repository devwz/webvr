# Critérios de aceitação e procedimentos

| ID | Procedimento reproduzível | Evidência exigida | Ambiente |
|---|---|---|---|
| CA-01 | Iniciar app e aguardar conclusão do `GLTFLoader`; verificar ausência de erro crítico no console. | Estado de cena pronta e console sem erro de parse/rede. | Desktop |
| CA-02 | Inspecionar materiais, texturas e orientação do cenário em comparação com a referência Blender disponível. | Capturas e lista de diferenças; sem alegar equivalência Cycles/Eevee. | Desktop; Blender para comparação |
| CA-03 | Abrir a URL local e verificar visualização antes de sessão XR, enquadramento, proporção e contagem de meshes. | Captura da cena e dimensões mostradas. | Desktop |
| CA-04 | Em Quest compatível, iniciar pelo botão e encerrar pelo controle/ação do navegador. | Confirmação visual de início e retorno à cena desktop. | Headset/browser documentados |
| CA-05 | Mover/rotacionar a cabeça durante sessão ativa. | Vídeo ou observação registrada de pose correspondente. | Headset real |
| CA-06 | Em sessão XR, variar o thumbstick esquerdo nas quatro direções e diagonais; ajustar velocidade pelo slider antes da sessão. | Testes automatizados do mapeamento/vetores e observação manual no Quest. | Unidade + headset real |
| CA-07 | Tentar atravessar paredes e permanecer sobre o piso; testar movimento diagonal junto a uma parede. | Testes automatizados de cápsula contra parede/piso e observação dos obstáculos principais no Quest. | Unidade + headset real |
| CA-08 | Mover fisicamente dentro da área de tracking e confirmar que a pose relativa não é substituída pela aplicação. | Observação/vídeo da sessão e revisão do código de locomoção. | Headset real |
| CA-09 | Coletar FPS e tempo de quadro durante cena estática e navegação representativa. | Amostra no dispositivo, condições e percentil observado documentados. | Quest 2/3 |
| CA-10 | Testar GLB ausente/inválido e origem sem contexto seguro ou sem suporte XR. | Mensagens claras na UI; nenhum estado de carregamento infinito. | Desktop/browser XR |
| CA-11 | Gerar build e abrir o endereço publicado pelo navegador do headset sob HTTPS. | URL, data, dispositivo/browser e carregamento confirmado. | HTTPS + headset |

Nenhum critério de headset é aprovado com base somente em teste desktop. CA-06 e CA-07 têm testes unitários do núcleo, mas permanecem pendentes de validação física no Quest e confirmação da geometria/escala real.
