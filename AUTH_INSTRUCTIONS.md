# Instruções de autenticação (Supabase)

Siga estes passos para configurar e testar autenticação com Supabase no site:

1. Criar projeto Supabase
   - Aceda a https://app.supabase.com e crie um novo projeto.

2. Obter `URL` e `ANON KEY`
   - No painel do projeto vá a `Settings` → `API` e copie a `URL` do projeto e a `anon key`.

3. Configurar no projeto local
   - Abra `scripts/config.js` e substitua os placeholders por suas credenciais:

     window.SUPABASE_URL = "https://SEU_PROJETO.supabase.co";
     window.SUPABASE_ANON_KEY = "SEU_ANON_KEY";

   - Atenção: NÃO versionar/commitar chaves privadas em repositórios públicos.

4. (Opcional) Habilitar tipo de autenticação
   - Em `Authentication` → `Settings` no Supabase, verifique se `Email` está habilitado.
   - Se usar confirmação por email, novos registos poderão requerer verificação antes do login.

5. Permissões e redirecionamentos
   - Para flows OAuth/redirecionamentos adicione `http://localhost:8000` (ou a porta que usar) em `Site URL`/`Redirect URLs` nas configurações de autenticação.

6. Servir o site localmente e testar
   - A partir da raiz do site execute um servidor estático (exemplos):

```powershell
python -m http.server 8000
# ou
npx serve .
```

   - Abra `http://localhost:8000` no navegador.
   - Clique em "Entrar / Criar conta" no menu, use o modal para registar um novo utilizador ou fazer login.

7. Fluxos esperados
   - `Criar conta` usa `auth.signUp` (pode exigir verificação por e-mail).
   - `Entrar` usa `auth.signInWithPassword`.
   - `Sair` usa `auth.signOut`.

Se quiser, posso adicionar validação de formulários, estilos ao modal, ou persistir dados de perfil na tabela `users` do Supabase via uma API backend.
