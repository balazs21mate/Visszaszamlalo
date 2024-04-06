class VISSZASZAMLALO {
    constructor() {
        this.oraKiir = null;
        this.percKiir = null;
        this.masodpercKiir = null;
        this.red = null;
        this.green = null;
        this.blue = null;
        this.szamlaloEngedelyezese = true;
        this.interval = null;
        this.idoMasodpercben = null;
        this.aktualisSzazalek = null;
    }


    ProgressBarWidthSzamitas() {
        this.idoMasodpercben = this.oraKiir * 3600 + this.percKiir * 60 + this.masodpercKiir;
    }


    Beolvasas() {
        let ora = Number(document.querySelector("#ora").value);
        let perc = Number(document.querySelector("#perc").value);
        let masodperc = Number(document.querySelector("#masodperc").value);

        return { "ora": ora, "perc": perc, "masodperc": masodperc };
    }


    //Képernyő tartalmáért felelős metódusok
    BeallitasKapcsolo(allapot) {
        let beallitas = document.querySelector("#beallitas");

        if (allapot) {
            beallitas.classList.remove("d-flex");
            beallitas.classList.add("d-none");
        } else {
            beallitas.classList.add("d-flex");
            beallitas.classList.remove("d-none");
        }
    }


    VisszaszamlaloKapcsolo(allapot) {
        let visszaszamlalo = document.querySelector("#visszaszamlalo");

        if (allapot) {
            visszaszamlalo.classList.remove("d-none");
            visszaszamlalo.classList.add("d-flex");
        } else {
            visszaszamlalo.classList.add("d-none");
            visszaszamlalo.classList.remove("d-flex");
        }
    }


    //Validálás beállítása
    HibaUzenetKapcsolo(allapot) {
        if (allapot) {
            document.querySelector("#hiba").classList.remove("d-none");
            document.querySelector("#hiba").classList.add("d-block");
        } else {
            document.querySelector("#hiba").classList.add("d-none");
            document.querySelector("#hiba").classList.remove("d-block");
        }
    }


    OraValidalas() {
        if (24 > this.oraKiir && this.oraKiir >= 0) {
            return true;
        }
    }


    PercValidalas() {
        if (60 > this.percKiir && this.percKiir >= 0) {
            return true;
        }
    }


    MasodPercValidalas() {
        if (60 > this.masodpercKiir && this.masodpercKiir >= 0) {
            return true;
        }
    }


    IdoValidalas() {
        if (this.OraValidalas() && this.PercValidalas() && this.MasodPercValidalas()) {
            return true;
        } else {
            this.HibaUzenetKapcsolo(true);
        }
    }


    //Visszaszámláló metódusok
    InditasiFeltetelVizsgalasa() {
        if (this.oraKiir != 0 || this.percKiir != 0 || this.masodpercKiir != 0) {
            return true;
        }
    }


    SzinekManipulalasa() {
        if (this.red < 0) {
            this.red = 256;
        }

        if (this.green < 0) {
            this.green = 256;
        }

        if (this.blue < 0) {
            this.blue = 256;
        }

        this.red -= 5;
        this.green -= 3;
        this.blue -= 1;
    }


    IdoManipulalasa() {
        this.masodpercKiir--;

        //Ha a másodperc kisebb mint 0, a perc csökkentése 1-gyel
        if (this.masodpercKiir < 0) {
            this.percKiir--;
        }


        if (this.percKiir < 0) {
            //Ha a perc kisebb mint 0 és az óra egyenlő 0-val, akkor a percet is egyenlővé tesszük 0-val
            if (this.oraKiir == 0) {
                this.percKiir = 0;
            }
            //Ha a perc kisebb mint 0 és az óra nem egyenlő 0-val, akkor a percet egyenlővé tesszük 59-cel
            else {
                this.percKiir = 59;
            }
        }


        //Ha a perc egyenlő 59-cel a másodperc pedig kisebb mint 0 és az óra nem egyenlő 0-val csökkentjük az órát 1-gyel
        if (this.percKiir === 59 && this.masodpercKiir < 0 && this.oraKiir != 0) {
            this.oraKiir--;
        }


        //Ha a másodperc kisebb mint 0, akkor a másodpercet egyenlővé tesszük 59-cel
        if (this.masodpercKiir < 0) {
            this.masodpercKiir = 59;
        }
    }


    VisszaSzamlalasLeallitasa() {
        // Ha minden lenullázódik kilépünk
        if (this.oraKiir == 0 && this.percKiir == 0 && this.masodpercKiir == 0) {
            clearInterval(this.interval);
        }

        // Ha a szamlaloEngedelyezese hamis értéket kap kilépünk
        if (!this.szamlaloEngedelyezese) {
            clearInterval(this.interval);
            this.HatterSzinBeallitas("white");
        }
    }


    //ProgressBar manipulálás
    ProgressBarHatterManipulalas(progressBar) {
        if (this.aktualisSzazalek < 50) {
            progressBar.style.backgroundColor = "yellow";
        }

        if (this.aktualisSzazalek < 20) {
            progressBar.style.backgroundColor = "red";
        }
    }


    ProgressBarManipulalas() {
        let progressBar = document.querySelector("#progress");
        let egySzazalekIdo = this.idoMasodpercben / 100;
        let elteltIdo = this.oraKiir * 3600 + this.percKiir * 60 + this.masodpercKiir;
        this.aktualisSzazalek = Math.floor(elteltIdo / egySzazalekIdo);

        this.ProgressBarHatterManipulalas(progressBar);

        progressBar.style.width = `${this.aktualisSzazalek}%`;
    }


    Szamlalo() {

        this.HatterSzinBeallitas(this.HatterSzinGeneralas());

        this.SzinekManipulalasa();

        this.IdoManipulalasa();

        this.IdoKiiratas();

        this.ProgressBarManipulalas();

        this.VisszaSzamlalasLeallitasa();

    }


    //Visszaszámlálás elindítása
    Visszaszamlalas() {
        this.szamlaloEngedelyezese = true;
        if (this.InditasiFeltetelVizsgalasa()) {
            this.interval = setInterval(() => {
                this.Szamlalo();
            }, 1000);
        }
    }


    //Kiíratások
    IdoKiiratas() {
        let ora = document.querySelector("#kezdo_ora");
        let perc = document.querySelector("#kezdo_perc");
        let masodperc = document.querySelector("#kezdo_masodperc");

        ora.innerHTML = this.oraKiir < 10 ? "0" + this.oraKiir : this.oraKiir;
        perc.innerHTML = this.percKiir < 10 ? "0" + this.percKiir : this.percKiir;
        masodperc.innerHTML = this.masodpercKiir < 10 ? "0" + this.masodpercKiir : this.masodpercKiir;
    }


    UzenetKiiras() {
        let uzenet = document.querySelector("#uzenet").value;
        let uzenetKiir = document.querySelector("#uzenet_kiir");

        uzenetKiir.innerHTML = uzenet;
    }


    //Szinezés beállítása
    SzinGeneralas() {
        this.red = this.oraKiir < 10 ? "20" + this.oraKiir : "2" + this.oraKiir;
        this.green = this.percKiir < 10 ? "20" + this.percKiir : "2" + this.percKiir;
        this.blue = this.masodpercKiir < 10 ? "20" + this.masodpercKiir : "2" + this.masodpercKiir;
    }


    HatterSzinGeneralas() {
        return `rgb(${this.red},${this.green},${this.blue})`;
    }


    HatterSzinBeallitas(szin) {
        let body = document.querySelector("#uzenet_box");
        body.style.backgroundColor = szin;
    }




    //Alkalmazás elindítása
    Indit() {
        const beolvasasEredmenye = this.Beolvasas();
        this.oraKiir = beolvasasEredmenye.ora;
        this.percKiir = beolvasasEredmenye.perc;
        this.masodpercKiir = beolvasasEredmenye.masodperc;

        if (this.IdoValidalas()) {
            this.BeallitasKapcsolo(true);
            this.VisszaszamlaloKapcsolo(true);
            this.ProgressBarWidthSzamitas();
            this.Visszaszamlalas();
            this.SzinGeneralas();
            this.UzenetKiiras();
            this.HatterSzinBeallitas(this.HatterSzinGeneralas());
            this.IdoKiiratas();
        }
    }



    //Alaphelyzetbe állítások
    BeallitasAlaphelyzet() {
        document.querySelector("#ora").value = 0;
        document.querySelector("#perc").value = 0;
        document.querySelector("#masodperc").value = 0;
    }


    UzenetAlaphelyzet() {
        let uzenet = document.querySelector("#uzenet");

        uzenet.value = "";
    }


    ProgressBarWidthAlaphelyzet() {
        let progressBar = document.querySelector("#progress");
        progressBar.style.backgroundColor = "green";
        this.idoMasodpercben = null;
        this.aktualisSzazalek = null;
    }


    //Alkalmazás leállítása
    Befejez() {
        this.szamlaloEngedelyezese = false;
        this.BeallitasKapcsolo();
        this.VisszaszamlaloKapcsolo();
        this.BeallitasAlaphelyzet();
        this.UzenetAlaphelyzet();
        this.HibaUzenetKapcsolo();
        this.ProgressBarWidthAlaphelyzet();
        this.ProgressBarManipulalas();
    }
}

let visszaszamlalo = new VISSZASZAMLALO();

let inditoGomb = document.querySelector("#indit");
inditoGomb.addEventListener("click", function () {
    visszaszamlalo.Indit();
});


let befejezoGomb = document.querySelector("#befejez");
befejezoGomb.addEventListener("click", function () {
    visszaszamlalo.Befejez();
});