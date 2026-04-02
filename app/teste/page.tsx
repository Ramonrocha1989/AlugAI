export default function TestePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">✅ Página de Teste Funcionando!</h1>
      <p className="text-lg">Se você está vendo isso, o roteamento está funcionando.</p>
      <p className="mt-4">
        <a href="/categoria/tratores" className="text-blue-600 underline">
          Tentar acessar /categoria/tratores novamente
        </a>
      </p>
    </div>
  );
}