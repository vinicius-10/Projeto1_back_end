const fs = require('node:fs');
const path = require('node:path');

const logDirectory = path.join(__dirname, '../logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

function registrarErro(erro, operacao) {
  const tipo = erro instanceof Error ? erro.name : typeof erro;
  const mensagem = erro instanceof Error ? erro.message : String(erro);
  const data = new Date().toISOString();

  const log = data + ' - ' + tipo + ' - ' + mensagem + ' - Operação: ' + operacao + '\n';
  fs.appendFileSync(path.join(logDirectory, 'errors.log'), log);
}

module.exports = { registrarErro };
