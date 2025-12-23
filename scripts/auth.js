// scripts/auth.js
// Integração simples com Supabase para login, cadastro e logout.
(function () {
  const SUPABASE_URL = window.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

  const supabaseLib = window.supabase;
  const isPlaceholderUrl = typeof SUPABASE_URL === 'string' && SUPABASE_URL.includes('REPLACE_WITH_YOUR_SUPABASE_URL');
  const isPlaceholderKey = typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.includes('REPLACE_WITH_YOUR_SUPABASE_ANON_KEY');
  const hasSupabaseConfig = !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !isPlaceholderUrl && !isPlaceholderKey;

  if (!hasSupabaseConfig) {
    console.warn('Supabase URL/ANON_KEY não configurados. O modal abre, mas login/cadastro ficará indisponível até configurar scripts/config.js.');
  }

  let client = null;
  try {
    if (supabaseLib && typeof supabaseLib.createClient === 'function' && hasSupabaseConfig) {
      client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (err) {
    console.warn('Falha ao iniciar Supabase client. O modal continuará disponível, mas sem autenticação.', err);
    client = null;
  }

  // Elementos
  const loginBtn = document.getElementById('login-btn');
  const loginBtnMobile = document.getElementById('login-btn-mobile');
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-close');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const authMessages = document.getElementById('auth-messages');
  const signoutBtn = document.getElementById('signout-btn');

  function openModal() {
    if (authModal) authModal.style.display = 'flex';
    document.body.classList.add('auth-modal-open');
  }
  function closeModal() {
    if (authModal) authModal.style.display = 'none';
    document.body.classList.remove('auth-modal-open');
    setMessage('');
  }
  function setMessage(msg, isError = true) {
    if (!authMessages) return;
    authMessages.style.color = isError ? 'crimson' : 'green';
    authMessages.textContent = msg || '';
  }
  function showTab(tab) {
    if (!tabLogin || !tabSignup || !loginForm || !signupForm) return;
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    } else {
      tabLogin.classList.remove('active');
      tabSignup.classList.add('active');
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
    }
    setMessage('');
  }

  function ensureSwitchLinks() {
    if (!loginForm || !signupForm) return;

    if (!document.getElementById('auth-switch-to-signup')) {
      const wrap = document.createElement('div');
      wrap.className = 'auth-switch';
      wrap.innerHTML = 'Não tem conta? <button type="button" id="auth-switch-to-signup">Criar conta</button>';
      loginForm.appendChild(wrap);
    }

    if (!document.getElementById('auth-switch-to-login')) {
      const wrap = document.createElement('div');
      wrap.className = 'auth-switch';
      wrap.innerHTML = 'Já tem conta? <button type="button" id="auth-switch-to-login">Entrar</button>';
      signupForm.appendChild(wrap);
    }

    const toSignup = document.getElementById('auth-switch-to-signup');
    const toLogin = document.getElementById('auth-switch-to-login');
    if (toSignup) toSignup.addEventListener('click', () => showTab('signup'));
    if (toLogin) toLogin.addEventListener('click', () => showTab('login'));
  }

  async function signIn(email, password) {
    if (!client) {
      setMessage('Autenticação indisponível. Configure o Supabase em scripts/config.js.');
      return;
    }
    try {
      setMessage('Entrando...', false);
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage('Entrou com sucesso.', false);
      updateMenuUser(data?.user || null);
      closeModal();
    } catch (err) {
      setMessage(err.message || 'Erro ao entrar.');
    }
  }

  async function signUp(full_name, email, password) {
    if (!client) {
      setMessage('Cadastro indisponível. Configure o Supabase em scripts/config.js.');
      return;
    }
    try {
      setMessage('Criando conta...', false);
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name } }
      });
      if (error) throw error;
      setMessage('Conta criada. Verifique seu email se necessário.', false);
      updateMenuUser(data?.user || null);
      closeModal();
    } catch (err) {
      setMessage(err.message || 'Erro ao criar conta.');
    }
  }

  async function signOut() {
    if (!client) {
      updateMenuUser(null);
      setMessage('');
      return;
    }
    try {
      await client.auth.signOut();
      updateMenuUser(null);
      setMessage('');
    } catch (err) {
      console.error('Erro ao sair', err);
    }
  }

  function updateMenuUser(user) {
    const loginAnchor = document.getElementById('login-btn');
    const mobileAnchor = document.getElementById('login-btn-mobile');
    if (user) {
      const name = user.user_metadata?.full_name || user.email || 'Conta';
      if (loginAnchor) loginAnchor.textContent = name;
      if (mobileAnchor) mobileAnchor.innerHTML = '<i class="fas fa-user-check"></i>';
      if (signoutBtn) signoutBtn.style.display = 'inline-block';
    } else {
      if (loginAnchor) loginAnchor.textContent = 'Entrar / Criar conta';
      if (mobileAnchor) mobileAnchor.innerHTML = '<i class="fas fa-user"></i>';
      if (signoutBtn) signoutBtn.style.display = 'none';
    }
  }

  // Event listeners
  if (loginBtn) loginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); showTab('login'); });
  if (loginBtnMobile) loginBtnMobile.addEventListener('click', (e) => { e.preventDefault(); openModal(); showTab('login'); });
  if (authClose) authClose.addEventListener('click', closeModal);
  if (tabLogin) tabLogin.addEventListener('click', () => showTab('login'));
  if (tabSignup) tabSignup.addEventListener('click', () => showTab('signup'));
  if (signoutBtn) signoutBtn.addEventListener('click', signOut);

  ensureSwitchLinks();

  // Fecha ao clicar fora do cartão
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeModal();
    });
  }

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal && authModal.style.display !== 'none') {
      closeModal();
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      signIn(email, password);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const full_name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      signUp(full_name, email, password);
    });
  }

  // Atualiza menu com estado atual
  if (client) {
    client.auth.getUser().then(({ data }) => {
      updateMenuUser(data?.user || null);
    }).catch(() => {
      updateMenuUser(null);
    });

    // Observa mudanças de autenticação
    client.auth.onAuthStateChange((event, session) => {
      updateMenuUser(session?.user || null);
    });
  } else {
    updateMenuUser(null);
  }

})();
