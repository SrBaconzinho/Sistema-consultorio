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

  carregarNomes();
  carregarPsi();

  function carregarPsi(){
    const db = firebase.firestore();
    const nomesPsi = [];
    
  
    return db.collection("responsavel").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Verifica se a chave "nome" existe no documento antes de adicioná-la à array
          if (doc.data().nome) {
            nomesPsi.push(doc.data().nome);
          }
        });
  
        return selectPsi(nomesPsi);
      })
      .catch((error) => {
        console.error("Erro ao buscar documentos na coleção 'responsavel':", error);
        throw error; // Você pode escolher lidar com o erro de outra forma se preferir
      });
      
  }

 function selectPsi(nomesPsi){
    let selectPsi=document.getElementById("responsavel");

    selectPsi.innerHTML="";

     // Adiciona uma opção padrão
     const defaultOption = document.createElement("option");
     defaultOption.value = "";
     defaultOption.text = "Selecione um nome";
     selectPsi.appendChild(defaultOption);

      // Adiciona as opções dos nomes ao select
    nomesPsi.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.text = nome;
      selectPsi.appendChild(option);
  });

}

function ordenarArrayAlfabeticamente(arr) {
  // Cria uma cópia da array para evitar modificar a original
  const copiaArr = [...arr];

  // Usa o método sort() para ordenar a array
  copiaArr.sort((a, b) => a.localeCompare(b));

  return copiaArr;
}
  function carregarNomes() {
    let nomes = [];

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
  
    // Busca os documentos da coleção 'agendamentos'
    return db.collection("agendamentos").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Verifica se o nome já existe no array antes de adicioná-lo
        if (!nomes.includes(doc.data().nome)) {
          nomes.push(doc.data().nome);
        }
      });
  
      // Uma vez que os nomes são buscados, popular o select
      nomes=ordenarArrayAlfabeticamente(nomes);
      popularSelect(nomes);
    });
  }
  
  // Verifique se a função já foi executada
  if (!localStorage.getItem('funcaoExecutada')) {
    // Se não tiver sido executada, execute a função e marque no localStorage
    carregarNomes().then(() => {
      localStorage.setItem('funcaoExecutada', 'true');
    });
  }

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
    const nomePsi=document.getElementById("responsavel").value;
    const db = firebase.firestore();
    let crp;
    

    db.collection("responsavel").where('nome', '==', nomePsi).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
          // Se houver um documento correspondente, atualize o valor de crp com o valor do campo crp desse documento
          crp = querySnapshot.docs[0].data().crp;
        }
        const arrayInfos = [nome, data1, data2, nomePsi,crp];
  

      localStorage.setItem("arrayInfos",JSON.stringify(arrayInfos));
      
  
  }).catch((error) => {
      console.error("Erro ao buscar o documento:", error);
  });

    let data1 = FormatDate(dataInicio);
    let data2 = FormatDate(dataFim);


    if(!nome || !dataInicio || !dataFim){
        alert("Todos os campos precisam ser preenchidos!");
    }
    else{
        
        
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

  // const arrayInfos=JSON.parse(localStorage.getItem("arrayInfos"));

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

          fichaDocument.body.appendChild(ficha); // Adicionando a ficha ao corpo do documento
      });
      
  });
}
