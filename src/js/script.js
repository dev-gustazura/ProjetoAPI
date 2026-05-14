// Declarações dos elementos usando  DOM(Document Object Model)
const videoElemento = document.getElementById('video');
const botaoScanear = document.getElementById('btn-texto');
const resultado = document.getElementById('saida');
const canvas = document.getElementById('canvas');

// Função para habilitar a câmera
async function configurarCamera() {
    // Tratamento de erros
    try{
        // Chama a API do navegador para solicitar acesso
        const midia = await navitagator.mediaDevices.getUserMedia({
            // Habilita a câmera traseira
            video:{facingMode: 'enviroment'},
            // O audio não será capturado
            audio:false
        });
        // Recebe a função midia para ser executada
        videoElemento.srcObject=midia;
        // força a reprodução do video
        videoElemento.play();
    }catch(erro){
        resultado.innerText="Erro ao acessar a Camaera",erro;
    }
}

// função para capturar o texto da câmera
configurarCamera();

botaoScanear.onclick = async ()=>{
    botaoScanear.disabled=true; // Habilitando a camera
    resultado.innerText="Fazendo a leitura do texto... aguarde";

    //Define o canvas para iniciar a leitura
    const contexto = canvas.getContext('2d');

    //ajusta o tamanho do canvas para o tamanho real do video
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //aplica o filtro para melhorar o OCR
    contexto.filter='contrast(1.2 grayscale(1)';

    // desenha o video no canvas

    contexto.drawImage(videoElemento,0,0, canvas.width, canvas.height);

    try{
        const {data:{text}}=await Tesseract.recognize(
            canvas,
            'por' //defina o idioma
        );
        // remove os espaços em branco
        const textoFinal = text.trim();
        // estrutura condicional terminaria ? = if : =else
        resultado.innerText=textoFinal.length > 0? textoFinal: 'não foi possível idenficar o texto'
    }catch(erro){
        resultado.innerText='erro no processamento',erro
    }
    finally{
        // desabilita o botão para fazer nova captura
        botaoScanear.disabled=false;
    }
}