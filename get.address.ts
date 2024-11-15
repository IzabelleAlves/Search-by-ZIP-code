export async function getAddress(cep: string) {
  // async deixa a função assíncrona

  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(url); // await diz que vai puxar a resposta do servidor de forma assincrona
  const data = await response.json();
  return data;

  //procesamento
  console.error("Erro");
}
