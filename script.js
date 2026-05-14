const firebaseConfig = {
    apiKey: "AIzaSyDzA82S6v-6x_gXue8Q1LgOZLB7lJrLhYY",
    authDomain: "safeusm.firebaseapp.com",
    projectId: "safeusm",
    storageBucket: "safeusm.firebasestorage.app",
    messagingSenderId: "488287141022",
    appId: "1:488287141022:web:3ca4efe8c394a7429d8f8f",
    measurementId: "G-5S3J58FPB6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let categoriaSeleccionada = "";
const btnEnviar = document.getElementById('send-btn');
const inputComentario = document.getElementById('user-comment');
const botonesCategoria = document.querySelectorAll('.cat-btn');

botonesCategoria.forEach(boton => {
    boton.addEventListener('click', (e) => {
        categoriaSeleccionada = e.target.getAttribute('data-category');

        alert("Has seleccionado la categoría: " + categoriaSeleccionada);

        botonesCategoria.forEach(b => b.style.border = "none");
        e.target.style.border = "2px solid white";
    });
});

btnEnviar.addEventListener('click', () => {
    const comentario = inputComentario.value;

    if (comentario.trim() === "" || categoriaSeleccionada === "") {
        alert("Por favor, escribe un comentario y selecciona una categoría (Seguridad, Salud o Género).");
        return;
    }

    // Guardamos en la colección "reportes" de tu Firestore
    db.collection("reportes").add({
        texto: comentario,
        categoria: categoriaSeleccionada,
        fecha: new Date(),
        fotoUrl: "proximamente_link_de_foto" // Esto lo cambiaremos cuando actives Storage
    })
        .then(() => {
            alert("¡Reporte enviado con éxito! Ya puedes verlo en tu consola de Firebase.");
            inputComentario.value = ""; // Limpiamos el texto
            categoriaSeleccionada = ""; // Limpiamos la categoría
        })
        .catch((error) => {
            console.error("Hubo un error al guardar:", error);
            alert("Error al enviar: " + error.message);
        });
});

// 5. FUNCIÓN PARA MOSTRAR LOS REPORTES EN TIEMPO REAL
const listaReportes = document.getElementById('preview-container');

// Esta función lee los datos de Firestore cada vez que hay un cambio
db.collection("reportes").orderBy("fecha", "desc").onSnapshot((snapshot) => {
    // Limpiamos el contenedor antes de volver a llenarlo
    listaReportes.innerHTML = "";

    snapshot.forEach((doc) => {
        const reporte = doc.data();

        // Creamos el diseño de cada tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'glass-panel'; // Usamos tu clase de estilo
        tarjeta.style.margin = "10px";
        tarjeta.style.padding = "15px";
        tarjeta.style.borderLeft = "5px solid " + getColor(reporte.categoria);

        tarjeta.innerHTML = `
            <h3 style="color: white; margin-bottom: 5px;">${reporte.categoria}</h3>
            <p style="color: #ccc; font-size: 0.9em; margin-bottom: 10px;">${reporte.texto}</p>
            <small style="color: #888;">${reporte.fecha.toDate().toLocaleString()}</small>
        `;

        listaReportes.appendChild(tarjeta);
    });
});

// Función auxiliar para poner colores por categoría
function getColor(categoria) {
    switch (categoria) {
        case 'Seguridad': return '#ef4444'; // Rojo
        case 'Salud': return '#22c55e';    // Verde
        case 'Equidad de Género': return '#a855f7'; // Morado
        default: return '#6366f1';
    }
}