const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const supabase = require('./config/database');

// Import dos models para criar tabelas
const Usuario = require('./models/Usuario');
const Produto = require('./models/Produto');
const Categoria = require('./models/Categoria');
const Pedido = require('./models/Pedido');
const ItensPedido = require('./models/ItensPedido');
const Endereco = require('./models/Endereco');
const Avaliacao = require('./models/Avaliacao');
const Fornecedor = require('./models/Fornecedor');

// Import das rotas
const authRoutes = require('./routes/auth');
const produtoRoutes = require('./routes/produtos');
const categoriaRoutes = require('./routes/categorias');
const pedidoRoutes = require('./routes/pedidos');
const enderecoRoutes = require('./routes/enderecos');
const avaliacaoRoutes = require('./routes/avaliacoes');
const usuarioRoutes = require('./routes/usuarios');
const adminRoutes = require('./routes/admin');
const fornecedorRoutes = require('./routes/fornecedores');

// Import dos middlewares
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['*'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Uploads (imagens)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'Supabase (PostgreSQL)'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/enderecos', enderecoRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fornecedores', fornecedorRoutes);

// Novas rotas do sistema completo de admin
const adminCompletoRoutes = require('./routes/adminCompleto');
const entregadoresRoutes = require('./routes/entregadores');
app.use('/api/admin-completo', adminCompletoRoutes);
app.use('/api/entregadores', entregadoresRoutes);

// Rota raiz
app.get('/api', (req, res) => {
  res.json({
    mensagem: 'Bem-vindo à API do Universo da Prata',
    versao: '1.0.0',
    database: 'Supabase',
    endpoints: {
      auth: '/api/auth',
      produtos: '/api/produtos',
      categorias: '/api/categorias',
      pedidos: '/api/pedidos',
      enderecos: '/api/enderecos',
      avaliacoes: '/api/avaliacoes',
      usuarios: '/api/usuarios',
      admin: '/api/admin',
      fornecedores: '/api/fornecedores',
    },
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada',
    caminho: req.path,
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Função para verificar se as tabelas existem (informativo)
const verificarTabelas = async () => {
  try {
    console.log('📊 Verificando tabelas do banco de dados...');
    
    // Tenta fazer uma consulta simples em cada tabela
    const tabelas = ['categorias', 'usuarios', 'produtos', 'pedidos'];
    
    for (const tabela of tabelas) {
      const { data, error } = await supabase
        .from(tabela)
        .select('COUNT(*)', { count: 'exact', head: true });
      
      if (error) {
        console.warn(`⚠️  Tabela "${tabela}" pode não existir. Execute o script supabase-schema.sql`);
      } else {
        console.log(`✅ Tabela "${tabela}" verificada`);
      }
    }
  } catch (erro) {
    console.error('❌ Erro ao verificar tabelas:', erro.message);
  }
};

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    // Verificar tabelas
    await verificarTabelas();

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 Servidor rodando com sucesso!            ║
║  📡 Porta: ${PORT}                           ║
║  🌐 URL: http://localhost:${PORT}            ║
║  📚 API Docs: http://localhost:${PORT}/api   ║
║  🗄️  Banco: Supabase (PostgreSQL)            ║
╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (erro) {
    console.error('❌ Erro ao iniciar o servidor:', erro);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;
