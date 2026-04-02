// Teste simples para componentes React
// Execute com: node test-components.js

const fs = require('fs');

console.log('🧪 TESTE DE COMPONENTES REACT\n');

// Função para testar se componente tem estrutura válida
function testComponent(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const tests = [
      {
        name: 'Tem imports válidos',
        test: content.includes('import') && content.includes('from')
      },
      {
        name: 'Exporta componente',
        test: content.includes(`export function ${componentName}`) || content.includes('export default')
      },
      {
        name: 'Usa TypeScript',
        test: content.includes('interface') || content.includes('type') || content.includes(': ')
      },
      {
        name: 'Tem JSX válido',
        test: content.includes('return') && (content.includes('<') && content.includes('>'))
      }
    ];
    
    console.log(`📦 Testando: ${componentName}`);
    
    tests.forEach(test => {
      if (test.test) {
        console.log(`  ✅ ${test.name}`);
      } else {
        console.log(`  ❌ ${test.name}`);
      }
    });
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ Erro ao testar ${componentName}: ${error.message}\n`);
  }
}

// Testar componentes criados
testComponent('components/structured-data.tsx', 'MachineSchema');
testComponent('components/breadcrumbs.tsx', 'Breadcrumbs');

// Testar páginas criadas
function testPage(filePath, pageName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const tests = [
      {
        name: 'Tem metadata export',
        test: content.includes('export const metadata')
      },
      {
        name: 'Tem título otimizado',
        test: content.includes('title:') && content.includes('BaitaBriq')
      },
      {
        name: 'Tem descrição SEO',
        test: content.includes('description:') && content.length > 100
      },
      {
        name: 'Tem palavras-chave',
        test: content.includes('keywords:')
      },
      {
        name: 'Tem OpenGraph',
        test: content.includes('openGraph:')
      }
    ];
    
    console.log(`📄 Testando página: ${pageName}`);
    
    tests.forEach(test => {
      if (test.test) {
        console.log(`  ✅ ${test.name}`);
      } else {
        console.log(`  ❌ ${test.name}`);
      }
    });
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ Erro ao testar ${pageName}: ${error.message}\n`);
  }
}

// Testar páginas SEO
testPage('app/categoria/tratores/page.tsx', 'Tratores');
testPage('app/categoria/colheitadeiras/page.tsx', 'Colheitadeiras');
testPage('app/maquinas/rs/page.tsx', 'Máquinas RS');
testPage('app/blog/page.tsx', 'Blog');
testPage('app/blog/como-escolher-trator-usado/page.tsx', 'Artigo Blog');

console.log('🎯 TESTE DE STRUCTURED DATA\n');

// Testar se structured data está válido
try {
  const structuredDataContent = fs.readFileSync('components/structured-data.tsx', 'utf8');
  
  const schemas = ['MachineSchema', 'OrganizationSchema', 'WebsiteSchema'];
  
  schemas.forEach(schema => {
    if (structuredDataContent.includes(schema)) {
      console.log(`✅ Schema implementado: ${schema}`);
    } else {
      console.log(`❌ Schema não encontrado: ${schema}`);
    }
  });
  
  // Verificar se tem JSON-LD válido
  if (structuredDataContent.includes('"@context": "https://schema.org"')) {
    console.log('✅ JSON-LD com contexto válido');
  } else {
    console.log('❌ JSON-LD sem contexto válido');
  }
  
} catch (error) {
  console.log(`❌ Erro ao testar structured data: ${error.message}`);
}

console.log('\n✨ Teste de componentes concluído!');