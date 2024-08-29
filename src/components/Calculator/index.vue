<template>
    <div class="calculator">
        <button @click="changeModeEvent" class="toggle-button">
            <p v-if="changeMode">Show Advanced Mode &nbsp; &nbsp; &#9864;</p>
            <p v-else>Show Basic Mode &nbsp; &nbsp; &#9862;</p>
        </button>
        <div class="results">
            <input class="input" v-model="current" />
        </div>
        <div class="mode" v-if="changeMode">
            <button class="button" @click="press">7</button>
            <button class="button" @click="press">8</button>
            <button class="button" @click="press">9</button>
            <button class="button" @click="press">*</button>
            <button class="button" @click="press">&#60;=</button>
            <button class="button" @click="press">C</button>
            <button class="button" @click="press">4</button>
            <button class="button" @click="press($event)">5</button>
            <button class="button" @click="press">6</button>
            <button class="button" @click="press">/</button>
            <button class="button" @click="press">(</button>
            <button class="button" @click="press">)</button>
            <button class="button" @click="press">1</button>
            <button class="button" @click="press">2</button>
            <button class="button" @click="press">3</button>
            <button class="button" @click="press">-</button>
            <button class="button" @click="press">x ²</button>
            <button class="button" @click="press">±</button>
            <button class="button" @click="press">0</button>
            <button class="button" @click="press">.</button>
            <button class="button" @click="press">%</button>
            <button class="button" @click="press">+</button>
            <button class="button equal-sign" @click="press">=</button>
        </div>
        <div class="mode" v-else>
            <button class="button" @click="press">sin</button>
            <button class="button" @click="press">cos</button>
            <button class="button" @click="press">tan</button>
            <button class="button" @click="press">x^</button>
            <button class="button" @click="press">&#60;=</button>
            <button class="button" @click="press">C</button>
            <button class="button" @click="press">log</button>
            <button class="button" @click="press">ln</button>
            <button class="button" @click="press">e</button>
            <button class="button" @click="press">∘</button>
            <button class="button" @click="press">rad</button>
            <button class="button" @click="press">√</button>
            <button class="button" @click="press">7</button>
            <button class="button" @click="press">8 </button>
            <button class="button" @click="press">9</button>
            <button class="button" @click="press">/</button>
            <button class="button" @click="press">x ²</button>
            <button class="button" @click="press">x !</button>
            <button class="button" @click="press">4</button>
            <button class="button" @click="press">5</button>
            <button class="button" @click="press">6</button>
            <button class="button" @click="press">*</button>
            <button class="button" @click="press">(</button>
            <button class="button" @click="press">)</button>
            <button class="button" @click="press">1</button>
            <button class="button" @click="press">2</button>
            <button class="button" @click="press">3</button>
            <button class="button" @click="press">-</button>
            <button class="button" @click="press">%</button>
            <button class="button" @click="press">±</button>
            <button class="button" @click="press">0</button>
            <button class="button" @click="press">.</button>
            <button class="button" @click="press">&#x003C0;</button>
            <button class="button" @click="press">+</button>
            <button class="button equal-sign" @click="press">=</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const current = ref('')
const press = (e) => {
    //输入框的值
    let key = e.target.textContent
    if (key != '=' && key != 'C' && key != '*' && key != '/' && key != '√' && key != "x ²" && key != "%" && key != "<=" && key != "±" && key != "sin" && key != "cos" && key != "tan" && key != "log" && key != "ln" && key != "x^" && key != "x !" && key != "π" && key != "e" && key != "rad" && key != "∘") {
        current.value += key
    } else if (key === '=') {
        if (current.value.indexOf('^') > -1) {

            let base = current.value.slice(0, current.value.indexOf('^'));
            let exponent = current.value.slice(current.value.indexOf('^') + 1);
            current.value = eval('Math.pow(' + base + ',' + exponent + ')');
        } else {
            current.value = eval(current.value);
        }
    } else if (key === 'C') {
        current.value = '';
    } else if (key === '*') {

        current.value += '*';
    } else if (key === '/') {

        current.value += '/';
    } else if (key === '+') {

        current.value += '+';

    } else if (key === '-') {

        current.value += '-';
    } else if (key === '±') {

        if (current.value.charAt(0) === '-') {
            current.value = current.value.slice(1);
        } else {
            current.value = '-' + current.value;
        }
    } else if (key === '<=') {
        current.value = current.value.substring(0, current.value.length - 1);
    } else if (key === '%') {

        current.value = current.value / 100;
    } else if (key === 'π') {

        current.value = current.value * Math.PI;
    } else if (key === 'x ²') {

        current.value = eval(current.value * current.value);
    } else if (key === '√') {

        current.value = Math.sqrt(current.value);
    } else if (key === 'sin') {

        current.value = Math.sin(current.value);
    } else if (key === 'cos') {

        current.value = Math.cos(current.value);
    } else if (key === 'tan') {

        current.value = Math.tan(current.value);
    } else if (key === 'log') {

        current.value = Math.log10(current.value);
    } else if (key === 'ln') {

        current.value = Math.log(current.value);
    } else if (key === 'x^') {

        current.value += '^';
    } else if (key === 'x !') {

        let number = 1;
        if (current.value === 0) {
            current.value = '1';
        } else if (current.value < 0) {
            current.value = NaN;
        } else {
            let _number = 1;
            for (let i = current.value; i > 0; i--) {
                _number *= i;
            }
            current.value = _number;
        }
    } else if (key === 'e') {
        current.value = Math.exp(current.value);
    } else if (key === 'rad') {

        current.value = current.value * (Math.PI / 180);
    } else if (key === '∘') {

        current.value = current.value * (180 / Math.PI);
    }
}

const changeMode = ref(false)
const changeModeEvent = () => {
    changeMode.value = !changeMode.value;
}
</script>

<style lang="scss" scoped>
.calculator {
    width: 460px;
    padding: 20px;
    border-radius: 5px;
    margin: 20px auto;
    font-size: 16px;
    background-color: hsl(0, 0%, 20%);
  }

  .input {
    width: 420px;   
    height: 50px;
    border-radius: 0px;
    border: 1px solid hsl(0, 0%, 0%);
    background-color: #333333;
    color: #d9d9d9;
    padding: 0 5px 0 5px;
    margin: 0 0px 10px 0px;
    font-size: 30px;
  }

  .input:focus,
  .input:active {
    border-color: #03a9f4;
    box-shadow: 0 0 4px #03A9F4;
    outline: none 0;
  }

  .button {
    margin: 3px;
    width: 63px;
    border: 1px solid hsl(0, 0%, 5%);
    height: 30px;
    border-radius: 4px;
    color: hsl(0, 0%, 85%);
    background-color: hsl(0, 0%, 10%);
    cursor: pointer;
    outline: none;
  }

  .mode {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .equal-sign {
    background-color: hsl(207, 80%, 65%);
    width: 133px;
  }

  .toggle-button {
    border: none;
    background-color: hsl(0, 0%, 20%);
    cursor: pointer;
    outline: none;
    font-size: 1rem;
    color: #fff;
    text-shadow: -1px -1px 0 rgba(0, 0, 0, .35)
  }

  p {
    margin-top: 0;
  }

  button::-moz-focus-inner {
    border-color: transparent;
  }
</style>