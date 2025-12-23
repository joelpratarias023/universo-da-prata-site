const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_KEY são obrigatórios no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Nota: não tentamos chamadas auth.getSession() aqui (pode falhar em ambiente server-side sem sessão).
// Apenas confirmamos que o cliente foi criado; a verificação completa das tabelas/queries
// é feita no `server.js` durante a inicialização.
console.log('ℹ️ Supabase client criado (verifique SUPABASE_URL e SUPABASE_KEY no .env)');

module.exports = supabase;
