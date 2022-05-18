const optionBtns = document.querySelectorAll('.menu-option_btn');

const orderForm = document.getElementById('order_form');
const optionsInp = document.getElementById('menu_options');

function selectOptions(ev) {
	const selectedBtn = ev.target.closest('.menu-option_btn');

	// Toggle the selection
	selectedBtn.dataset.selected = selectedBtn.dataset.selected === 'true' ? 'false' : 'true';
	selectedBtn.classList.toggle('bg-blue-300', selectedBtn.dataset.selected === 'true');

	// Get all new options
	const selected = [...optionBtns].filter((btn) => btn.dataset.selected === 'true').map((btn) => btn.value);

	// Set the options input value
	optionsInp.value = selected.join(',');
}

optionBtns.forEach((btn) => btn.addEventListener('click', selectOptions));
