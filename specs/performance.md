# Plano de desempenho

## Meta e baseline
- Referência inicial: 90 FPS (11.1 ms por quadro); resultado real depende do headset, navegador, resolução, cena e estado térmico.
- GLB observado: 116,292 bytes; GLB 2.0, 54 meshes/primitivas, 1 material, 0 texturas/imagens, 0 animações, sem extensões declaradas.
- `.blend`: 1,115,756 bytes; cabeçalho Blender 3.3. Blender CLI indisponível; inspeção da fonte e comparação visual não concluídas.
- Essa contagem estrutural não substitui `renderer.info`, perfilamento WebXR ou teste Quest. Memória GPU não é estimada só pelo tamanho do arquivo.

## Medições
1. Registrar modelo/dispositivo, versão do navegador, resolução/performance scale, estado térmico e forma de distribuição.
2. Medir tempo de carregamento até cena pronta e observar erro/recursos de rede.
3. No Quest, registrar tempo de quadro/FPS em repouso e durante movimento; repetir em áreas de maior complexidade visual.
4. Capturar `renderer.info.render.calls`, triangles e geometries/textures em ambiente de diagnóstico quando disponível.
5. Comparar com meta de 11.1 ms e reportar valor observado/limitações sem extrapolar um teste curto.

## Orçamento e otimizações condicionais
- Preservar pixel ratio máximo 1.5 no protótipo e evitar sombras em tempo real até medir custo/benefício.
- Se CPU/draw calls dominarem, avaliar merge/instancing e redução de materiais; se GPU dominar, revisar resolução, transparências, overdraw e iluminação.
- Se transferência dominar, avaliar compressão de geometria/texturas e cache após comparar qualidade, suporte do navegador e custo de decode.
- Alterar asset somente depois de documentar problema, obter decisão sobre tradeoff e guardar o original.

## Limitações atuais
Ainda não foi medido FPS em headset. Área navegável, escala/unidades e conteúdo do `.blend` precisam de validação visual. Não há meta de tamanho final de download definida.
