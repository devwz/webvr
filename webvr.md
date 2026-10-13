# Blender to WebXR VR
## Spec-Driven Development (SDD)

### 1. Identificação do projeto

**Nome:** Blender WebXR Walkthrough

**Objetivo:** Transformar um cenário 3D existente, desenvolvido no Blender, em uma experiência de realidade virtual acessível pelo navegador do Meta Quest 2/3.

**Abordagem:** Spec-Driven Development (SDD), com requisitos explícitos, especificações técnicas, implementação incremental e critérios de aceitação verificáveis.

**Stack tecnológica preferencial:**
- Blender para autoria e preparação dos assets.
- glTF 2.0 / GLB para intercâmbio de recursos 3D.
- Three.js para renderização WebGL.
- WebXR Device API para realidade virtual.
- Vite para desenvolvimento e organização do projeto.
- JavaScript com ES Modules.
- Hospedagem HTTPS para distribuição.

Não introduza Unity, Unreal Engine ou outra game engine nativa como dependência obrigatória.

---

### 2. Contexto e problema

Existe um cenário 3D já desenvolvido no Blender. O projeto precisa disponibilizar esse ambiente em uma aplicação web imersiva, permitindo que o usuário entre no cenário por meio de um Meta Quest 2/3 e caminhe virtualmente por ele.

A aplicação deve executar diretamente no navegador compatível com WebXR, sem exigir a instalação de um aplicativo nativo.

A prioridade é o desempenho em tempo real, mantendo qualidade visual suficiente para uma experiência VR confortável.

O sistema deve separar claramente:
1. Preparação dos assets 3D.
2. Carregamento e renderização.
3. Integração com WebXR.
4. Locomoção do usuário.
5. Colisões e limites físicos.
6. Otimização e validação.
7. Publicação e distribuição.

---

### 3. Objetivos funcionais

**RF-01 — Carregamento do cenário**

A aplicação deve carregar um arquivo `.glb` exportado do Blender, incluindo geometria, materiais, texturas e animações compatíveis, quando existentes.

**RF-02 — Visualização desktop**

O cenário deve ser visualizado em um navegador desktop antes da entrada em VR, permitindo validar o carregamento e a escala.

**RF-03 — Entrada em realidade virtual**

A aplicação deve oferecer um botão para iniciar uma sessão WebXR imersiva, quando suportada pelo dispositivo e pelo navegador.

**RF-04 — Rastreamento da cabeça**

A orientação e a posição da câmera devem respeitar o rastreamento fornecido pelo headset.

**RF-05 — Locomoção virtual**

O usuário deve conseguir caminhar pelo cenário por meio dos controles compatíveis com o Meta Quest 2/3.

A direção do movimento deve ser calculada com base na orientação horizontal da cabeça ou do controle, conforme definido na especificação de interação.

**RF-06 — Colisões**

O usuário não deve atravessar paredes, pisos ou objetos classificados como obstáculos.

A solução de colisão deve considerar a escala e a complexidade da cena, evitando testes desnecessários contra toda a geometria renderizada.

**RF-07 — Movimento físico**

Quando permitido pela área de rastreamento, o usuário deve poder realizar movimentos físicos reais sem que a aplicação sobrescreva o rastreamento do headset.

**RF-08 — Tratamento de erros**

A aplicação deve informar falhas de carregamento, incompatibilidade com WebXR, problemas de inicialização e erros relevantes de execução.

**RF-09 — Publicação web**

O sistema deve poder ser publicado em um servidor HTTPS e acessado pelo navegador do headset.

---

### 4. Requisitos não funcionais

**RNF-01 — Desempenho**

Otimizar a experiência para execução autônoma no Meta Quest 2/3, evitando depender de uma GPU externa.

Utilizar como referência inicial a meta de 90 FPS, equivalente a aproximadamente 11,1 ms por quadro. Medir o desempenho real no dispositivo e documentar eventuais limitações.

**RNF-02 — Qualidade visual**

Priorizar materiais PBR compatíveis com glTF, geometria otimizada e iluminação eficiente.

Quando apropriado, utilizar lightmaps ou texturas baked para iluminação estática.

**RNF-03 — Memória**

Minimizar o tamanho dos assets, a quantidade de texturas, os materiais distintos e os recursos temporários.

**RNF-04 — Conforto em VR**

Evitar mudanças artificiais bruscas de câmera, acelerações excessivas e movimentos que desconsiderem o rastreamento do headset.

Disponibilizar velocidade ajustável e considerar uma alternativa de locomoção por teletransporte.

**RNF-05 — Compatibilidade**

Validar o comportamento no Meta Quest 2/3 e documentar os navegadores, recursos WebXR e modos de entrada efetivamente testados.

**RNF-06 — Manutenibilidade**

Manter a lógica de carregamento, locomoção, colisão e inicialização separada em módulos independentes.

**RNF-07 — Segurança**

Não exigir permissões ou serviços desnecessários. Utilizar HTTPS para publicação e não depender de APIs não suportadas pelo navegador de destino.

---

### 5. Arquitetura proposta

Organizar o sistema em módulos:

- `src/main.js`: inicialização da aplicação e ciclo de vida.
- `src/scene.js`: criação da cena, iluminação e carregamento do GLB.
- `src/vr.js`: configuração WebXR e controles de entrada.
- `src/player.js`: representação lógica do usuário e altura de referência.
- `src/locomotion.js`: movimentação e configuração de velocidade.
- `src/collisions.js`: colisões, obstáculos e limites navegáveis.
- `src/performance.js`: métricas e diagnóstico de desempenho.

Assets:

- `public/models/cenario.glb`: cenário principal.
- `public/textures/`: texturas externas, quando necessárias.
- `public/config/`: configurações não sensíveis do ambiente, se necessário.

Ferramentas:

- Vite para desenvolvimento e build.
- Three.js e seus módulos oficiais para renderização e integração WebXR.
- Git para versionamento.
- Ferramentas de inspeção de GLB e perfilamento no dispositivo para validação.

Evitar abstrações prematuras. A estrutura pode ser simplificada se o protótipo inicial não exigir todos os módulos.

---

### 6. Requisitos de movimentação e câmera

A implementação deve respeitar as seguintes regras:

1. A câmera deve receber a pose rastreada pelo WebXR.
2. A aplicação não deve sobrescrever manualmente a pose da cabeça a cada quadro.
3. A locomoção virtual deve deslocar o referencial do jogador, preservando a pose relativa da câmera.
4. O deslocamento deve ocorrer no plano horizontal, com gravidade e colisão vertical tratadas separadamente.
5. O jogador deve permanecer dentro da área navegável.
6. O sistema deve impedir atravessamentos evidentes de obstáculos.
7. A velocidade deve ser configurável.
8. A orientação da cabeça deve afetar a direção do deslocamento somente no plano horizontal, quando esse for o modo selecionado.
9. O rastreamento físico deve continuar funcionando quando o jogador se deslocar dentro da área real de tracking.
10. O sistema deve prever tratamento para perda de tracking, encerramento da sessão e desconexão dos controles.

Não implementar suporte a todas as modalidades de locomoção antes de validar o movimento básico.

---

### 7. Estratégia de preparação dos assets

Antes da implementação, analisar o arquivo `.blend` ou `.glb` disponível.

Verificar:
- Escala e unidades.
- Orientação e origem da cena.
- Normais e faces invertidas.
- UVs e materiais.
- Resolução e quantidade de texturas.
- Geometria invisível ou redundante.
- Objetos repetidos.
- Materiais com transparência.
- Luzes e sombras.
- Dependência de recursos específicos do Blender.
- Necessidade de bake de iluminação.
- Geometria apropriada para colisões.

Produzir uma lista de problemas encontrados e propor correções antes de alterar assets automaticamente.

Não presumir que um GLB reproduzirá exatamente a renderização do Cycles ou Eevee.

---

### 8. Plano de execução SDD

**Fase 1 — Discovery e análise**

Inspecionar os assets disponíveis, confirmar as condições de execução e identificar lacunas nos requisitos.

Entregáveis:
- Inventário de assets.
- Lista de premissas.
- Registro de riscos técnicos.
- Requisitos pendentes de confirmação.

**Fase 2 — Especificação**

Criar:
- `specs/requirements.md`
- `specs/architecture.md`
- `specs/acceptance-criteria.md`
- `specs/performance.md`

Definir comportamentos, interfaces entre módulos, critérios de aceitação e estratégia de teste.

Não iniciar funcionalidades complexas antes de resolver ambiguidades que afetem a arquitetura.

**Fase 3 — Protótipo mínimo**

Implementar:
- Página web.
- Carregamento do GLB.
- Visualização desktop.
- Botão de entrada em VR.
- Rastreamento da cabeça.
- Tratamento básico de erros.

Critério de saída: o cenário é carregado e visualizado corretamente, e a sessão VR pode ser iniciada em um ambiente compatível.

**Fase 4 — Locomoção**

Implementar movimento por controles, referencial do jogador, velocidade configurável e colisões essenciais.

Critério de saída: o usuário consegue navegar pelo ambiente sem atravessar os principais obstáculos e sem perder o rastreamento da cabeça.

**Fase 5 — Otimização**

Medir o desempenho no Quest 2 e otimizar:
- Draw calls.
- Geometria.
- Materiais.
- Texturas.
- Sombras.
- Colisões.
- Carregamento de recursos.
- Consumo de memória.

Critério de saída: registrar métricas reais e documentar o resultado em relação à meta de desempenho definida.

**Fase 6 — Validação e publicação**

Executar testes no desktop e no headset, produzir um build de produção e publicar em HTTPS.

Critério de saída: aplicação acessível pelo navegador de destino, com instruções de execução e limitações documentadas.

---

### 9. Critérios de aceitação

**CA-01 — Importação:** um cenário GLB válido é carregado sem erros críticos.

**CA-02 — Renderização:** os materiais e as texturas suportados aparecem corretamente.

**CA-03 — Desktop:** a cena pode ser visualizada antes de entrar em VR.

**CA-04 — Sessão VR:** o usuário consegue iniciar e encerrar a experiência em dispositivo compatível.

**CA-05 — Tracking:** os movimentos da cabeça são refletidos na visualização.

**CA-06 — Locomoção:** os controles permitem caminhar pelo cenário.

**CA-07 — Colisão:** as principais paredes e obstáculos impedem a passagem do jogador.

**CA-08 — Segurança do movimento:** a câmera rastreada não é sobrescrita pela lógica de locomoção.

**CA-09 — Desempenho:** o sistema registra FPS ou tempo de quadro e permite verificar o resultado no dispositivo.

**CA-10 — Recuperação:** erros de carregamento ou indisponibilidade de WebXR produzem mensagens compreensíveis.

**CA-11 — Distribuição:** o build pode ser servido por HTTPS e acessado pelo headset.

Cada critério deve ter um procedimento de teste reproduzível. Não marcar um critério como aprovado sem evidência correspondente.

---

### 10. Estratégia de testes

Executar testes em três níveis.

**Testes funcionais**
- Carregamento de GLB.
- Inicialização e encerramento da sessão.
- Entrada de controles.
- Movimento e velocidade.
- Colisões e limites.

**Testes visuais**
- Escala aparente.
- Orientação da cena.
- Materiais e texturas.
- Iluminação.
- Artefatos visuais.

**Testes de desempenho**
- Tempo de quadro.
- FPS observado.
- Tempo de carregamento.
- Memória e pressão sobre a GPU, conforme as ferramentas disponíveis.
- Comportamento durante deslocamento e renderização de áreas complexas.

Os testes desktop não substituem os testes no headset real.

---

### 11. Restrições e decisões técnicas

- Não utilizar Unity.
- Não exigir compilação de aplicativo Android nativo.
- Não depender de streaming de PC para a renderização principal.
- Não assumir que todos os recursos do Blender serão convertidos para glTF.
- Não adicionar funcionalidades que não sejam necessárias ao escopo inicial.
- Não declarar compatibilidade ou desempenho sem testes.
- Preferir recursos padrão do Three.js e WebXR.
- Fixar versões das dependências no projeto.
- Documentar alternativas quando um requisito não puder ser atendido diretamente pela plataforma web.

---

### 12. Informações ainda necessárias

Antes de fechar a especificação, solicitar ao usuário:

1. Qual é o tipo de cenário: arquitetônico, industrial, externo, jogo ou outro?
2. Qual é o tamanho aproximado do arquivo `.blend` ou `.glb`?
3. O cenário possui iluminação baked, materiais procedurais, transparências ou animações?
4. A movimentação será exclusivamente por analógico ou também deverá incluir teletransporte?
5. A experiência será publicada na internet ou executada em rede local?
6. Existe uma meta específica de fidelidade visual ou tamanho máximo do download?

Permitir respostas parciais. Quando um detalhe não for essencial para a primeira entrega, registrar uma premissa explícita em vez de bloquear o desenvolvimento.

---

### 13. Instruções para o agente de implementação

Atue como engenheiro de software sênior com experiência em Three.js, WebGL, WebXR e otimização para dispositivos móveis de VR.

Trabalhe de maneira incremental, seguindo o ciclo:

**Discovery → Specify → Plan → Implement → Test → Validate**

Antes de escrever código:
1. Inspecione o repositório e os assets disponíveis.
2. Identifique requisitos ambíguos e riscos.
3. Proponha a arquitetura e os critérios de aceitação.
4. Aguarde confirmação para decisões que alterem substancialmente o escopo ou a arquitetura.

Durante a implementação:
1. Trabalhe em incrementos pequenos.
2. Vincule cada funcionalidade a um requisito.
3. Execute os testes disponíveis após cada incremento.
4. Registre limitações, decisões e resultados.
5. Não simule resultados de testes no headset se o hardware não estiver disponível.
6. Atualize a documentação conforme a implementação evoluir.

**Primeira entrega esperada:** análise dos requisitos, arquitetura proposta, premissas explícitas, riscos técnicos e plano de implementação priorizado. Não implemente o projeto inteiro antes dessa etapa de especificação.