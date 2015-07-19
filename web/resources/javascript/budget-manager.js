
window.onload = function(e){
	e.preventDefault();

	xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://127.0.0.1:8889/transactions');
	xhr.onload = function(){
		displayTransactions(JSON.parse(this.responseText));
	};
	xhr.send();
};

function displayTransactions(transactions)
{
	var list = document.getElementById('transactions-list');
	var nbTransactions = transactions.length;
	var html = '';

	for(i = 0; i < nbTransactions; i++)
	{
		transaction = transactions[i];
		html += "<li>" + transaction["wording"] + " " + transaction["amount"] + "€</li>";
	}

	list.innerHTML = html;
};