function testar() {
    const n=3
    dataString = "2024-03-23";

    const parts = dataString.split("-");
    const ano = parseInt(parts[0], 10);
    const mes = parseInt(parts[1], 10) - 1;
    const dia = parseInt(parts[2], 10);

    const data = new Date(ano, mes, dia);

    for (let i=0;i<n;i++){

        
        data.setDate(data.getDate() + 7); // Adiciona 7 dias à data
        
        console.log(data);}
    }