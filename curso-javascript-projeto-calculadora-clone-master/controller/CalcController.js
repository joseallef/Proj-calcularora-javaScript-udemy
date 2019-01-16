class CalcController {

	constructor(){

		this._audio = new Audio('click.mp3');
		this._audioOnOff = false;
		this._lastOperator = '';
		this._lastNumber = '';
		this._operation = [];
		this._locale = 'pt-BR';
		this._displayCalcEl = document.querySelector("#display");
		this._dateEl = document.querySelector("#data");
		this._timeEl = document.querySelector("#hora");
		this._currentDate;
		this.initialize();
		this.initButtonsEvents();
		this.initKeyBoard();


	}
	copyToClickboard(){
		let input = document.createElement('input');

		input.value = this.displayCalc;

		document.body.appendChild(input);

		input.select();

		document.execCommand("Copy");

		input.remove();
	}

	pasteFromClipboard(){

		document.addEventListener('paste', e=>{

			let text = e.clipboardData.getData('Text');

			this.displayCalc = parseFloat(text);
			console.log(text);
		});
	}
	// Inicializa o display 
	initialize(){
		// Chamando o metodo para não replicar o mesmo codigó
		this.setdisplayTime();
		// Arrow Function
		// Novo recurso para criação de funções
		let interval = setInterval(()=>{
			this.setdisplayTime();
			// this.displayDate = this.currentDate.toLocaleDateString(this.locale);
			// this.displayTime = this.currentDate.toLocaleTimeString(this.locale);

		}, 1000);
		// O método inicia o display da calculadora com 0!
		this.setLastNumberToDisplay();
		// Método para colar no displaya
		this.pasteFromClipboard();

		document.querySelectorAll('.btn-ac').forEach(btn=>{

			btn.addEventListener('dblclick', e=>{
				this.toggleAudio();
			});

		});

		// Arrow Function
		// Para a execução após um tempo
		// setTimeout(()=>{
		// 	clearInterval(interval);
		// }, 5000);
		// this._displayCalcEl.innerHTML = "123";
	}

	toggleAudio(){

		// Condição que recebe o inverso dele mesmo;
		this._audioOnOff = !this._audioOnOff;

		// If ternadio 
		// this._audioOnOff = (this._audioOnOff) ? false : true;

		// if(this._audioOnOff){
		// 	this._audioOnOff = false;
		// }else{
		// 	this._audioOnOff = true;
		// }
	}

	playAudio(){

		if(this._audioOnOff){
			this._audio.currentTime = 0;
			this._audio.play();
		}

	}

	// Método captura as teclas superior do teclado
	initKeyBoard(){

		document.addEventListener('keyup', e=>{
			console.log(e.key);

			this.playAudio();

			switch(e.key){

			case 'Escape':
				setTimeout(()=>{
					this.toggleAudio();
				}, 0);
				
				this.clearAll();
			break;
			case 'Backspace':
				this.clearEntry();
			break;

				case '+':
				case '-':
				case '*':
				case '%':
				case '/':
					this.addOperation(e.key);
					break;
	
			case 'Enter':
			case '=':
					this.calc();
				break;

			case '.':
			case ',':
					this.addDot();
				break;

				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':

				this.addOperation(parseInt(e.key));
				break;

				case 'c':
					if(e.ctrlKey)this.copyToClickboard();
					break;

			}

		});

	}

	addEventListenerAll(element, events, fn){
		events.split(' ').forEach(event =>{
			element.addEventListener(event, fn, false);
		});
	}

	//Limpa tudo
	clearAll(){
		
		this._operation = [];

			this.playAudio();
			this._lastNumber = '';
			this._lastOperator = '';
			this.setLastNumberToDisplay();
		
	}
	// Limpa a utima óperação
	clearEntry(){
		// Metodo pop retira a útima posição de um elemente no array
		this._operation.pop();

		this.setLastNumberToDisplay();
	}

	getLastOperation(){

		return this._operation[this._operation.length-1];

	}

	setLastOperation(value){
		this._operation[this._operation.length - 1] = value;
	}

	isOperator(value){

		return (['+', '-', '*', '%', '/'].indexOf(value) > -1);		
		// Economia de linhas!
		// if(['+', '-', '*', '%', '/'].indexOf(value) > -1){
		// 	return true;
		// }else{
		// 	return false;
		// }
	}

	pushOperation(value){
		this._operation.push(value);

		if(this._operation.length > 3){

			// Chamando o metodo!
			this.calc();
			// let last = this._operation.pop();
			//console.log(this._operation);
		}

	}
	// Obtém o resultado!
	getResult(){

		try{

			return eval(this._operation.join(""));

		}catch(e){
			// Chama o error após 500 MIL/SEG se aver mais de casas deciamis no display
			setTimeout(()=>{
				this.setError();
			}, 500);
		}

	}
	// Calcula o resutado ao precionar = ou a tecla enter
	calc(){
		let last = '';

		this._lastOperator = this.getLastItem();

		if(this._operation.length < 3){

			let fastItem = this._operation[0];
			// Obtém os resultados fastItem 1º _lastOperator 2º _lastNumber 3º!

			this._operation = [fastItem, this._lastOperator, this._lastNumber];

		}

		if(this._operation.length > 3){
			last = this._operation.pop();
			// Por padrão o método getLastItem pega true		
			this._lastNumber = this.getResult();

		}
		if(this._operation.length == 3){
			// Por padrão o método getLastItem pega true
			this._lastNumber = this.getLastItem(false);

		}
		// console.log('_lastOperator',this._lastOperator);
		// console.log('_lastNumber',this._lastNumber);

		let result = this.getResult();
		if(last == '%'){

			result /= 100;
			this._operation = [result];

		}else{

			this._operation = [result];
			if(last) this._operation.push(last);
		}
		this.setLastNumberToDisplay();

	}
	getLastItem(isOperator = true){
		let lastItem;

		for(let i = this._operation.length - 1; i >= 0; i--){

			if(isOperator){

				if(this.isOperator(this._operation[i])){
					lastItem = this._operation[i];
					break;
				}
				
			}else{
				if(!this.isOperator(this._operation[i])){
					lastItem = this._operation[i];
					break;
				}

			}
		}

		if(!lastItem){

			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

		}

		return lastItem;

	}

	setLastNumberToDisplay(){
		let lastNumber = this.getLastItem(false);
		if(!lastNumber) lastNumber = 0;		
		this.displayCalc = lastNumber;
	}

	addOperation(value){

		 //console.log('A', value, isNaN(this.getLastOperation()));
		 // isNaN se não e um número
		if(isNaN(this.getLastOperation())){
			// String 
			if(this.isOperator(value)){
				// Troca o operador digitado
				this.setLastOperation(value);

			}else{
				this.pushOperation(value);

				this.setLastNumberToDisplay();
			}
		}else{
			if(this.isOperator(value)){
				// Metodo push adiciona um elemente no array
				this.pushOperation(value);

				// Metodo pop retira a útima posição de um elemente no array

			}else{
				// Number
			let NewValue = this.getLastOperation().toString() + value.toString();

			this.setLastOperation(NewValue);

			// Reflesh / Updat display
			this.setLastNumberToDisplay();

			}

		}
		//this._operation.push(value);

		 // console.log(this._operation);
	}

	setError(){
		this.displayCalc = "Error";
	}

	addDot(){

		let lastOperation = this.getLastOperation();

		// Verifica se o lastOperation e uma String, e se nessa String tem um ponto 
		if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

		if(this.isOperator(lastOperation) || !lastOperation){
			this.pushOperation('0.');
		}else{
			this.setLastOperation(lastOperation.toString() + '.');
		}
			this.setLastNumberToDisplay();
	}

	execBtn(value){

		this.playAudio();
		switch(value){
			case 'ac':
				this.clearAll();
			break;
			case 'ce':
				this.clearEntry();
			break;
			case 'soma':
					this.addOperation('+');
				break;

			case 'subtracao':
					this.addOperation('-');
				break;

			case 'divisao':
					this.addOperation('/');
				break;
			case 'multiplicacao':
					this.addOperation('*');
				break;

			case 'porcento':
					this.addOperation('%');
				break;

			case 'igual':
					this.calc();
				break;

			case 'ponto':
					this.addDot();
				break;
				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':

				this.addOperation(parseInt(value));
				break;

			default:
				this.setError();
				break;
		}

	}

	initButtonsEvents(){
		let buttons = document.querySelectorAll("#buttons > g, #parts > g");

		// buttons.addEventListener('click', e=>{

		// 	console.log(e);
		// });

		buttons.forEach((btn, index) => {

			this.addEventListenerAll(btn, 'click drag', e =>{
				// Metodo replace limpa/substitua o nome do botão NESSE CASO!
				let textBtn = btn.className.baseVal.replace("btn-", "");

				 this.execBtn(textBtn);
				// console.log(btn.className.baseVal.replace("btn-", ""));
			});

			this.addEventListenerAll(btn, "mouseup mousedown mouseover", e => {
				btn.style.cursor = "pointer";
			})

		});
	}

	setdisplayTime(){
		// Pesonalizando a data após this.locale {day, month, and year} més long nome completo e short abreviado
		this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
			day: "2-digit",
			month: "long",
			year: "numeric"
		});
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	}

	get displayTime(){
		return this._timeEl.innerHTML;
	}

	set displayTime(value){
		this._timeEl.innerHTML = value;
	}

	get displayDate(){
		return this._dateEl.innerHTML;
	}

	set displayDate(value){
		this._dateEl.innerHTML = value;
	}

	get displayCalc(){
		return this._displayCalcEl.innerHTML;
	}

	set displayCalc(value){

		if(value.toString().length > 10){
			this.setError();
			return false;
		}

		this._displayCalcEl.innerHTML = value;
		
	}
	
	get currentDate(){
		return new Date();
	}

	set currentDate(value){
		this._currentDate = value;
	}
}