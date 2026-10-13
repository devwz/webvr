# Requisitos do MVP

## Escopo
Protótipo web para visualizar o cenário interno `indoor.glb` no desktop, iniciar uma sessão WebXR compatível e caminhar por thumbstick com colisões. Teletransporte permanece fora do escopo atual.

## Requisitos funcionais

| ID | Requisito | Critério relacionado | Estado |
|---|---|---|---|
| RF-01 | Carregar `public/models/indoor.glb` com `GLTFLoader`, incluindo recursos glTF suportados. | CA-01 | MVP |
| RF-02 | Exibir a cena no desktop com enquadramento inicial derivado dos limites do modelo, sem alterar sua escala. | CA-02, CA-03 | MVP |
| RF-03 | Oferecer botão oficial Three.js para solicitar sessão `immersive-vr` com `local-floor`. | CA-04 | MVP |
| RF-04 | Deixar pose e orientação da câmera XR sob controle do runtime WebXR. | CA-05, CA-08 | MVP |
| RF-05 | Movimento contínuo pelo thumbstick esquerdo do controle XR, com direção horizontal pela cabeça e velocidade ajustável. | CA-06 | Implementado; validação Quest pendente |
| RF-06 | Bloquear paredes/piso/obstáculos com cápsula do jogador contra Octree estático da cena. | CA-07 | Implementado; validar geometria e escala no Quest |
| RF-07 | Preservar tracking físico quando não houver locomoção virtual. | CA-08 | MVP e headset real |
| RF-08 | Comunicar falha de carregamento, inicialização ou indisponibilidade de contexto XR. | CA-10 | MVP |
| RF-09 | Produzir build estático implantável em HTTPS. | CA-11 | MVP |

## Requisitos não funcionais
- RNF-01: medir frame rate no dispositivo; 90 FPS é referência, não garantia.
- RNF-02: usar materiais glTF/PBR e iluminação simples; não prometer equivalência a Cycles/Eevee.
- RNF-03: limitar pixel ratio do renderer e acompanhar tamanho do asset e recursos carregados.
- RNF-04: limitar velocidade a faixa ajustável de 0.5–3.0 m/s; revisar conforto com usuário no headset.
- RNF-05: só declarar compatibilidade Quest/browser após teste físico documentado.
- RNF-06: manter carregamento, integração WebXR, ciclo de inicialização e telemetria em módulos separados.
- RNF-07: não introduzir engine nativa, app Android, streaming de PC ou serviços/permissões sem necessidade.

## Premissas e pendências
- Fonte de execução inicial: `indoor.glb` (116,292 bytes; GLB 2.0). Fonte editável: `indoor.blend` (1,115,756 bytes; cabeçalho Blender 3.3). A comparação visual e de conteúdo do `.blend` não foi feita porque Blender CLI não está disponível no ambiente.
- Inspeção estrutural inicial do GLB: uma cena, 54 nós, 54 meshes/primitivas, um material declarado, zero texturas/imagens e zero animações. O material é double-sided e tem cor base uniforme. Escala/unidades e qualidade visual ainda exigem inspeção renderizada.
- Decisões confirmadas: interior arquitetônico; thumbstick esquerdo com direção pela yaw horizontal da cabeça; publicação na internet por HTTPS.
- Pendentes: compatibilidade efetiva do mapeamento de eixos no Quest Browser, limite de download, prioridade fidelidade/performance, escala física e validação dos colliders contra a cena real.
- O arquivo apresenta meshes nomeados para paredes, portas e janelas; nomes não são evidência suficiente para classificar obstáculos nem construir colisões.
