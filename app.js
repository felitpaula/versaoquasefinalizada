const QUANTIDADE_DE_NOTICIAS_CARREGADAS_POR_VEZ = 8;

class Noticia {
    constructor(titulo, categoria, autor, data) {
        this._titulo = titulo;
        this._categoria = categoria;
        this._autor = autor;
        this._data = data;
    }

    get id() {
        return this._id;
    }
    get titulo() {
        return this._titulo;
    }
    get categoria() {
        return this._categoria;
    }
    get autor() {
        return this._autor;
    }
    get data() {
        return this._data;
    }

    set id(id) {
        this._id = id;
    }
    set titulo(titulo) {
        this._titulo = titulo;
    }
    set categoria(categoria) {
        this._categoria = categoria;
    }
    set autor(autor) {
        this._autor = autor;
    }
    set data(data) {
        this._data = data;
    }
}

class Bd {
    constructor() {
        this._noticias = [];
        this.carregarDoLocalStorage();
    }

    get noticias() {
        return this._noticias;
    }

    getProximoId() {
        const ultimaNoticia = this._noticias[this._noticias.length - 1];

        if (ultimaNoticia === undefined) {
            return 1;
        }

        return parseInt(ultimaNoticia.id)+ 1;
    }

    adicionarNoticia(noticia) {
        noticia.id = this.getProximoId();
        this._noticias.push(noticia);
        this.salvarNoLocalStorage();
    }

    removerNoticia(id) {
        for (let i = 0; i < this._noticias.length; i++) {
            if (this._noticias[i].id === id) {
                this._noticias.splice(i, 1);
                this.salvarNoLocalStorage();
                return;
            }
        }
    }

    filtrarNoticiaPorCategoria(categoria, noticias) {
        let noticiasFiltradas = [...noticias];
        if (categoria !== '') {
                noticiasFiltradas = noticias.filter(noticia => noticia.categoria === categoria);
        }

        return noticiasFiltradas;
    }

    filtrarNoticiaPorTitulo(titulo, noticias) {
        let noticiasFiltradas = [...noticias];
        if (titulo !== '') {
                noticiasFiltradas = noticias.filter(noticia => noticia.titulo.includes(titulo));
        }

        return noticiasFiltradas;
    }

    salvarNoLocalStorage() {
        localStorage.setItem('noticias', JSON.stringify(this._noticias));
    }

    carregarDoLocalStorage() {
        const noticiasNoLocalStorage = JSON.parse(localStorage.getItem('noticias') ?? '[]');
        this._noticias = [];
        noticiasNoLocalStorage.forEach((noticiaCarregadaDoLocalStorage) => {
            const noticia = new Noticia(noticiaCarregadaDoLocalStorage._titulo, noticiaCarregadaDoLocalStorage._categoria, noticiaCarregadaDoLocalStorage._autor, noticiaCarregadaDoLocalStorage._data);
            noticia.id = noticiaCarregadaDoLocalStorage._id;
            this._noticias.push(noticia);
        });
    }
}

const bd = new Bd();
let proximaNoticia = 0;

function carregarListaNoticias() {
    const categoriaSelecionada = document.querySelector(
        'input[name="categoria"]:checked'
    ).value;

    let noticias = bd.noticias;
    noticias = bd.filtrarNoticiaPorCategoria(categoriaSelecionada, noticias);
    
    const tituloDigitado = document.getElementById("buscaPorTitulo").value;
    noticias = bd.filtrarNoticiaPorTitulo(tituloDigitado, noticias);

    const proximasNoticias = noticias.slice(proximaNoticia, proximaNoticia + QUANTIDADE_DE_NOTICIAS_CARREGADAS_POR_VEZ);

    proximasNoticias.forEach(function(noticia) {
        criarCardNoticia(noticia);
    });

    const buttonCarregarMais =  document.getElementById("buttonCarregarMais");

    proximaNoticia += QUANTIDADE_DE_NOTICIAS_CARREGADAS_POR_VEZ;
    
    if (proximaNoticia >= noticias.length) {
        buttonCarregarMais.style.display = "none";
    } else {
        buttonCarregarMais.style.display = "block";
    }
}

function criarCardNoticia(noticia) {
    const listaNoticias = document.getElementById("listaNoticias");

    const card = document.createElement("div");
    card.classList.add("card-noticia");

    const titulo = document.createElement("h3");
    titulo.textContent = noticia.titulo;

    const categoria = document.createElement("p");
    categoria.textContent = noticia.categoria;

    const autor = document.createElement("p");
    autor.textContent = noticia.autor;

    const data = document.createElement("p");
    data.textContent = noticia.data;

    card.append(
        titulo,
        categoria,
        autor,
        data
    );

    listaNoticias.appendChild(card);
}

function filtrarNoticia() {
    proximaNoticia = 0;

    const listaNoticias =
        document.getElementById("listaNoticias");

    listaNoticias.replaceChildren();

    carregarListaNoticias();
}

function criarEventListeners() {
    const categorias = document.querySelectorAll(
        'input[name="categoria"]'
    );

    categorias.forEach((categoria) => {
        categoria.addEventListener('change', filtrarNoticia);
    });

    const buttonCarregarMais =
        document.getElementById('buttonCarregarMais');

        buttonCarregarMais.addEventListener(
        'click', carregarListaNoticias
    );

    const buscaPorTitulo =
        document.getElementById('buscaPorTitulo');

    buscaPorTitulo.addEventListener(
        'input', filtrarNoticia
    );

    const buttonAssinar =
    document.getElementById("buttonAssinar");

    buttonAssinar.addEventListener(
        "click",
        assinarNewsletter
    );
}

function atualizarRelogio() {
    const agora = new Date();

    const relogio = document.getElementById("relogio");

    relogio.textContent = agora.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
    criarEventListeners();
    carregarListaNoticias();
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);
    
});

function assinarNewsletter() {
    const inputEmail =
        document.getElementById("emailNewsletter");

    if (inputEmail.checkValidity()) {
        console.log("E-mail válido");
    } else {
        console.log("E-mail inválido");
    }
}