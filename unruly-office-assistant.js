export default class UnrulyOfficeAssistant extends HTMLElement {
    
    static get styles() {
        return `
        <style>
            button {
                position: absolute;
                bottom: 10px;
                left: 10px;
                display: flex;
                font-family: sans-serif;
                font-weight: 500;
                font-size: 24px;
            	cursor: pointer;
                color:#ffffff;
                border: none;
                border-radius:12px;
                height: 50px;
                justify-content: space-around;
                align-items: center;
            }
            
            .bubble-container {
                position: absolute;
                bottom: 75px;
                left: 25px;

            }

            .bubble {
                position: relative;
                font-family: sans-serif;
                font-size: 18px;
                line-height: 24px;
                width: 100px;
                background: white;
                border-left: 2px solid rgb(0, 0, 0);
                border-right: 2px solid rgb(0, 0, 0);
                border-top: 2px solid rgb(0, 0, 0);
                border-bottom: 2px solid rgb(0, 0, 0);
                border-radius: 40px;
                padding: 24px;
                text-align: center;
                color: black;
            }
          
            .bubble-bottom-left:before {
              content: "";
              width: 0px;
              height: 0px;
              position: absolute;
              border-left: 24px solid white;
              border-right: 12px solid transparent;
              border-top: 12px solid white;
              border-bottom: 20px solid transparent;
              left: 32px;
              bottom: -24px;
            }
            </style>
        `;
    }
  
    static get markup() { 
        return `
            <button id="button-container">
                <div id="icon">📎</div>
            </button>
            <div class="bubble-container">
                <div class="bubble bubble-bottom-left" id="bubble-text" hidden>
                    Test
                </div>
            </div>
        `;
    }
 
    static get observedAttributes() { 
        return [];
    }

    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = this.constructor.styles + this.constructor.markup;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.screenYhalf = window.innerHeight / 2;
        this.screenXhalf = window.innerWidth / 2;
        this.initializeElements();
    }
  
    connectedCallback() {
        this.addEventListeners();
    }
    
    disconnectedCallback() {
        this.removeEventListeners();
    }
    
    initializeElements() {
        this.icon = this.shadowRoot.querySelector('#icon');
        this.bubble = this.shadowRoot.querySelector('#bubble-text');
    }
  
    addEventListeners() {
        this.clickedCallback = this.mouseClicked.bind(this);
        this.movedCallback = this.mouseMoved.bind(this);
        window.addEventListener('click', this.clickedCallback);
        window.addEventListener('mousemove', this.movedCallback);
    }
    
    removeEventListeners() {
        window.removeEventListener('click', this.clickedCallback);
        window.removeEventListener('mousemove', this.movedCallback);
    }

    mouseMoved(event) {
        let x = Math.abs(event.screenX);
        let y = Math.abs(event.screenY);
        if(!this.pauseEvents) {
            if (y > this.screenYhalf && x > this.screenXhalf) {
                //lower left
                this.bubble.innerHTML = "I dont think you want to be in the lower left div, how about you go to the upper right?";
                this.bubble.hidden = false;

            } else if(y > this.screenYhalf && x < this.screenXhalf) {
                //lower right
                this.bubble.innerHTML = "Ive never told you to come here.. Go to the lower left";
                this.bubble.hidden = false;

            } else if(y < this.screenYhalf && x < this.screenXhalf) {
                //upper right
                this.bubble.innerHTML = "Why would you go to the upper right div, when I clearly said to go to upper left?";
                this.bubble.hidden = false;

            } else {
                //upper left
                this.bubble.innerHTML = "Hi! Based on your previous actions I dont think you actually want to be in the upper left div, how about you go to the lower left?";
                this.bubble.hidden = false;
            }
        }
    }
    
    mouseClicked(event) {
        let x = Math.abs(event.screenX);
        let y = Math.abs(event.screenY);
        let target = event.target.id;
        if (this.previousTarget == target && target != "a Helpful Assistant" && !this.pauseEvents) {
            this.bubble.innerHTML = "Fine, I guess we can change something here... One second";
            window.setTimeout(() => {
                document.getElementById(target).style.backgroundColor = Math.floor(Math.random()*16777215).toString(16);
            }, 1000)
        } else if(target == "a Helpful Assistant") { 
            if (this.previousTarget == target) {
                this.bubble.innerHTML = "I said stop!"
                window.setTimeout(() => {
                    this.bubble.innerHTML = "You know what? You are really annoying me. Im going to step away for a moment."
                    this.pauseEvents = true;
                    window.setTimeout(()=>{this.bubble.hidden = true},1500)
                    window.setTimeout(()=>{this.pauseEvents = false},8000);
                }, 1000)
                return;
            } else {
                this.bubble.innerHTML = "Hey stop that!!";
            }
        } else {
            this.bubble.innerHTML = "Why are you clicking at (" + x +","+y+")? There is clearly nothing there besides " + target;
        }

        this.previousTarget = target;
        this.pauseEvents = true;
        window.setTimeout(()=>{this.pauseEvents = false}, 3000);
    }
}

customElements.define('unruly-office-assistant', UnrulyOfficeAssistant);
