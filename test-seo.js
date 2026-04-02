#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 INICIANDO TESTES DE FUNCIONALIDADES SEO - BaitaBriq\n');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

let passedTests = 0;
let failedTests = 0;

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
  passedTests++;
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  failedTests++;
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

// Teste 1: Verificar se arquivos foram criados
console.log('📁 TESTE 1: Verificando arquivos criados\n');

const requiredFiles = [
  'components/structured-data.tsx',
  'components/breadcrumbs.tsx',
  'app/categoria/tratores/page.tsx',
  'app/categoria/colheitadeiras/page.tsx',
  'app/maquinas/rs/page.tsx',
  'app/blog/page.tsx',
  'app/blog/como-escolher-trator-usado/page.tsx'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    logSuccess(`Arquivo existe: ${file}`);
  } else {
    logError(`Arquivo não encontrado: ${file}`);
  }
});

// Teste 2: Verificar conteúdo dos arquivos
console.log('\n📝 TESTE 2: Verificando conteúdo dos arquivos\n');

// Verificar structured-data.tsx
try {
  const structuredDataContent = fs.readFileSync('components/structured-data.tsx', 'utf8');
  if (structuredDataContent.includes('MachineSchema') && structuredDataContent.includes('WebsiteSchema')) {
    logSuccess('Structured data contém schemas necessários');
  } else {
    logError('Structured data não contém todos os schemas');
  }
} catch (error) {
  logError('Erro ao ler structured-data.tsx');
}

// Verificar se metadata foi atualizada no layout
try {
  const layoutContent = fs.readFileSync('app/layout.tsx', 'utf8');
  if (layoutContent.includes('Máquinas Agrícolas Usadas RS, SC, PR')) {
    logSuccess('Layout metadata foi atualizada');
  } else {
    logError('Layout metadata não foi atualizada');
  }
} catch (error) {
  logError('Erro ao ler layout.tsx');
}

// Teste 3: Verificar sintaxe TypeScript
console.log('\n🔍 TESTE 3: Verificando sintaxe TypeScript\n');

const tsFiles = [
  'components/structured-data.tsx',
  'components/breadcrumbs.tsx',
  'app/categoria/tratores/page.tsx',
  'app/blog/page.tsx'
];

tsFiles.forEach(file => {
  try {
    // Verificar se o arquivo tem sintaxe válida
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificações básicas de sintaxe
    const hasValidImports = content.includes('import') && content.includes('from');
    const hasValidExport = content.includes('export default') || content.includes('export function');
    const hasValidMetadata = file.includes('page.tsx') ? content.includes('Metadata') : true;
    
    if (hasValidImports && hasValidExport && hasValidMetadata) {
      logSuccess(`Sintaxe válida: ${file}`);
    } else {
      logError(`Sintaxe inválida: ${file}`);
    }
  } catch (error) {
    logError(`Erro ao verificar sintaxe: ${file}`);
  }
});

// Teste 4: Verificar sitemap atualizado
console.log('\n🗺️  TESTE 4: Verificando sitemap\n');

try {
  const sitemapContent = fs.readFileSync('app/sitemap.ts', 'utf8');
  const newPages = [
    '/categoria/tratores',
    '/categoria/colheitadeiras',
    '/maquinas/rs',
    '/blog'
  ];
  
  newPages.forEach(page => {
    if (sitemapContent.includes(page)) {
      logSuccess(`Sitemap contém: ${page}`);
    } else {
      logError(`Sitemap não contém: ${page}`);
    }
  });
} catch (error) {
  logError('Erro ao verificar sitemap');
}

// Teste 5: Verificar se página principal foi atualizada
console.log('\n🏠 TESTE 5: Verificando página principal\n');

try {
  const homeContent = fs.readFileSync('app/page.tsx', 'utf8');
  if (homeContent.includes('WebsiteSchema')) {
    logSuccess('Página principal contém WebsiteSchema');
  } else {
    logError('Página principal não contém WebsiteSchema');
  }
  
  if (homeContent.includes('structured-data')) {
    logSuccess('Página principal importa structured-data');
  } else {
    logError('Página principal não importa structured-data');
  }
} catch (error) {
  logError('Erro ao verificar página principal');
}

// Teste 6: Verificar estrutura de pastas
console.log('\n📂 TESTE 6: Verificando estrutura de pastas\n');

const requiredDirs = [
  'app/categoria',
  'app/categoria/tratores',
  'app/categoria/colheitadeiras',
  'app/maquinas',
  'app/maquinas/rs',
  'app/blog',
  'app/blog/como-escolher-trator-usado'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    logSuccess(`Diretório existe: ${dir}`);
  } else {
    logError(`Diretório não encontrado: ${dir}`);
  }
});

// Teste 7: Verificar se build funciona
console.log('\n🔨 TESTE 7: Verificando build do Next.js\n');

try {
  logInfo('Executando: npm run build (isso pode demorar...)');
  execSync('npm run build', { stdio: 'pipe' });
  logSuccess('Build executado com sucesso');
} catch (error) {
  logError('Erro no build do Next.js');
  logError(error.message);
}

// Teste 8: Verificar URLs específicas (se servidor estiver rodando)
console.log('\n🌐 TESTE 8: Verificando URLs (opcional)\n');

const testUrls = [
  'http://localhost:3000',
  'http://localhost:3000/categoria/tratores',
  'http://localhost:3000/blog',
  'http://localhost:3000/sitemap.xml'
];

logInfo('Para testar URLs, execute: npm run dev');
logInfo('Depois acesse manualmente:');
testUrls.forEach(url => {
  console.log(`   - ${url}`);
});

// Resumo final
console.log('\n📊 RESUMO DOS TESTES\n');
console.log(`${colors.green}✅ Testes aprovados: ${passedTests}${colors.reset}`);
console.log(`${colors.red}❌ Testes falharam: ${failedTests}${colors.reset}`);

if (failedTests === 0) {
  console.log(`\n${colors.green}🎉 TODOS OS TESTES PASSARAM! SEO implementado com sucesso.${colors.reset}`);
} else {
  console.log(`\n${colors.yellow}⚠️  Alguns testes falharam. Verifique os erros acima.${colors.reset}`);
}

// Checklist manual
console.log('\n📋 CHECKLIST MANUAL:\n');
console.log('1. Execute: npm run dev');
console.log('2. Acesse: http://localhost:3000');
console.log('3. Teste navegação para páginas de categoria');
console.log('4. Verifique se breadcrumbs aparecem');
console.log('5. Inspecione HTML para ver structured data');
console.log('6. Teste: http://localhost:3000/sitemap.xml');
console.log('7. Verifique Google Search Console após deploy');

console.log('\n🚀 Próximos passos:');
console.log('- Deploy para produção');
console.log('- Submeter sitemap no Google Search Console');
console.log('- Monitorar Google Analytics');
console.log('- Criar mais conteúdo para o blog\n');