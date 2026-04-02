#!/usr/bin/env node

// Teste de URLs - Execute após npm run dev
// node test-urls.js

const http = require('http');

console.log('🌐 TESTE DE URLs - BaitaBriq\n');
console.log('⚠️  Certifique-se de que o servidor está rodando: npm run dev\n');

const baseUrl = 'http://localhost:3000';

const urlsToTest = [
  {
    path: '/',
    name: 'Página Principal',
    shouldContain: ['baitabriq', 'máquinas']
  },
  {
    path: '/categoria/tratores',
    name: 'Página de Tratores',
    shouldContain: ['Tratores Usados', 'John Deere', 'Case IH']
  },
  {
    path: '/categoria/colheitadeiras',
    name: 'Página de Colheitadeiras',
    shouldContain: ['Colheitadeiras Usadas', 'Axial Flow']
  },
  {
    path: '/maquinas/rs',
    name: 'Máquinas RS',
    shouldContain: ['Rio Grande do Sul', 'Pelotas']
  },
  {
    path: '/blog',
    name: 'Blog Principal',
    shouldContain: ['Blog BaitaBriq', 'Como Escolher']
  },
  {
    path: '/blog/como-escolher-trator-usado',
    name: 'Artigo do Blog',
    shouldContain: ['Como Escolher o Trator', 'potência']
  },
  {
    path: '/sitemap.xml',
    name: 'Sitemap XML',
    shouldContain: ['<?xml', 'sitemap', 'categoria/tratores']
  },
  {
    path: '/robots.txt',
    name: 'Robots.txt',
    shouldContain: ['User-agent', 'sitemap']
  }
];

let passedTests = 0;
let failedTests = 0;

function testUrl(url, name, shouldContain = []) {
  return new Promise((resolve) => {
    const fullUrl = `${baseUrl}${url}`;
    
    const req = http.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n🔍 Testando: ${name} (${url})`);
        
        // Verificar status code
        if (res.statusCode === 200) {
          console.log(`  ✅ Status: ${res.statusCode} OK`);
        } else {
          console.log(`  ❌ Status: ${res.statusCode}`);
          failedTests++;
          resolve();
          return;
        }
        
        // Verificar content-type
        const contentType = res.headers['content-type'];
        console.log(`  ℹ️  Content-Type: ${contentType}`);
        
        // Verificar conteúdo esperado
        let contentPassed = true;
        shouldContain.forEach(text => {
          if (data.toLowerCase().includes(text.toLowerCase())) {
            console.log(`  ✅ Contém: "${text}"`);
          } else {
            console.log(`  ❌ Não contém: "${text}"`);
            contentPassed = false;
          }
        });
        
        // Verificar tamanho da resposta
        console.log(`  ℹ️  Tamanho: ${data.length} bytes`);
        
        // Verificar se é HTML válido (para páginas HTML)
        if (contentType && contentType.includes('text/html')) {
          if (data.includes('<!DOCTYPE html>') || data.includes('<html')) {
            console.log(`  ✅ HTML válido`);
          } else {
            console.log(`  ❌ HTML inválido`);
            contentPassed = false;
          }
          
          // Verificar meta tags importantes
          if (data.includes('<title>') && data.includes('BaitaBriq')) {
            console.log(`  ✅ Título com BaitaBriq`);
          } else {
            console.log(`  ❌ Título sem BaitaBriq`);
          }
          
          if (data.includes('<meta name="description"')) {
            console.log(`  ✅ Meta description presente`);
          } else {
            console.log(`  ❌ Meta description ausente`);
          }
          
          // Verificar structured data
          if (data.includes('application/ld+json')) {
            console.log(`  ✅ Structured data presente`);
          } else {
            console.log(`  ⚠️  Structured data não encontrado`);
          }
        }
        
        if (contentPassed) {
          passedTests++;
        } else {
          failedTests++;
        }
        
        resolve();
      });
    });
    
    req.on('error', (error) => {
      console.log(`\n❌ Erro ao testar ${name}: ${error.message}`);
      failedTests++;
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log(`\n⏰ Timeout ao testar ${name}`);
      failedTests++;
      req.destroy();
      resolve();
    });
  });
}

// Executar testes sequencialmente
async function runTests() {
  console.log('Iniciando testes de URLs...\n');
  
  for (const urlTest of urlsToTest) {
    await testUrl(urlTest.path, urlTest.name, urlTest.shouldContain);
    // Pequena pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Resumo final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DOS TESTES DE URL');
  console.log('='.repeat(50));
  console.log(`✅ URLs funcionando: ${passedTests}`);
  console.log(`❌ URLs com problemas: ${failedTests}`);
  console.log(`📊 Total testado: ${urlsToTest.length}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 TODOS OS TESTES DE URL PASSARAM!');
    console.log('✨ Todas as páginas SEO estão funcionando corretamente.');
  } else {
    console.log('\n⚠️  Alguns testes falharam.');
    console.log('🔧 Verifique se o servidor está rodando: npm run dev');
    console.log('🔧 Verifique os erros acima para mais detalhes.');
  }
  
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('1. Teste manualmente cada URL no navegador');
  console.log('2. Verifique o código fonte (Ctrl+U) para ver structured data');
  console.log('3. Use ferramentas como Google Rich Results Test');
  console.log('4. Faça deploy e teste em produção');
}

// Verificar se servidor está rodando antes de testar
console.log('🔍 Verificando se servidor está rodando...');

const testReq = http.get(`${baseUrl}/`, (res) => {
  console.log('✅ Servidor está rodando! Iniciando testes...\n');
  runTests();
}).on('error', (error) => {
  console.log('❌ Servidor não está rodando!');
  console.log('🚀 Execute primeiro: npm run dev');
  console.log('⏰ Aguarde o servidor iniciar e execute novamente este teste.');
});