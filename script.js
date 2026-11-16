(() => {
  "use strict";

  const FALLBACK_CONTENT = `[HERO]
eyebrow = Operações · Infraestrutura de TI · Logística & Automação
title = Soluções práticas em operações, tecnologia e resolução de problemas.
subtitle = Sou Luan Olympio. Uno experiência prática em campo, com infraestrutura de TI, segurança eletrônica (CFTV), logística e atendimento, ao uso de automação e sistemas digitais para tornar rotinas mais simples e eficientes.
cta_primary = Ver iniciativas
cta_secondary = github.com/LuanOlympio2

[SOBRE]
tag = Sobre mim
title = Versatilidade prática: do suporte em campo à organização de processos.
p1 = Minha trajetória foi construída na prática, lidando diretamente com demandas reais: manutenção de computadores, instalação de sistemas de segurança eletrônica (CFTV), controle de estoque, fechamento financeiro e apoio operacional em rotinas de campo.
p2 = Tenho formação técnica em Logística, certificação em Excel para análise de dados e curso o Bacharelado em Educação Física na Uniube, uma combinação que fortalece disciplina, organização, comunicação e visão sistêmica.
p3 = Uso a tecnologia, a automação e o desenvolvimento de ferramentas digitais como aliados para eliminar retrabalho, monitorar serviços e resolver problemas do dia a dia com objetividade.
skills = CNH Categoria B | Infraestrutura de TI & CFTV | Logística & Estoque | Suporte Técnico | Análise de Dados (Excel) | Automação de Processos | Atendimento & Operações

[EXPERIENCIA]
area = TI & Segurança Eletrônica
empresa = Mtec Informática
cargo = Técnico de TI e CFTV
itens = Instalação, configuração e manutenção de sistemas de monitoramento eletrônico e CFTV.; Suporte técnico em hardware, diagnósticos de falhas, montagem, limpeza interna e manutenção preventiva de computadores e notebooks.; Instalação de cercas elétricas, motores de portão, cerca concertina e equipamentos de segurança.
---
area = Comércio & Operações
empresa = Mercearia do Moisés
cargo = Operador de Caixa e Repositor
itens = Atendimento direto ao cliente, operação de frente de caixa e fechamento financeiro diário.; Controle de estoque, organização de mercadorias, recebimento de cargas e reposição estratégica de gôndolas.
---
area = Construção & Campo
empresa = Tchê Piscinas
cargo = Auxiliar de Construção e Acabamento
itens = Atuação na instalação e construção de piscinas com aplicação de técnicas de laminação em fibra de vidro e resina.; Preparação de superfícies, acabamento estrutural e manutenção de materiais.
---
area = Esporte & Logística
empresa = Comissão Técnica de Futebol
cargo = Apoio Operacional e Logístico
itens = Suporte direto às operações da comissão técnica, organização de materiais esportivos, logística de treinos e acompanhamento de rotinas de campo.

[FORMACAO]
curso = Bacharelado em Educação Física
instituicao = Uniube
status = Em andamento
---
curso = Curso Técnico em Logística
instituicao = Escola Multi
status = Finalizado
---
curso = Ensino Fundamental e Médio Completos
instituicao = Formação Regular
status = Concluído

[CERTIFICADOS]
tag = Logística
titulo = Técnico em Logística
detalhe = Escola Multi · Certificação de Conclusão de Curso
---
tag = Qualificação
titulo = Qualificação Profissional em Logística
detalhe = Escola Multi · Certificação Intermediária de Meio de Curso
---
tag = Dados
titulo = Microsoft Excel
detalhe = Certificação de Capacitação em Planilhas e Análise de Dados

[CONTATO]
tag = Contato
title = Aberto a novas oportunidades e projetos.
subtitle = Disponível para atuação em operações, logística, infraestrutura de TI, suporte técnico e iniciativas de automação.
email = luanolympio1@outlook.com
telefone = (38) 99745-8261
github_url = https://github.com/LuanOlympio2
github_label = github.com/LuanOlympio2
local = Jacilândia, MG · Brasil`;

  function parseContentTxt(raw) {
    const sections = {};
    let currentSection = null;
    let currentBlock = {};

    const commitBlock = () => {
      if (!currentSection || Object.keys(currentBlock).length === 0) return;
      if (!Array.isArray(sections[currentSection])) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(currentBlock);
      currentBlock = {};
    };

    const listSections = new Set(["EXPERIENCIA", "FORMACAO", "CERTIFICADOS"]);

    for (const rawLine of raw.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const secMatch = line.match(/^\[([A-Z0-9_]+)\]$/);
      if (secMatch) {
        if (listSections.has(currentSection)) commitBlock();
        currentSection = secMatch[1];
        if (!sections[currentSection]) {
          sections[currentSection] = listSections.has(currentSection) ? [] : {};
        }
        currentBlock = {};
        continue;
      }

      if (!currentSection) continue;

      if (line === "---" && listSections.has(currentSection)) {
        commitBlock();
        continue;
      }

      const eqIndex = line.indexOf("=");
      if (eqIndex === -1) continue;
      const key = line.slice(0, eqIndex).trim();
      const val = line.slice(eqIndex + 1).trim();

      if (listSections.has(currentSection)) {
        currentBlock[key] = val;
      } else {
        sections[currentSection][key] = val;
      }
    }

    if (listSections.has(currentSection)) commitBlock();
    return sections;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function applyContent(data) {
    if (data.HERO) {
      setText("hero-eyebrow", data.HERO.eyebrow);
      setText("hero-title", data.HERO.title);
      setText("hero-subtitle", data.HERO.subtitle);
      setText("hero-cta-primary", data.HERO.cta_primary);
      setText("hero-cta-secondary", data.HERO.cta_secondary);
    }

    if (data.SOBRE) {
      setText("sobre-tag", data.SOBRE.tag);
      setText("sobre-title", data.SOBRE.title);
      setText("sobre-p1", data.SOBRE.p1);
      setText("sobre-p2", data.SOBRE.p2);
      setText("sobre-p3", data.SOBRE.p3);

      const skillsEl = document.getElementById("sobre-skills");
      if (skillsEl && data.SOBRE.skills) {
        skillsEl.innerHTML = data.SOBRE.skills
          .split("|")
          .map((s) => `<span class="skill-tag">${s.trim()}</span>`)
          .join("");
      }
    }

    const expEl = document.getElementById("experience-list");
    if (expEl && Array.isArray(data.EXPERIENCIA)) {
      expEl.innerHTML = data.EXPERIENCIA.map((item) => {
        const bullets = (item.itens || "")
          .split(";")
          .map((b) => b.trim())
          .filter(Boolean)
          .map((b) => `<li>${b}</li>`)
          .join("");
        return `
          <article class="editorial-item reveal">
            <div>
              <span class="editorial-area">${item.area || ""}</span>
              <h3 class="editorial-company">${item.empresa || ""}</h3>
              <p class="editorial-role">${item.cargo || ""}</p>
            </div>
            <ul class="editorial-bullets">${bullets}</ul>
          </article>
        `;
      }).join("");
    }

    const eduEl = document.getElementById("education-list");
    if (eduEl && Array.isArray(data.FORMACAO)) {
      eduEl.innerHTML = data.FORMACAO.map(
        (item) => `
          <div class="editorial-row">
            <div>
              <strong>${item.curso || ""}</strong>
              <span>${item.instituicao || ""}</span>
            </div>
            <span class="row-badge">${item.status || ""}</span>
          </div>
        `
      ).join("");
    }

    const certEl = document.getElementById("certificates-list");
    if (certEl && Array.isArray(data.CERTIFICADOS)) {
      certEl.innerHTML = data.CERTIFICADOS.map(
        (item) => `
          <div class="editorial-row">
            <div>
              <strong>${item.titulo || ""}</strong>
              <span>${item.detalhe || ""}</span>
            </div>
            <span class="row-badge">${item.tag || ""}</span>
          </div>
        `
      ).join("");
    }

    if (data.CONTATO) {
      setText("contato-tag", data.CONTATO.tag);
      setText("contato-title", data.CONTATO.title);
      setText("contato-subtitle", data.CONTATO.subtitle);
      setText("contato-email", data.CONTATO.email);
      setText("contato-telefone", data.CONTATO.telefone);
      setText("contato-github", `${data.CONTATO.github_label} ↗`);
      setText("footer-local", data.CONTATO.local);

      const telLink = document.getElementById("contato-tel-link");
      if (telLink && data.CONTATO.telefone) {
        const digits = data.CONTATO.telefone.replace(/\D/g, "");
        telLink.href = `tel:+55${digits}`;
      }

      const ghLink = document.getElementById("contato-gh-link");
      if (ghLink && data.CONTATO.github_url) {
        ghLink.href = data.CONTATO.github_url;
      }
    }

    observeReveals();
  }

  async function loadExternalContent() {
    try {
      const res = await fetch("conteudo.txt", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const text = await res.text();
      applyContent(parseContentTxt(text));
    } catch {
      applyContent(parseContentTxt(FALLBACK_CONTENT));
    }
  }

  /* Antigravity Particle Field */
  const canvas = document.getElementById("antigravity-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const pointer = { x: -9999, y: -9999 };
  const COLORS = ["#2563eb", "#6366f1", "#0ea5e9", "#8b5cf6", "#94a3b8"];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(54, Math.floor((window.innerWidth * window.innerHeight) / 26000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -0.14 - Math.random() * 0.32,
      r: 1.4 + Math.random() * 2.1,
      alpha: 0.12 + Math.random() * 0.24,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120;
        p.x += (dx / dist) * force * 1.3;
        p.y += (dy / dist) * force * 1.3;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  resizeCanvas();
  createParticles();
  animateParticles();

  /* GitHub Initiatives & Tools */
  const FALLBACK_REPOS = [
    {
      name: "deepgravity",
      description:
        "Agente autônomo para automação de tarefas e fluxos de trabalho com interface leve.",
      html_url: "https://github.com/LuanOlympio2/deepgravity",
      language: "Rust",
      stargazers_count: 0,
      updated_at: "2026-10-28T22:12:14Z"
    },
    {
      name: "motorai",
      description: "Projeto de inteligência artificial em treinamento para experimentação prática.",
      html_url: "https://github.com/LuanOlympio2/motorai",
      language: "Python",
      stargazers_count: 2,
      updated_at: "2026-11-01T20:56:53Z"
    },
    {
      name: "olympprotect.zapo",
      description: "Bot de atendimento e proteção automatizada para WhatsApp.",
      html_url: "https://github.com/LuanOlympio2/olympprotect.zapo",
      language: "JavaScript",
      stargazers_count: 1,
      updated_at: "2026-10-04T19:31:24Z"
    },
    {
      name: "regrafiscal",
      description:
        "Calculadora e alerta de mudança de regime tributário para MEI e Simples Nacional.",
      html_url: "https://github.com/LuanOlympio2/regrafiscal",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: "2026-09-25T22:29:32Z"
    },
    {
      name: "alertaedital",
      description:
        "Rastreador de editais e retificações de concursos públicos com alertas no WhatsApp.",
      html_url: "https://github.com/LuanOlympio2/alertaedital",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: "2026-09-25T21:11:00Z"
    },
    {
      name: "uptimepulse",
      description: "Monitor de status e disponibilidade de serviços com alertas e página pública.",
      html_url: "https://github.com/LuanOlympio2/uptimepulse",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: "2026-09-25T21:10:49Z"
    },
    {
      name: "zapmenu",
      description: "Cardápio digital e gerador de pedidos formatados para atendimento via WhatsApp.",
      html_url: "https://github.com/LuanOlympio2/zapmenu",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: "2026-09-25T21:10:41Z"
    },
    {
      name: "pixlink",
      description: "Ferramenta para geração de cobranças Pix com chave estática e copia e cola.",
      html_url: "https://github.com/LuanOlympio2/pixlink",
      language: "TypeScript",
      stargazers_count: 0,
      updated_at: "2026-09-25T21:10:35Z"
    },
    {
      name: "Three-by-three-plugin",
      description: "Plugin de ferramentas 3x3 com suporte a múltiplos níveis.",
      html_url: "https://github.com/LuanOlympio2/Three-by-three-plugin",
      language: "Java",
      stargazers_count: 0,
      updated_at: "2026-09-25T21:10:54Z"
    }
  ];

  const LANG_COLORS = {
    Rust: "#dea584",
    Python: "#3572A5",
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Java: "#b07219"
  };

  let allRepos = [...FALLBACK_REPOS];
  let activeFilter = "all";

  function classifyRepo(repo) {
    const lang = (repo.language || "").toLowerCase();
    const name = repo.name.toLowerCase();
    if (lang === "rust" || lang === "python") return "automacao";
    if (name.includes("zapo") || lang === "javascript" || lang === "java") return "utilitarios";
    if (lang === "typescript") return "ferramentas";
    return "all";
  }

  function renderRepos() {
    const grid = document.getElementById("projects-grid");
    const filtered =
      activeFilter === "all"
        ? allRepos
        : allRepos.filter((r) => classifyRepo(r) === activeFilter);

    grid.innerHTML = filtered
      .map((repo) => {
        const lang = repo.language || "Projeto";
        const color = LANG_COLORS[lang] || "#64748b";
        const date = new Date(repo.updated_at).toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric"
        });
        return `
          <a
            href="${repo.html_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="initiative-item"
          >
            <div>
              <div class="initiative-meta">
                <span class="lang-inline">
                  <span class="lang-dot" style="background:${color}"></span>
                  ${lang}
                </span>
                <span>★ ${repo.stargazers_count || 0}</span>
              </div>
              <h3 class="initiative-title">${repo.name}</h3>
              <p class="initiative-desc">${repo.description || "Iniciativa disponível no GitHub."}</p>
            </div>
            <div class="initiative-foot">
              <span>Atualizado ${date}</span>
              <span class="initiative-link">Ver repositório ↗</span>
            </div>
          </a>
        `;
      })
      .join("");
  }

  async function loadGitHubRepos() {
    renderRepos();
    try {
      const res = await fetch("https://api.github.com/users/LuanOlympio2/repos?sort=updated&per_page=12");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allRepos = data.filter((r) => !r.fork);
        renderRepos();
      }
    } catch {
      // Fallback already rendered
    }
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderRepos();
    });
  });

  /* Scroll Reveal & Utilities */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  function observeReveals() {
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  const copyBtn = document.getElementById("copy-email-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = document.getElementById("contato-email")?.textContent?.trim() || "luanolympio1@outlook.com";
      try {
        await navigator.clipboard.writeText(email);
        showToast(`E-mail copiado: ${email}`);
      } catch {
        showToast(`E-mail: ${email}`);
      }
    });
  }

  /* Native HTML5 Audio Player */
  const audio = document.getElementById("bg-music");
  audio.volume = 0.35;

  const playPauseBtn = document.getElementById("play-pause-btn");
  const muteBtn = document.getElementById("mute-btn");
  const navMuteBtn = document.getElementById("nav-mute-btn");
  const heroMusicBtn = document.getElementById("hero-music-btn");
  const statusEl = document.getElementById("music-status");
  const widgetEq = document.getElementById("widget-eq");
  const navEq = navMuteBtn.querySelector(".eq-bars");
  const navLabel = navMuteBtn.querySelector(".music-nav-label");

  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");
  const iconUnmuted = document.getElementById("icon-unmuted");
  const iconMuted = document.getElementById("icon-muted");

  let audioMissing = false;

  function syncMusicUI() {
    const isPlaying = !audio.paused && !audio.ended;
    const isMuted = audio.muted;
    const activeAudio = isPlaying && !isMuted && !audioMissing;

    iconPlay.classList.toggle("hidden", isPlaying);
    iconPause.classList.toggle("hidden", !isPlaying);
    iconUnmuted.classList.toggle("hidden", isMuted);
    iconMuted.classList.toggle("hidden", !isMuted);

    muteBtn.classList.toggle("is-muted", isMuted);
    navMuteBtn.classList.toggle("is-playing", activeAudio);

    widgetEq.classList.toggle("eq-paused", !activeAudio);
    navEq.classList.toggle("eq-paused", !activeAudio);
    navLabel.textContent = audioMissing ? "Sem áudio" : isMuted ? "Mutado" : isPlaying ? "Tocando" : "Som";

    if (audioMissing) {
      statusEl.textContent = "Adicione assets/musica.mp3";
    } else if (isMuted) {
      statusEl.textContent = "B.E.R. · Mutado";
    } else if (isPlaying) {
      statusEl.textContent = "B.E.R. · Tocando agora";
    } else {
      statusEl.textContent = "B.E.R. · Clique na página para tocar";
    }
  }

  async function startMusic() {
    if (audioMissing) return;
    try {
      await audio.play();
      syncMusicUI();
    } catch {
      syncMusicUI();
    }
  }

  function togglePlayPause() {
    if (audioMissing) {
      showToast("Coloque o arquivo assets/musica.mp3 na pasta assets");
      return;
    }
    if (audio.paused) {
      startMusic();
    } else {
      audio.pause();
      syncMusicUI();
    }
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    if (!audio.muted && audio.paused && !audioMissing) {
      startMusic();
    }
    syncMusicUI();
    showToast(audio.muted ? "Música mutada" : "Som ativado · The Night Begins to Shine");
  }

  audio.addEventListener("error", () => {
    audioMissing = true;
    syncMusicUI();
  });

  audio.addEventListener("play", syncMusicUI);
  audio.addEventListener("pause", syncMusicUI);
  audio.addEventListener("volumechange", syncMusicUI);

  playPauseBtn.addEventListener("click", togglePlayPause);
  muteBtn.addEventListener("click", toggleMute);
  navMuteBtn.addEventListener("click", () => {
    if (audioMissing) {
      showToast("Coloque o arquivo assets/musica.mp3 na pasta assets");
      return;
    }
    if (audio.paused && !audio.muted) {
      startMusic();
    } else {
      toggleMute();
    }
  });
  heroMusicBtn.addEventListener("click", () => {
    if (audioMissing) {
      showToast("Coloque o arquivo assets/musica.mp3 na pasta assets");
      return;
    }
    audio.muted = false;
    startMusic();
  });

  const handleFirstInteraction = () => {
    if (!audio.muted && audio.paused && !audioMissing) {
      startMusic();
    }
  };

  window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
  window.addEventListener("keydown", handleFirstInteraction, { once: true });

  syncMusicUI();
  loadExternalContent();
  loadGitHubRepos();
  observeReveals();
})();
