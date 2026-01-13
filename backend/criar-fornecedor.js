const bcrypt = require('bcryptjs');
const supabase = require('./src/config/database');
const { v4: uuidv4 } = require('uuid');

async function criarFornecedor() {
  console.log('🏪 Criando fornecedor de teste...\n');

  const senha = 'fornecedor123';
  const senhaHash = await bcrypt.hash(senha, 10);
  
  const { data, error } = await supabase
    .from('fornecedores')
    .insert([{
      uuid: uuidv4(),
      nome: 'Fornecedor Teste',
      email: 'fornecedor@teste.com',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 98765-4321',
      senha: senhaHash,
      endereco: 'Rua Teste, 123 - São Paulo, SP',
      taxa_comissao: 10.00,
      status: 'ativo'
    }])
    .select();
  
  if (error) {
    if (error.code === '23505') {
      console.error('❌ Erro: Este email já está cadastrado!');
      console.log('\nTente fazer login com:');
      console.log('📧 Email: fornecedor@teste.com');
      console.log('🔑 Senha: fornecedor123');
    } else {
      console.error('❌ Erro ao criar fornecedor:', error);
    }
  } else {
    console.log('✅ Fornecedor criado com sucesso!');
    console.log('\n📋 Dados do fornecedor:');
    console.log(data[0]);
    console.log('\n🔐 Credenciais de acesso:');
    console.log('📧 Email: fornecedor@teste.com');
    console.log('🔑 Senha: fornecedor123');
    console.log('\n🌐 Acesse: fornecedor-login.html');
  }
  
  process.exit();
}

criarFornecedor();
