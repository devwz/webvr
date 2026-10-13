# Arquitetura do protótipo

## Stack
- Vite 8.3.4 para desenvolvimento e build estático.
- Three.js 0.186.1, JavaScript ES Modules.
- `GLTFLoader`, `OrbitControls` e `VRButton` dos addons oficiais do Three.js.
- WebXR no navegador; hospedagem de produção via HTTPS.

## Módulos
- `src/main.js`: composição, mensagens de estado, ciclo de renderização e eventos globais.
- `src/scene.js`: renderer, scene, câmera/rig, luzes, controles desktop, carregamento do GLB, enquadramento e resize.
- `src/vr.js`: botão e ciclo de vida da sessão WebXR.
- `src/locomotion.js`: thumbstick esquerdo, deadzone radial, direção pela yaw horizontal da câmera, gravidade e velocidade.
- `src/collisions.js`: Octree estático criado uma vez do GLB e resolução de movimento por cápsula em subpassos.
- `src/performance.js`: amostragem simples de FPS para diagnóstico inicial.
- `public/models/indoor.glb`: asset publicado sem conversão automática.

## Fluxo
1. Inicializar renderer WebGL e habilitar XR; exibir estado de carregamento.
2. Carregar GLB e calcular bounds em world space para enquadrar a visualização; não reescalar nem reorientar automaticamente o asset.
3. Exibir geometria/material, contagem de meshes, dimensões estimadas e FPS.
4. Solicitar a sessão XR somente por interação explícita com o botão; `local-floor` é recurso requerido.
5. Atualizar renderer por `setAnimationLoop`; o runtime WebXR fornece a pose da câmera.

## Fronteiras e evolução
- `PlayerRig` é o referencial de locomoção: o movimento soma deslocamentos no rig, sem escrever pose na câmera rastreada.
- O Octree é construído uma vez a partir das meshes estáticas do GLB; uma cápsula aproximada ao corpo é deslocada em subpassos e despenetrada contra a geometria. A velocidade vertical é tratada separadamente por gravidade.
- O thumbstick esquerdo usa eixos 2/3 em gamepads XR com quatro eixos e 0/1 quando só existem dois; deadzone radial evita drift. A ausência/desconexão do controle resulta em entrada zero em cada quadro.
- O slider ajusta velocidade entre 0.5 e 3.0 m/s antes ou durante a sessão quando o navegador expõe a UI da página.
- O navegador precisa de contexto seguro para WebXR. `localhost` serve para desenvolvimento desktop; teste Quest e produção exigem origem HTTPS acessível pelo dispositivo.
- GLB não contém animações nem imagens/texturas. O MVP carrega o material PBR declarado; recursos visuais ausentes precisam ser confirmados contra o `.blend` antes de qualquer alteração.
- Luzes provisórias são ambiente + direcional. Revisar exposição e materiais no headset antes de otimização ou alteração do asset.

## Riscos técnicos
- `local-floor` pode não estar disponível em certos navegadores/headsets; a sessão deve falhar com mensagem compreensível.
- O material atual não referencia textura e não há imagens no GLB; a cena pode diferir substancialmente do `.blend` se depender de texturas ou animações.
- 54 primitivas são uma referência inicial de draw calls, mas número real depende do carregamento/materials e do renderizador; medir no dispositivo.
- Bounds derivados de geometria podem não representar a área navegável nem a escala física correta.
