const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin');
const resultDiv = document.getElementById('result');
const sortedBooksDiv = document.getElementById('sorted-books');

let livros = [
    "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
    "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
    "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
    "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
    "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
    "Ezequiel", "Daniel", "Oseias", "Joel", "Amós",
    "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque",
    "Sofonias", "Ageu", "Zacarias", "Malaquias",
    "Mateus", "Marcos", "Lucas", "João", "Atos",
    "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
    "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
    "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
    "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João",
    "3 João", "Judas", "Apocalipse"
];

const colors = ["#f8b400", "#f85f73", "#28c76f", "#00cfe8", "#7367f0", "#ea5455"];
let sliceAngle = 2 * Math.PI / livros.length;
let startAngle = 0;
let spinAngle = 0;
let spinTime = 0;
let spinTimeTotal = 0;

let sorteados = []; // NOVO: array para livros sorteados

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sliceAngle = 2 * Math.PI / livros.length;

    livros.forEach((livro, i) => {
        const angle = startAngle + i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 240, angle, angle + sliceAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.fillText(livro, 230, 5);
        ctx.restore();
    });

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(250 - 10, 10);
    ctx.lineTo(250 + 10, 10);
    ctx.lineTo(250, 40);
    ctx.fill();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngleIncrement = spinAngle - easeOut(spinTime, 0, spinAngle, spinTimeTotal);
    startAngle += (spinAngleIncrement * Math.PI / 180);
    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = 360 / livros.length;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    const selected = livros[index];

    resultDiv.innerHTML = `📖 Livro sorteado: <b>${selected}</b>!`;

    // Adicionar ao array de sorteados
    sorteados.push(selected);

    // Atualizar o acordeon
    sortedBooksDiv.innerHTML = sorteados.map(l => `<p>📚 ${l}</p>`).join("");

    // Remover o livro sorteado da lista
    livros.splice(index, 1);

    if (livros.length === 0) {
        resultDiv.innerHTML = "🎉 Todos os livros foram sorteados!";
        spinBtn.disabled = true;
    }

    drawWheel();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

spinBtn.addEventListener('click', () => {
    if (livros.length === 0) return;
    spinAngle = Math.random() * 3000 + 4000;
    spinTime = 0;
    spinTimeTotal = 3000;
    rotateWheel();
});

// Acordeon abrir e fechar
const accordionBtn = document.querySelector(".accordion-button");
accordionBtn.addEventListener('click', function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
});

drawWheel();
