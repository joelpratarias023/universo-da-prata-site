const bcrypt = require('bcryptjs');
const supabase = require('./src/config/database');

/**
 * Script para criar entregador de teste
 * Execute: node backend/criar-entregador.js
 */

async function criarEntregadorTeste() {
    try {
        console.log('🚀 Criando entregador de teste...\n');

        // Hash da senha
        const senha_hash = await bcrypt.hash('senha123', 10);

        // Dados do entregador
        const dados = {
            nome: 'João Silva',
            email: 'joao@entregador.com',
            senha_hash: senha_hash,
            telefone: '(11) 98765-4321',
            cpf: '123.456.789-00',
            veiculo: 'Moto Honda CG 160',
            dados_bancarios: {
                pix: '123.456.789-00',
                banco: 'Banco Exemplo',
                agencia: '1234',
                conta: '12345-6'
            },
            ativo: true
        };

        // Inserir no banco
        const { data, error } = await supabase
            .from('entregadores')
            .insert([dados])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                console.log('⚠️  Entregador já existe!');
                console.log('   Email:', dados.email);
                return;
            }
            throw error;
        }

        console.log('✅ Entregador criado com sucesso!\n');
        console.log('📧 Email:', dados.email);
        console.log('🔑 Senha: senha123');
        console.log('📱 Telefone:', dados.telefone);
        console.log('🚚 Veículo:', dados.veiculo);
        console.log('\n🌐 Acesse: fornecedor/entregadores/entregador-login.html');

    } catch (erro) {
        console.error('❌ Erro ao criar entregador:', erro.message);
    } finally {
        process.exit();
    }
}

// Executar
criarEntregadorTeste();
