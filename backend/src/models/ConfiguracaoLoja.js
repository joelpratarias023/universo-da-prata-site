const supabase = require('../config/database');

class ConfiguracaoLoja {
  static async obter() {
    const { data, error } = await supabase
      .from('configuracoes_loja')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    return data || {
      id: 1,
      nome: '',
      contacto: '',
      whatsapp: '',
      taxa_entrega: 0,
      texto_home: '',
      texto_sobre: '',
    };
  }

  static async salvar(dados) {
    const payload = {
      id: 1,
      nome: dados.nome || '',
      contacto: dados.contacto || '',
      whatsapp: dados.whatsapp || '',
      taxa_entrega: typeof dados.taxa_entrega === 'number' ? dados.taxa_entrega : 0,
      texto_home: dados.texto_home || '',
      texto_sobre: dados.texto_sobre || '',
      data_atualizacao: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('configuracoes_loja')
      .upsert([payload])
      .select();

    if (error) throw error;
    return data?.[0] || payload;
  }
}

module.exports = ConfiguracaoLoja;
