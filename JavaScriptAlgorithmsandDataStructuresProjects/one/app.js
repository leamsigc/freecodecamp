const form = document.querySelector('form[data-js="form-js"]');

// console.log(form);
 form && form.addEventListener('submit', e => {
    e.preventDefault();
    const  phoneToCheck = document.querySelector('#phone-js').value;
    const displayResult = document.querySelector('div[data-js="display-js"]');

    if(checkTelephone(phoneToCheck)){
        displayResult.innerHTML = `
        <strong>Good job! That is a valid US phone number</strong>
        `;
        return;
    }
    displayResult.innerHTML = `
        <strong>Please enter a valid US number...</strong>
        `;
 });

 function checkTelephone(str){
     const regex = /^(1\s|1)?(-|\s)?(\(\d{3}\)|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/;

     return regex.test(str);
 }