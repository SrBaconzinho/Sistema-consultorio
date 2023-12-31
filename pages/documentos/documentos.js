function showMenu() {
    document.getElementById("show-menu").querySelector("ul").style.display =
      "block";
  }

  function hideMenu() {
    document.getElementById("show-menu").querySelector("ul").style.display =
      "none";
  }
  function GoToPacientes() {
    window.location.href = "../pacientes/pacientes.html";
  }
  function goToHorario() {
    window.location.href = "../home/home.html";
  }
  
  function goToDocumentos(){
    window.location.href="documentos.html"
  }


  let nomes = [];
const db=firebase.firestore();
  firebase.initializeApp(firebaseConfig);

   // Busca os documentos da coleção 'pacientes'
   db.collection("pacientes").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // Adiciona o nome do paciente ao array
        nomes.push(doc.data().nome);
    });
    

    // Uma vez que os nomes são buscados, popular o select
    popularSelect(nomes);
}).catch((error) => {
    console.log("Erro ao buscar pacientes:", error);
});


function popularSelect(nomes) {
    const selectNome = document.getElementById("name");
  
    // Limpa as opções existentes
    selectNome.innerHTML = "";
  
    // Adiciona uma opção padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Selecione um nome";
    selectNome.appendChild(defaultOption);
  
    // Adiciona as opções dos nomes ao select
    nomes.forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.text = nome;
        selectNome.appendChild(option);
    });
  }

  function gerarDocumento(){
    const nome = document.getElementById("name").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const db = firebase.firestore();

    if(!nome || !dataInicio || !dataFim){
        alert("Todos os campos precisam ser preenchidos!");
    }
    else{
        let data1 = FormatDate(dataInicio);
        let data2 = FormatDate(dataFim);
        
        db.collection("agendamentos").get().then((querySnapshot) => {
            let agendamentosFiltrados = [];
            let datasOrdenadas = [];  // Array para armazenar as datas ordenadas
            
            querySnapshot.forEach((doc) => {
                const data = doc.data().data;
                const nomeDocumento = doc.data().nome;
                const atendido = doc.data().agendamento === "Atendido";
                
                if (data >= data1 && data <= data2 && nomeDocumento === nome && atendido) {
                    agendamentosFiltrados.push(doc.data());
                    datasOrdenadas.push(FormatDate(data));  // Adiciona a data formatada ao array
                }
            });
            
            // Ordena as datas
            datasOrdenadas.sort((a, b) => new Date(a.split('/').reverse().join('/')) - new Date(b.split('/').reverse().join('/')));

            // Aqui, agendamentosFiltrados contém os documentos que satisfazem as condições
            gerarFichas(datasOrdenadas);
        });
    }
}


  function FormatDate(dataToConvert) {
    let dataBrasil = dataToConvert.split("-").reverse().join("/");
  
    return dataBrasil;
}
function gerarFichas(datasOrdenadas) {
    // Criar um novo documento
    const fichaWindow = window.open('ficha.html', '_blank');
    
    // Esperar que a página seja carregada antes de adicionar as fichas
    fichaWindow.addEventListener('load', function() {
        const fichaDocument = fichaWindow.document;

        datasOrdenadas.forEach(data => {
            const ficha = fichaDocument.createElement('div');
            ficha.className = 'ficha';

            const colunaData = fichaDocument.createElement('div');
            colunaData.className = 'coluna';
            colunaData.innerText = data;

            const colunaPaciente = fichaDocument.createElement('div');
            colunaPaciente.className = 'coluna';
            // Aqui você pode adicionar espaço para assinatura do paciente, se necessário

            const colunaProfissional = fichaDocument.createElement('div');
            colunaProfissional.className = 'coluna';
            // Aqui você pode adicionar espaço para assinatura do profissional, se necessário

            ficha.appendChild(colunaData);
            ficha.appendChild(colunaPaciente);
            ficha.appendChild(colunaProfissional);

            fichaDocument.body.appendChild(ficha);
        });
    });
}
