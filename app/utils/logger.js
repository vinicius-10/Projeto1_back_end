const fs = require('node:fs');
const path = require('node:path');

const logDirectory = path.join(__dirname, '../logs');

function garantirArquivoLog(nomeArquivo) {
  fs.mkdirSync(logDirectory, { recursive: true });

  const caminhoArquivo = path.join(logDirectory, nomeArquivo);
  const descritor = fs.openSync(caminhoArquivo, 'a');
  fs.closeSync(descritor);

  return caminhoArquivo;
}

function registrarErro(erro, operacao) {
  const tipo = erro instanceof Error ? erro.name : typeof erro;
  const mensagem = erro instanceof Error ? erro.message : String(erro);
  const data = new Date().toISOString();

  const log = data + ' - ' + tipo + ' - ' + mensagem + ' - Operação: ' + operacao + '\n';
  fs.appendFileSync(garantirArquivoLog('errors.log'), log);
}

function registrarValidacao(passou, validacao, operacao) {
  const resultado = passou ? 'APROVADA' : 'REPROVADA';
  const data = new Date().toISOString();
  const log =
    data +
    ' - Validação ' +
    resultado +
    ' - ' +
    validacao +
    ' - Operação: ' +
    operacao +
    '\n';

  fs.appendFileSync(garantirArquivoLog('validations.log'), log);
  return passou;
}

module.exports = { registrarErro, registrarValidacao };
