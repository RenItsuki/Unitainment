document.querySelectorAll(".delete-btn").forEach(btn => {

btn.addEventListener("click", function(){

if(!confirm("Delete this media?")){

event.preventDefault()

}

})

})