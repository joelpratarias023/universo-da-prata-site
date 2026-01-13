#!/usr/bin/env node

/**
 * Script para Criar Usuário Admin
 * Cria o primeiro usuário administrador no sistema
 */

require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Verificar se credenciais estão configuradas
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.log('\n❌ ERRO: Credenciais do Supabase não configuradas!');
  console.log('📖 Configure o arquivo .env primeiro.\n');
  process.exit(1);
}

if (process.env.SUPABASE_URL.includes('SEU_PROJETO') || 
    process.env.SUPABASE_KEY.includes('COLA_AQUI')) {
  console.log('\n❌ ERRO: Credenciais do Supabase ainda são placeholders!');
  console.log('📖 Substitua pelos valores reais do seu projeto Supabase.\n');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pergunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, resolve);
  });
}

async function criarAdmin() {
  console.log('\n🔧 CRIAR USUÁRIO ADMINISTRADOR\n');
  console.log('Este script vai criar o primeiro usuário admin do sistema.');
  console.log('Guarda bem estas credenciais!\n');

  try {
    // Coletar dados
    const nome = await pergunta('📝 Nome completo: ');
    if (!nome) {
      console.log('❌ Nome é obrigatório!');
      process.exit(1);
    }

    const email = await pergunta('📧 Email: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Email inválido!');
      process.exit(1);
    }

    const senha = await pergunta('🔑 Senha (mínimo 6 caracteres): ');
    if (!senha || senha.length < 6) {
      console.log('❌ Senha muito curta! Use pelo menos 6 caracteres.');
      process.exit(1);
    }

    const confirmarSenha = await pergunta('🔑 Confirmar senha: ');
    if (senha !== confirmarSenha) {
      console.log('❌ As senhas não correspondem!');
      process.exit(1);
    }

    console.log('\n⏳ Criando administrador...\n');

    // Verificar se email já existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (usuarioExistente) {
      console.log('❌ Este email já está cadastrado!');
      process.exit(1);
    }

    // Criar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário admin
    const { data: novoAdmin, error } = await supabase
      .from('usuarios')
      .insert({
        nome: nome,
        email: email.toLowerCase(),
        senha_hash: senhaHash,
        tipo: 'admin',
        ativo: true,
        verificado: true
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Erro ao criar admin:', error.message);
      process.exit(1);
    }

    console.log('✅ ADMINISTRADOR CRIADO COM SUCESSO!\n');
    console.log('━'.repeat(50));
    console.log('📋 DETALHES DA CONTA:');
    console.log('━'.repeat(50));
    console.log(`👤 Nome:  ${novoAdmin.nome}`);
    console.log(`📧 Email: ${novoAdmin.email}`);
    console.log(`🆔 ID:    ${novoAdmin.id}`);
    console.log(`🔐 Tipo:  ${novoAdmin.tipo}`);
    console.log('━'.repeat(50));
    console.log('\n🎯 PRÓXIMOS PASSOS:\n');
    console.log('1. Abre o arquivo: admin-access.html');
    console.log('2. Faz login com o email e senha criados');
    console.log('3. Acessa o painel admin completo');
    console.log('\n💡 Guarda estas credenciais num local seguro!\n');

  } catch (error) {
    console.log('\n❌ ERRO:', error.message);
    console.log('\n💡 Possíveis causas:');
    console.log('   - Credenciais do Supabase incorretas');
    console.log('   - Tabela "usuarios" não foi criada');
    console.log('   - Sem conexão à internet\n');
    process.exit(1);
  } finally {
    rl.close();
  }
}

criarAdmin();
