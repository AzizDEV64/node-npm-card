// ==========================================
// Top 100 NPM Paketleri - Ana Uygulama
// ==========================================

const CATEGORIES = {
    'Web Framework': { class: 'cat-web-framework', icon: '🌐' },
    'Veritabanı': { class: 'cat-veritabani', icon: '🗄️' },
    'Utility': { class: 'cat-utility', icon: '🔧' },
    'Test': { class: 'cat-test', icon: '🧪' },
    'HTTP / API': { class: 'cat-http-api', icon: '📡' },
    'Güvenlik': { class: 'cat-guvenlik', icon: '🔒' },
    'Dosya / Sistem': { class: 'cat-dosya-sistem', icon: '📁' },
    'Build / Bundler': { class: 'cat-build-bundler', icon: '📦' },
    'CLI': { class: 'cat-cli', icon: '💻' },
    'Loglama': { class: 'cat-loglama', icon: '📋' },
    'Template': { class: 'cat-template', icon: '📄' },
    'Realtime': { class: 'cat-realtime', icon: '⚡' },
    'E-posta': { class: 'cat-email', icon: '📧' },
    'Otomasyon': { class: 'cat-otomasyon', icon: '🤖' },
    'Doğrulama': { class: 'cat-dogrulama', icon: '✅' },
    'Middleware': { class: 'cat-middleware', icon: '🔗' },
    'Process': { class: 'cat-process', icon: '⚙️' },
    'Geliştirme': { class: 'cat-gelistirme', icon: '🛠️' }
};

const cardsGrid = document.getElementById('cardsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.getElementById('filterButtons');
const resultsCount = document.getElementById('resultsCount');
const totalCategories = document.getElementById('totalCategories');

let activeFilter = 'Tümü';
let openCardId = null;
const codeStore = {};

// ==========================================
// Theme Toggle
// ==========================================
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    }
}

// ==========================================
// Init
// ==========================================
function init() {
    initTheme();
    if (typeof PACKAGES === 'undefined') {
        console.error('Paket verisi yüklenemedi!');
        return;
    }
    totalCategories.textContent = Object.keys(CATEGORIES).length;
    renderFilterButtons();
    renderCards(PACKAGES);
    setupEventListeners();
}

function renderFilterButtons() {
    let html = `<button class="filter-btn active" data-category="Tümü">Tümü</button>`;
    for (const [name, info] of Object.entries(CATEGORIES)) {
        html += `<button class="filter-btn" data-category="${name}">${info.icon} ${name}</button>`;
    }
    filterButtons.innerHTML = html;
}

function renderCards(packages) {
    const filtered = getFilteredPackages(packages);
    resultsCount.textContent = `${filtered.length} paket gösteriliyor`;
    if (filtered.length === 0) {
        cardsGrid.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><div class="no-results-title">Sonuç bulunamadı</div><div class="no-results-desc">Farklı bir arama terimi veya kategori deneyin</div></div>`;
        return;
    }
    cardsGrid.innerHTML = filtered.map((pkg, i) => createCardHTML(pkg, i)).join('');
}

function getFilteredPackages(packages) {
    const q = searchInput.value.toLowerCase().trim();
    return packages.filter(pkg => {
        const matchSearch = !q || pkg.name.toLowerCase().includes(q) || pkg.desc.toLowerCase().includes(q) || pkg.longDesc.toLowerCase().includes(q);
        const matchCat = activeFilter === 'Tümü' || pkg.category === activeFilter;
        return matchSearch && matchCat;
    });
}

function getRankClass(rank) {
    if (rank <= 3) return 'rank-gold';
    if (rank <= 10) return 'rank-silver';
    if (rank <= 25) return 'rank-bronze';
    return 'rank-default';
}

function getExtras(name) {
    if (typeof EXTRA_DETAILS !== 'undefined' && EXTRA_DETAILS[name]) return EXTRA_DETAILS[name];
    return {};
}

// ==========================================
// Card HTML — npm sayfası gibi detaylı
// ==========================================
function createCardHTML(pkg, index) {
    const catInfo = CATEGORIES[pkg.category] || { class: 'cat-utility', icon: '📦' };
    const isOpen = openCardId === pkg.name;
    const ex = getExtras(pkg.name);

    // Meta bar (version, license, downloads, stars)
    let metaBar = '<div class="detail-meta-bar">';
    if (ex.version) metaBar += `<span class="meta-badge version">v${ex.version}</span>`;
    if (ex.license) metaBar += `<span class="meta-badge license">${ex.license}</span>`;
    metaBar += `<span class="meta-badge downloads">⬇ ${pkg.downloads}</span>`;
    metaBar += `<span class="meta-badge stars">⭐ ${pkg.stars}</span>`;
    metaBar += '</div>';

    // Features
    let featuresHtml = '';
    if (ex.features && ex.features.length) {
        featuresHtml = `<div class="detail-section"><div class="detail-section-title">Öne Çıkan Özellikler</div><ul class="features-list">${ex.features.map(f => `<li>${f}</li>`).join('')}</ul></div>`;
    }

    // Use cases
    let useCasesHtml = '';
    if (ex.useCases && ex.useCases.length) {
        useCasesHtml = `<div class="detail-section"><div class="detail-section-title">Ne Zaman Kullanılır?</div><ul class="use-cases-list">${ex.useCases.map(u => `<li>${u}</li>`).join('')}</ul></div>`;
    }

    // Key APIs — supports {n, d} objects or plain strings
    let keyApisHtml = '';
    if (ex.keyAPIs && ex.keyAPIs.length) {
        const items = ex.keyAPIs.map(a => {
            if (typeof a === 'object' && a.n) {
                return `<div class="api-card"><div class="api-card-name">${a.n}</div><div class="api-card-desc">${a.d}</div></div>`;
            }
            return `<div class="api-card"><div class="api-card-name">${a}</div></div>`;
        }).join('');
        keyApisHtml = `<div class="detail-section"><div class="detail-section-title">Temel API / Metodlar</div><div class="key-apis">${items}</div></div>`;
    }

    // Alternatives
    let altsHtml = '';
    if (ex.alternatives && ex.alternatives.length) {
        altsHtml = `<div class="detail-section"><div class="detail-section-title">Alternatifler</div><div class="alternatives-list">${ex.alternatives.map(a => `<span class="alt-badge">${a}</span>`).join('')}</div></div>`;
    }

    return `
    <div class="card ${isOpen ? 'open' : ''}" data-name="${pkg.name}" style="animation-delay: ${Math.min(index * 0.03, 0.5)}s">
        <div class="card-header" onclick="toggleCard('${pkg.name}')">
            <div class="card-rank ${getRankClass(pkg.rank)}">${pkg.rank}</div>
            <div class="card-info">
                <div class="card-name">${pkg.name}</div>
                <div class="card-short-desc">${pkg.desc}</div>
            </div>
            <div class="card-meta">
                <span class="card-category-badge ${catInfo.class}">${catInfo.icon} ${pkg.category}</span>
            </div>
            <div class="card-toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
        </div>
        <div class="card-body">
            <div class="card-body-inner">
                ${metaBar}
                <div class="detail-section">
                    <div class="detail-section-title">Açıklama</div>
                    <div class="detail-description">${pkg.longDesc}</div>
                </div>
                ${featuresHtml}
                ${useCasesHtml}
                <div class="detail-section">
                    <div class="detail-section-title">Kurulum</div>
                    <div class="install-cmd" onclick="copyInstall(this, '${pkg.install || pkg.name}')">
                        <span class="prompt">$</span>
                        <span class="cmd-text">npm install ${pkg.install || pkg.name}</span>
                        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                </div>
                ${keyApisHtml}
                <div class="detail-section">
                    <div class="detail-section-title">Kullanım Örnekleri</div>
                    ${renderCodeExamples(pkg, ex)}
                </div>
                ${altsHtml}
                <div class="detail-links">
                    <a href="https://www.npmjs.com/package/${pkg.npm || pkg.name}" target="_blank" rel="noopener" class="detail-link">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0h-2.666V8.667h2.666v5.331zm12 0h-2.666v-4h-1.334v4h-1.334v-4H14v4h-1.335V8.667h10.001v5.331z"/></svg>
                        npmjs.com
                    </a>
                    ${pkg.github ? `<a href="${pkg.github}" target="_blank" rel="noopener" class="detail-link">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        GitHub
                    </a>` : ''}
                </div>
            </div>
        </div>
    </div>`;
}

// ==========================================
// Multiple Code Examples
// ==========================================
function renderCodeExamples(pkg, ex) {
    let html = '';
    // Primary code example always first
    html += createCodeEditorHTML(pkg.code, pkg.name + '.js', pkg.name + '__0');
    // Extra code examples from EXTRA_CODES or extras.codes
    const codes = (typeof EXTRA_CODES !== 'undefined' && EXTRA_CODES[pkg.name]) || ex.codes || [];
    if (codes.length) {
        codes.forEach((c, i) => {
            html += createCodeEditorHTML(c.code, c.title, pkg.name + '__' + (i + 1));
        });
    }
    return html;
}

// ==========================================
// Code Editor
// ==========================================
function createCodeEditorHTML(code, filename, pkgName) {
    codeStore[pkgName] = code;
    const lines = code.split('\n');
    const lineNums = lines.map((_, i) => `<span>${i + 1}</span>`).join('');
    const highlighted = highlightSyntax(code);
    return `
    <div class="code-editor">
        <div class="code-editor-header">
            <div class="code-editor-dots"><div class="code-editor-dot"></div><div class="code-editor-dot"></div><div class="code-editor-dot"></div></div>
            <div class="code-editor-title">${filename}</div>
            <button class="code-editor-copy" onclick="event.stopPropagation(); copyCode(this, '${pkgName}')">Kopyala</button>
        </div>
        <div class="code-editor-body">
            <div class="code-line-numbers">${lineNums}</div>
            <div class="code-content">${highlighted}</div>
        </div>
    </div>`;
}

// Tokenization-based syntax highlighting
function highlightSyntax(code) {
    let result = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let id = 0;
    const tokens = {};
    const t = (text, cls) => { const k = `\x00T${id++}\x00`; tokens[k] = `<span class="${cls}">${text}</span>`; return k; };

    // 1. Comments
    result = result.replace(/(\/\/.*$)/gm, m => t(m, 'cm'));
    result = result.replace(/(\/\*[\s\S]*?\*\/)/g, m => t(m, 'cm'));
    // 2. Strings
    result = result.replace(/('(?:[^'\\]|\\.)*')/g, m => t(m, 'str'));
    result = result.replace(/("(?:[^"\\]|\\.)*")/g, m => t(m, 'str'));
    result = result.replace(/(`(?:[^`\\]|\\.)*`)/g, m => t(m, 'str'));
    // 3. Keywords
    const kws = 'const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw|require|module|extends|switch|case|break|of|in|typeof|instanceof';
    result = result.replace(new RegExp(`\\b(${kws})\\b`, 'g'), m => t(m, 'kw'));
    // 4. Built-ins
    result = result.replace(/\b(console|process|JSON|Math|Object|Array|Promise|Error|Buffer|RegExp|Date|Map|Set)\b/g, m => t(m, 'obj'));
    // 5. Bool/null
    result = result.replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, m => t(m, 'var'));
    // 6. Numbers
    result = result.replace(/\b(\d+\.?\d*)\b/g, m => t(m, 'num'));
    // 7. Replace tokens
    for (const [k, html] of Object.entries(tokens)) { result = result.split(k).join(html); }
    return result;
}

// ==========================================
// Interaction
// ==========================================
function toggleCard(name) {
    const wasOpen = openCardId === name;
    openCardId = wasOpen ? null : name;
    document.querySelectorAll('.card').forEach(card => {
        if (card.dataset.name === name) {
            card.classList.toggle('open', !wasOpen);
            if (!wasOpen) setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        } else {
            card.classList.remove('open');
        }
    });
}

function copyInstall(el, pkg) {
    navigator.clipboard.writeText('npm install ' + pkg).then(() => {
        el.classList.add('copied');
        setTimeout(() => el.classList.remove('copied'), 2000);
    });
}

function copyCode(btn, pkgName) {
    const code = codeStore[pkgName];
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Kopyalandı!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
    });
}

function setupEventListeners() {
    searchInput.addEventListener('input', () => { openCardId = null; renderCards(PACKAGES); });
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInput.focus(); }
        if (e.key === 'Escape') { searchInput.value = ''; searchInput.blur(); openCardId = null; renderCards(PACKAGES); }
    });
    filterButtons.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        activeFilter = btn.dataset.category;
        openCardId = null;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(PACKAGES);
    });
}

document.addEventListener('DOMContentLoaded', init);
