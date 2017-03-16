var flicker = {
    flickerStop: false,
    /*unicode : '!\'#$%'()*+,-./0123456789:;?@`aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ{[|\}]~^_',*/
    unicode: '0123456789:;?@`aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ',
    getRandomInt: function (min, max) {
        // console.log(min + ' ' + max);
        // console.log('weee');
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomCharacter: function () {
        return this.unicode[Math.floor(Math.random() * this.unicode.length)];
    },
    replaceAt: function (text, character, index) {
        return text.substr(0, index) + character + text.substr(index + character.length);
    },
    init: function (element, min, max, delay) {
        var elements = document.querySelectorAll(element);
        for (let i = 0; i < elements.length; i++) {
            var el = elements[i];

            var str = el.innerText.trim(),
                bank = [],
                newStr = '';

            for (let j = 0; j < str.length; j++) {
                bank[j] = this.getRandomInt(min, max);
            }

            this.mix(el, str, newStr, bank, delay);
        }

    },
    mix: function (el, str, newStr, bank, delay) {
        var i = 0;
        var storeArr = [];
        while (str !== newStr) {
            if (str[i] !== newStr[i]) {
                if (bank[i] !== 0) {
                    if (str[i] !== ' ') {
                        newStr = this.replaceAt(newStr, this.randomCharacter(), i);
                    }
                    else {
                        newStr = this.replaceAt(newStr, ' ', i);
                    }
                    bank[i]--;
                } else {
                    newStr = this.replaceAt(newStr, str[i], i);
                }

                storeArr.push(newStr);
            }
            else {
                i++;
            }

            if (str === newStr) {
                this.flickerStop = true;
                this.finalResult(storeArr, el, delay);
                break;
            }
        }
    },
    finalResult: function (storeArr, el, delay) {
        var n = 0;
        var time = setInterval(() => {
            el.innerText = storeArr[n];
            n++;

            if (n === storeArr.length) {
                clearInterval(time);
            }
        }, delay);
    }
};

// 破碎字體特效
flicker.init('.flicker', 1, 10, 7);
