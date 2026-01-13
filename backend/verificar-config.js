#!/usr/bin/env node

/**
 * Script de Verificação de Configuração
 * Verifica se todas as credenciais e configurações estão corretas
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('\n🔍 VERIFICANDO CONFIGURAÇÃO DO PROJETO...\n');

let hasErrors = false;

// ===================================
// 1. VERIFICAR VARIÁVEIS DE AMBIENTE
// ===================================
console.log('📋 1. Verificando variáveis de ambiente...');

const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'JWT_SECRET',
  'PORT'
];

const optionalEnvVars = [
  'SUPABASE_SERVICE_KEY',
  'EMAIL_USER',
  'EMAIL_PASSWORD'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`   ❌ ${varName} não está definida`);
    hasErrors = true;
  } else if (process.env[varName].includes('COLA_AQUI') || 
             process.env[varName].includes('TROCA_AQUI') ||
             process.env[varName].includes('SEU_PROJETO') ||
             process.env[varName].includes('placeholder')) {
    console.log(`   ⚠️  ${varName} ainda tem valor placeholder (precisa ser substituído)`);
    hasErrors = true;
  } else {
    console.log(`   ✅ ${varName} configurada`);
  }
});

optionalEnvVars.forEach(varName => {
  if (process.env[varName] && 
      !process.env[varName].includes('seu_email') && 
      !process.env[varName].includes('sua_senha')) {
    console.log(`   ✅ ${varName} configurada (opcional)`);
  } else {
    console.log(`   ⚪ ${varName} não configurada (opcional)`);
  }
});

// ===================================
// 2. VERIFICAR CONEXÃO COM SUPABASE
// ===================================
console.log('\n📡 2. Testando conexão com Supabase...');

async function testSupabaseConnection() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.log('   ⚠️  Credenciais do Supabase não configuradas, pulando teste...');
      return;
    }

    if (process.env.SUPABASE_URL.includes('SEU_PROJETO')) {
      console.log('   ⚠️  URL do Supabase ainda é placeholder, pulando teste...');
      return;
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // Testar conexão fazendo uma query simples
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      console.log(`   ❌ Erro ao conectar: ${error.message}`);
      hasErrors = true;
    } else {
      console.log('   ✅ Conexão com Supabase funcionando!');
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    hasErrors = true;
  }
}

// ===================================
// 3. VERIFICAR ESTRUTURA DE PASTAS
// ===================================
console.log('\n📁 3. Verificando estrutura de pastas...');

const fs = require('fs');
const path = require('path');

const requiredDirs = [
  'src',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/config',
  'src/middleware',
  'uploads'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ não encontrada`);
    hasErrors = true;
  }
});

// ===================================
// 4. VERIFICAR DEPENDÊNCIAS
// ===================================
console.log('\n📦 4. Verificando dependências instaladas...');

const requiredPackages = [
  '@supabase/supabase-js',
  'express',
  'cors',
  'dotenv',
  'bcryptjs',
  'jsonwebtoken',
  'multer'
];

requiredPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`   ✅ ${pkg}`);
  } catch (e) {
    console.log(`   ❌ ${pkg} não instalado`);
    hasErrors = true;
  }
});

// ===================================
// 5. VERIFICAR ARQUIVOS ESSENCIAIS
// ===================================
console.log('\n📄 5. Verificando arquivos essenciais...');

const requiredFiles = [
  'src/server.js',
  'src/config/database.js',
  'src/config/jwt.js',
  'package.json',
  '.env'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} não encontrado`);
    hasErrors = true;
  }
});

// ===================================
// 6. VERIFICAR JWT SECRET
// ===================================
console.log('\n🔐 6. Verificando segurança JWT...');

if (process.env.JWT_SECRET) {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (jwtSecret.includes('TROCA_AQUI') || 
      jwtSecret.includes('sua_chave_secreta') ||
      jwtSecret.length < 20) {
    console.log('   ⚠️  JWT_SECRET fraca ou é placeholder');
    console.log('   💡 Sugestão: Use uma senha forte com pelo menos 32 caracteres');
    hasErrors = true;
  } else {
    console.log('   ✅ JWT_SECRET configurada com segurança');
  }
}

// ===================================
// EXECUTAR TESTES ASSÍNCRONOS
// ===================================
(async () => {
  await testSupabaseConnection();

  // ===================================
  // RESULTADO FINAL
  // ===================================
  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.log('\n❌ CONFIGURAÇÃO INCOMPLETA\n');
    console.log('Corrija os problemas acima antes de iniciar o servidor.');
    console.log('\n📖 Consulte o TUTORIAL_SETUP_COMPLETO.md para instruções.\n');
    process.exit(1);
  } else {
    console.log('\n✅ CONFIGURAÇÃO COMPLETA!\n');
    console.log('Tudo está pronto para usar!');
    console.log('\n🚀 Próximo passo: Execute "npm start" para iniciar o servidor\n');
    process.exit(0);
  }
})();
