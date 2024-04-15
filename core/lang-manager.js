
export class LangManager {

    words = [];
    category = "";

    load() {
        this.sendLangRequest("pl");
    }

    sendLangRequest(source) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load", () => {
            if(xhr.status == 200) {
                this.loadLangDocument(JSON.parse(xhr.response));
            }
        });
        xhr.open("GET", "./core/lang/" + source + ".json");
        xhr.send();
    }

    loadLangDocument(json) {
        let elements = document.querySelectorAll("lang");
        for(let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.innerHTML = json[element.getAttribute("ref")];
        }
        let index = parseInt(Math.random() * json["packages"].length);
        this.words = json["packages"][index]["words"];
        this.category = json["packages"][index]["name"];
    }

    getWords() {    
        return this.words;
    }

    getCategory() {
        return this.category;
    }

}