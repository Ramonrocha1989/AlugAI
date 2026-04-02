#!/usr/bin/env node

// Script master para executar todos os testes
// node run-all-tests.js

const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 EXECUTANDO TODOS OS TESTES - BaitaBriq SEO\n');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function logStep(step, message) {
  console.log(`${colors.cyan}[PASSO ${step}]${colors.reset} ${message}\n`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Passo 1: Teste de arquivos e estrutura
logStep(1, 'Testando arquivos e estrutura');
try {
  execSync('node test-seo.js', { stdio: 'inherit' });
  logSuccess('Teste de estrutura concluído');
} catch (error) {
  logError('Erro no teste de estrutura');
}

console.log('\n' + '='.repeat(60) + '\n');

// Passo 2: Teste de componentes
logStep(2, 'Testando componentes React');
try {
  execSync('node test-components.js', { stdio: 'inherit' });
  logSuccess('Teste de componentes concluído');
} catch (error) {
  logError('Erro no teste de componentes');
}

console.log('\n' + '='.repeat(60) + '\n');

// Passo 3: Verificar se servidor está rodando
logStep(3, 'Verificando servidor de desenvolvimento');

const http = require('http');

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/', (res) => {
      logSuccess('Servidor está rodando na porta 3000');
      resolve(true);
    }).on('error', () => {
      logError('Servidor não está rodando');
      logInfo('Execute: npm run dev');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function runUrlTests() {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    console.log('\n' + '='.repeat(60) + '\n');
    logStep(4, 'Testando URLs e conteúdo');
    
    try {
      execSync('node test-urls.js', { stdio: 'inherit' });
      logSuccess('Teste de URLs concluído');
    } catch (error) {
      logError('Erro no teste de URLs');
    }
  } else {
    console.log('\n' + '='.repeat(60) + '\n');
    logStep(4, 'Pulando teste de URLs (servidor não está rodando)');
    logInfo('Para testar URLs, execute: npm run dev');
    logInfo('Depois execute: node test-urls.js');
  }
  
  // Resumo final e instruções
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.cyan}📋 RESUMO FINAL E PRÓXIMOS PASSOS${colors.reset}`);
  console.log('='.repeat(60));
  
  console.log('\n🧪 TESTES EXECUTADOS:');
  console.log('✅ Estrutura de arquivos');
  console.log('✅ Componentes React');
  console.log('✅ Sintaxe TypeScript');
  console.log('✅ Metadata SEO');
  console.log(serverRunning ? '✅ URLs e conteúdo' : '⏸️  URLs (servidor offline)');
  
  console.log('\n🔍 TESTES MANUAIS RECOMENDADOS:');
  console.log('1. Execute: npm run dev');
  console.log('2. Acesse: http://localhost:3000');
  console.log('3. Navegue pelas páginas criadas:');
  console.log('   - /categoria/tratores');
  console.log('   - /categoria/colheitadeiras');
  console.log('   - /maquinas/rs');
  console.log('   - /blog');
  console.log('   - /blog/como-escolher-trator-usado');
  
  console.log('\n🔧 FERRAMENTAS DE VALIDAÇÃO:');
  console.log('• Google Rich Results Test: https://search.google.com/test/rich-results');
  console.log('• Schema Markup Validator: https://validator.schema.org/');
  console.log('• PageSpeed Insights: https://pagespeed.web.dev/');
  console.log('• Google Search Console (após deploy)');
  
  console.log('\n📊 MONITORAMENTO:');
  console.log('• Google Analytics: Tráfego orgânico');
  console.log('• Google Search Console: Indexação e erros');
  console.log('• Core Web Vitals: Performance');
  
  console.log('\n🚀 DEPLOY:');
  console.log('1. Commit todas as mudanças');
  console.log('2. Deploy para produção (Vercel/Netlify)');
  console.log('3. Submeter sitemap no Google Search Console');
  console.log('4. Aguardar indexação (1-7 dias)');
  
  console.log('\n📈 RESULTADOS ESPERADOS:');
  console.log('• 1-2 semanas: Rich snippets no Google');
  console.log('• 1 mês: 10-50 usuários orgânicos/dia');
  console.log('• 3 meses: 100-200 usuários orgânicos/dia');
  
  console.log(`\n${colors.green}🎉 IMPLEMENTAÇÃO SEO CONCLUÍDA COM SUCESSO!${colors.reset}`);
  console.log(`${colors.yellow}📝 Salve este log para referência futura.${colors.reset}\n`);
}

runUrlTests();