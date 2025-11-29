// 4-2 機能実装: ハンバーガー, FAQ, モーダル, タブ, ロゴ自動スクロールを実装してください
(() => {
  const isMobile = () => window.innerWidth <= 768;

  // ============================
  // ハンバーガーメニュー
  // ============================
  const hamburger = document.querySelector('.hamburger');
  const globalNav = document.getElementById('global-nav');
  const cleanMobileNav = () => {
    if (!isMobile()) {
      globalNav?.classList.remove('is-open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  };
  if (hamburger && globalNav) {
    hamburger.addEventListener('click', () => {
      if (!isMobile()) return;
      const willOpen = !globalNav.classList.contains('is-open');
      globalNav.classList.toggle('is-open', willOpen);
      hamburger.setAttribute('aria-expanded', String(willOpen));
    });
    window.addEventListener('resize', cleanMobileNav);
    window.addEventListener('orientationchange', cleanMobileNav);
  }

  // ============================
  // FAQ アコーディオン
  // ============================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.addEventListener('click', () => {
      item.classList.toggle('open');
    });
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  // ============================
  // モーダル（動的生成）
  // ============================
  const openModalBtn = document.getElementById('open-modal');
  const createModal = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal is-open';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.innerHTML = `
      <div class="modal-overlay" data-close="true"></div>
      <div class="modal-dialog" role="document">
        <button class="modal-close" type="button" aria-label="閉じる" data-close="true">×</button>
        <h3 class="modal-title">モーダルの見出し</h3>
        <div class="modal-content">
          <p>ここにモーダルの本文が入ります。背景スクロールは禁止されています。</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" type="button" data-close="true">OK</button>
          <button class="btn btn-outline" type="button" data-close="true">閉じる</button>
        </div>
      </div>`;
    return wrapper;
  };
  const openModal = () => {
    const modal = createModal();
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    const closeModal = () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
      modal.remove();
    };
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.matches('[data-close="true"]')) {
        closeModal();
      }
    });
    document.addEventListener('keydown', onKey);
  };
  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }

  // ============================
  // タブ切替
  // ============================
  const tabs = document.getElementById('demo-tabs');
  if (tabs) {
    const tabButtons = tabs.querySelectorAll('.tab-btn');
    const panels = tabs.querySelectorAll('.tab-panel');
    const activate = (id) => {
      tabButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-tab') === id;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === id);
      });
    };
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-tab');
        if (id) activate(id);
      });
    });
  }

  // ============================
  // ロゴ自動横スクロール（無限ループ）
  // ============================
  const logosViewport = document.querySelector('.logos-viewport');
  const logosRail = document.querySelector('.logos-rail');
  if (logosViewport && logosRail) {
    // 内容を複製して継ぎ目なくする
    logosRail.innerHTML += logosRail.innerHTML;

    let lastTime;
    let halfWidth = logosRail.scrollWidth / 2;
    const speedPxPerSec = 40; // 速度

    const recalc = () => {
      halfWidth = logosRail.scrollWidth / 2;
      logosViewport.scrollLeft = logosViewport.scrollLeft % halfWidth;
    };
    window.addEventListener('resize', recalc);

    const step = (time) => {
      if (lastTime == null) lastTime = time;
      const delta = (time - lastTime) / 1000; // 秒
      lastTime = time;

      logosViewport.scrollLeft += speedPxPerSec * delta;
      if (logosViewport.scrollLeft >= halfWidth) {
        logosViewport.scrollLeft -= halfWidth;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
})();
